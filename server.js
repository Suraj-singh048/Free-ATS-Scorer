import express from 'express';
import formidable from 'formidable';
import { readFileSync, unlinkSync } from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeResumeWithAI, analyzeStandaloneResumeWithAI } from './lib/services/geminiService.js';
import { initLangChainEnv } from './lib/services/langchainEnv.js';
import { logger, sanitizeHeaders } from './lib/utils/logger.js';

// Load environment variables
dotenv.config();
initLangChainEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.txt'];

function isAllowedFileType(filename) {
  if (!filename) return false;
  const lower = filename.toLowerCase();
  return ALLOWED_EXTENSIONS.some(ext => lower.endsWith(ext));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    ai_enabled: !!process.env.GEMINI_API_KEY,
    ai_provider: 'Google Gemini via LangChain & LangGraph',
    langsmith_tracing: process.env.LANGCHAIN_TRACING_V2 === 'true',
    langsmith_project: process.env.LANGCHAIN_PROJECT || 'ATS_ANALYZER'
  });
});

function getFormFieldString(val) {
  if (!val) return '';
  if (Array.isArray(val)) {
    return (val[0] || '').toString().trim();
  }
  return val.toString().trim();
}

// Main matcher endpoint - AI-Powered
app.post('/api/matcher', async (req, res) => {
  logger.info(`[Server Matcher] Request received from ${req.ip}`);
  logger.debug('[Server Matcher] Request headers:', sanitizeHeaders(req.headers));

  try {
    // Validate Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      logger.error('[Server Matcher] GEMINI_API_KEY missing');
      return res.status(500).json({
        error: 'Server configuration error: GEMINI_API_KEY not configured'
      });
    }

    // Parse form data with formidable
    const form = formidable({
      uploadDir: os.tmpdir(),
      maxFileSize: 4 * 1024 * 1024, // 4MB per file
      multiples: true,
      keepExtensions: true
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        logger.error('[Server Matcher] Form parse error:', err);
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
            logger.info(`[Server Matcher] Processing file ${filename} in mode: ${isStandalone ? 'resume_only' : 'job_match'}...`);

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
            logger.error(`[Server Matcher] Error processing ${filename}:`, error);
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
        logger.error('[Server Matcher] Processing error:', error);
        return res.status(500).json({
          error: 'Internal server error',
          ...(process.env.NODE_ENV !== 'production' && { details: error.message })
        });
      } finally {
        for (const filePath of tempFilePaths) {
          try {
            unlinkSync(filePath);
            logger.debug(`[Server Matcher] Cleaned temp file: ${filePath}`);
          } catch (unlinkErr) {
            // Ignore if file already cleaned
          }
        }
      }
    });
  } catch (error) {
    logger.error('[Server Matcher] API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      ...(process.env.NODE_ENV !== 'production' && { details: error.message })
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));

  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  logger.info(`✅ Server running on http://localhost:${PORT}`);
  logger.info(`📊 API endpoint: http://localhost:${PORT}/api/matcher`);
  logger.info(`🤖 AI Provider: Google Gemini via LangChain & LangGraph`);
  logger.info(`📡 LangSmith Tracing: ${process.env.LANGCHAIN_TRACING_V2 === 'true' ? 'Enabled ✓ (Project: ' + (process.env.LANGCHAIN_PROJECT || 'ATS_ANALYZER') + ')' : 'Disabled ✗'}`);
  logger.info(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔑 API Key configured: ${process.env.GEMINI_API_KEY ? 'Yes ✓' : 'No ✗'}`);
  if (!process.env.GEMINI_API_KEY) {
    logger.warn(`⚠️  WARNING: GEMINI_API_KEY not found in environment variables.`);
  }
});
