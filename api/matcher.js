import formidable from 'formidable';
import { readFileSync, unlinkSync } from 'fs';
import os from 'os';
import { analyzeResumeWithAI, analyzeStandaloneResumeWithAI } from '../lib/services/geminiService.js';
import { initLangChainEnv } from '../lib/services/langchainEnv.js';
import { logger, sanitizeHeaders } from '../lib/utils/logger.js';

// Disable default Vercel body parsing for formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.txt'];

function isAllowedFileType(filename) {
  if (!filename) return false;
  const lower = filename.toLowerCase();
  return ALLOWED_EXTENSIONS.some(ext => lower.endsWith(ext));
}

function getFormFieldString(val) {
  if (!val) return '';
  if (Array.isArray(val)) {
    return (val[0] || '').toString().trim();
  }
  return val.toString().trim();
}

export default async function handler(req, res) {
  initLangChainEnv();

  logger.info(`[Matcher API] Invoked - Method: ${req.method}`);
  logger.debug('[Matcher API] Headers:', sanitizeHeaders(req.headers));

  if (req.method !== 'POST') {
    logger.warn('[Matcher API] Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      logger.error('[Matcher API] GEMINI_API_KEY missing from environment');
      return res.status(500).json({
        error: 'Server configuration error: GEMINI_API_KEY is not configured.'
      });
    }

    const form = formidable({
      uploadDir: os.tmpdir(),
      maxFileSize: 4 * 1024 * 1024,
      multiples: true,
      keepExtensions: true
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        logger.error('[Matcher API] Form parse error:', err);
        return res.status(400).json({
          error: err.code === 'LIMIT_FILE_SIZE'
            ? 'File size exceeds 4MB limit'
            : 'Failed to parse form data'
        });
      }

      const tempFilePaths = [];

      try {
        const jobDescription = getFormFieldString(fields.job_description);
        const reqMode = getFormFieldString(fields.analysis_mode || fields.mode);

        let resumeFiles = files.resumes || [];
        if (!Array.isArray(resumeFiles)) {
          resumeFiles = resumeFiles ? [resumeFiles] : [];
        }

        for (const file of resumeFiles) {
          if (file.filepath) {
            tempFilePaths.push(file.filepath);
          }
        }

        const isStandalone = reqMode === 'resume_only' || (!jobDescription && reqMode !== 'job_match');

        if (!isStandalone && !jobDescription) {
          return res.status(400).json({ error: 'Please provide a job description for Job Match mode' });
        }

        if (resumeFiles.length === 0) {
          return res.status(400).json({ error: 'Please upload at least one resume' });
        }

        if (resumeFiles.length > 1) {
          return res.status(400).json({
            error: 'Please upload only ONE resume at a time for AI analysis'
          });
        }

        if (resumeFiles.length === 0) {
          return res.status(400).json({ error: 'Please upload at least one resume' });
        }

        if (resumeFiles.length > 10) {
          return res.status(400).json({
            error: 'Please upload a maximum of 10 resumes at a time for batch analysis'
          });
        }

        const resultsData = [];
        let aiAnalysis = null;

        for (const file of resumeFiles) {
          const filename = file.originalFilename || file.newFilename;

          if (!isAllowedFileType(filename)) {
            resultsData.push({
              filename: filename,
              error: `Unsupported file type: '${filename}'. Allowed formats: PDF, DOCX, DOC, TXT.`
            });
            continue;
          }

          try {
            const buffer = readFileSync(file.filepath);
            logger.info(`[Matcher API] Analyzing resume '${filename}' in mode ${isStandalone ? 'resume_only' : 'job_match'}...`);

            if (isStandalone) {
              aiAnalysis = await analyzeStandaloneResumeWithAI(buffer, filename);
              resultsData.push({
                filename: filename,
                analysis_mode: 'resume_only',
                ats_score: aiAnalysis.overall_health_score,
                standalone_analysis: aiAnalysis
              });
            } else {
              aiAnalysis = await analyzeResumeWithAI(jobDescription, buffer, filename);
              resultsData.push({
                filename: filename,
                analysis_mode: 'job_match',
                raw_text_parsed: aiAnalysis.raw_text_parsed || '',
                matched_skills: [
                  ...(aiAnalysis.matching_analysis?.matched_technical_skills || []),
                  ...(aiAnalysis.matching_analysis?.matched_soft_skills || []),
                  ...(aiAnalysis.matching_analysis?.matched_tools || []),
                  ...(aiAnalysis.matching_analysis?.matched_certifications || [])
                ],
                missing_skills: [
                  ...(aiAnalysis.matching_analysis?.missing_technical_skills || []),
                  ...(aiAnalysis.matching_analysis?.missing_soft_skills || []),
                  ...(aiAnalysis.matching_analysis?.missing_tools || []),
                  ...(aiAnalysis.matching_analysis?.missing_certifications || [])
                ],
                ats_score: aiAnalysis.scoring?.ats_score?.value || 0,
                detailed_scoring: {
                  ats_score: aiAnalysis.scoring?.ats_score,
                  experience_match: aiAnalysis.scoring?.experience_match,
                  skill_proficiency: aiAnalysis.scoring?.skill_proficiency
                },
                formatting_checks: aiAnalysis.formatting_checks,
                ai_cover_letter: aiAnalysis.ai_cover_letter,
                interview_prep: aiAnalysis.interview_prep,
                skills_breakdown: {
                  technical_skills: {
                    matched: aiAnalysis.matching_analysis?.matched_technical_skills || [],
                    missing: aiAnalysis.matching_analysis?.missing_technical_skills || []
                  },
                  soft_skills: {
                    matched: aiAnalysis.matching_analysis?.matched_soft_skills || [],
                    missing: aiAnalysis.matching_analysis?.missing_soft_skills || []
                  },
                  tools_and_technologies: {
                    matched: aiAnalysis.matching_analysis?.matched_tools || [],
                    missing: aiAnalysis.matching_analysis?.missing_tools || []
                  },
                  certifications: {
                    matched: aiAnalysis.matching_analysis?.matched_certifications || [],
                    missing: aiAnalysis.matching_analysis?.missing_certifications || []
                  }
                },
                ai_insights: aiAnalysis.ai_insights,
                recommendations: aiAnalysis.recommendations
              });
            }
          } catch (error) {
            logger.error(`[Matcher API] Error processing file '${filename}':`, error);
            resultsData.push({
              filename: filename,
              analysis_mode: isStandalone ? 'resume_only' : 'job_match',
              ats_score: 0,
              error: process.env.NODE_ENV === 'production'
                ? 'Failed to process file due to analysis error'
                : `Failed to process file: ${error.message}`,
            });
          }
        }

        const allJobSkills = (!isStandalone && aiAnalysis && aiAnalysis.job_skills) ? [
          ...(aiAnalysis.job_skills.technical_skills || []),
          ...(aiAnalysis.job_skills.soft_skills || []),
          ...(aiAnalysis.job_skills.tools_technologies || []),
          ...(aiAnalysis.job_skills.certifications || [])
        ] : [];

        return res.status(200).json({
          message: isStandalone ? 'AI-powered Standalone ATS Audit complete' : 'AI-powered ATS Job Match analysis complete',
          analysis_mode: isStandalone ? 'resume_only' : 'job_match',
          relevant_skills: allJobSkills,
          job_requirements: (!isStandalone && aiAnalysis) ? aiAnalysis.job_skills : null,
          job_description: isStandalone ? '' : jobDescription,
          top_resumes: resultsData,
          analysis_powered_by: 'Google Gemini via LangChain & LangGraph'
        });

      } catch (error) {
        logger.error('[Matcher API] Processing error:', error);
        return res.status(500).json({
          error: 'Internal server error',
          ...(process.env.NODE_ENV !== 'production' && { details: error.message })
        });
      } finally {
        // Clean up temp files from serverless /tmp
        for (const filePath of tempFilePaths) {
          try {
            unlinkSync(filePath);
            logger.debug(`[Matcher API] Cleaned temp file: ${filePath}`);
          } catch (unlinkErr) {
            // Ignore if file already cleaned
          }
        }
      }
    });
  } catch (error) {
    logger.error('[Matcher API] Top-level handler error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      ...(process.env.NODE_ENV !== 'production' && { details: error.message })
    });
  }
}
