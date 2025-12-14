import formidable from 'formidable';
import { readFileSync } from 'fs';
import { analyzeResumeWithAI } from '../lib/services/geminiService.js';

// Disable body parsing for formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log('[Matcher] Function invoked');
  console.log('[Matcher] Method:', req.method);
  console.log('[Matcher] Headers:', JSON.stringify(req.headers));

  // Only allow POST
  if (req.method !== 'POST') {
    console.log('[Matcher] Rejected - wrong method');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate Gemini API key
    console.log('[Matcher] Checking API key...');
    if (!process.env.GEMINI_API_KEY) {
      console.error('[Matcher] API key missing');
      return res.status(500).json({
        error: 'Server configuration error: GEMINI_API_KEY not configured'
      });
    }
    console.log('[Matcher] API key present');

    // Parse form data with formidable
    const form = formidable({
      maxFileSize: 4 * 1024 * 1024, // 4MB per file
      multiples: true,
    });

    console.log('[Matcher] Starting form parse...');
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('[Matcher] Form parse error:', err);
        return res.status(400).json({ error: 'Failed to parse form data' });
      }

      console.log('[Matcher] Form parsed successfully');
      console.log('[Matcher] Fields:', Object.keys(fields));
      console.log('[Matcher] Files:', Object.keys(files));

      try {
        // Extract job description
        const jobDescription = (fields.job_description?.[0] || fields.job_description || '').trim();

        // Extract resume files (handle both array and single file)
        let resumeFiles = files.resumes || [];
        if (!Array.isArray(resumeFiles)) {
          resumeFiles = resumeFiles ? [resumeFiles] : [];
        }

        // Validate inputs
        if (!jobDescription) {
          return res.status(400).json({ error: 'Please provide a job description' });
        }

        if (resumeFiles.length === 0) {
          return res.status(400).json({ error: 'Please upload at least one resume' });
        }

        // Process ONE resume at a time for AI analysis
        if (resumeFiles.length > 1) {
          return res.status(400).json({
            error: 'Please upload only ONE resume at a time for AI analysis'
          });
        }

        // Process the single resume
        const resultsData = [];
        const file = resumeFiles[0];
        let aiAnalysis = null;

        try {
          // Read file buffer
          const buffer = readFileSync(file.filepath);

          // Send file directly to Gemini AI
          console.log(`Sending ${file.originalFilename} directly to Gemini AI...`);
          aiAnalysis = await analyzeResumeWithAI(
            jobDescription,
            buffer,
            file.originalFilename || file.newFilename
          );

          // Format response for frontend
          resultsData.push({
            filename: file.originalFilename || file.newFilename,

            // Traditional fields (for backward compatibility)
            matched_skills: [
              ...aiAnalysis.matching_analysis.matched_technical_skills,
              ...aiAnalysis.matching_analysis.matched_soft_skills,
              ...aiAnalysis.matching_analysis.matched_tools,
              ...aiAnalysis.matching_analysis.matched_certifications
            ],
            missing_skills: [
              ...aiAnalysis.matching_analysis.missing_technical_skills,
              ...aiAnalysis.matching_analysis.missing_soft_skills,
              ...aiAnalysis.matching_analysis.missing_tools,
              ...aiAnalysis.matching_analysis.missing_certifications
            ],
            ats_score: aiAnalysis.scoring.ats_score.value,

            // Enhanced metrics
            detailed_scoring: {
              ats_score: aiAnalysis.scoring.ats_score,
              experience_match: aiAnalysis.scoring.experience_match,
              skill_proficiency: aiAnalysis.scoring.skill_proficiency
            },

            // Categorized skills
            skills_breakdown: {
              technical_skills: {
                matched: aiAnalysis.matching_analysis.matched_technical_skills,
                missing: aiAnalysis.matching_analysis.missing_technical_skills
              },
              soft_skills: {
                matched: aiAnalysis.matching_analysis.matched_soft_skills,
                missing: aiAnalysis.matching_analysis.missing_soft_skills
              },
              tools_and_technologies: {
                matched: aiAnalysis.matching_analysis.matched_tools,
                missing: aiAnalysis.matching_analysis.missing_tools
              },
              certifications: {
                matched: aiAnalysis.matching_analysis.matched_certifications,
                missing: aiAnalysis.matching_analysis.missing_certifications
              }
            },

            // AI-generated insights
            ai_insights: aiAnalysis.ai_insights,

            // Recommendations
            recommendations: aiAnalysis.recommendations
          });

        } catch (error) {
          console.error(`Error processing ${file.originalFilename}:`, error.message);
          resultsData.push({
            filename: file.originalFilename || file.newFilename,
            matched_skills: [],
            missing_skills: [],
            ats_score: 0,
            error: `Failed to process file: ${error.message}`,
          });
        }

        // Extract all job skills from AI analysis
        const allJobSkills = aiAnalysis ? [
          ...aiAnalysis.job_skills.technical_skills,
          ...aiAnalysis.job_skills.soft_skills,
          ...aiAnalysis.job_skills.tools_technologies,
          ...aiAnalysis.job_skills.certifications
        ] : [];

        // Return results with enhanced structure
        return res.status(200).json({
          message: 'AI-powered ATS analysis complete',
          relevant_skills: allJobSkills,
          job_requirements: aiAnalysis ? aiAnalysis.job_skills : null,
          job_description: jobDescription,
          top_resumes: resultsData,
          analysis_powered_by: 'Google Gemini 2.0 Flash'
        });

      } catch (error) {
        console.error('Processing error:', error);
        return res.status(500).json({
          error: 'Internal server error',
          details: error.message
        });
      }
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
