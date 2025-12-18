import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';

// Model fallback chain: Pro → Flash → Flash Lite
const GEMINI_MODELS = {
  PRO: 'gemini-3-flash-preview',
  FLASH: 'gemini-2.5-flash',
  FLASH_LITE: 'gemini-2.5-flash-lite'
};

const MODEL_FALLBACK_CHAIN = [
  GEMINI_MODELS.PRO,
  GEMINI_MODELS.FLASH,
  GEMINI_MODELS.FLASH_LITE
];

/**
 * Initialize Gemini AI client
 */
function initializeGemini() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not found in environment variables');
  }

  return new GoogleGenerativeAI(apiKey);
}

/**
 * Initialize Gemini File Manager
 */
function initializeFileManager() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not found in environment variables');
  }

  return new GoogleAIFileManager(apiKey);
}

/**
 * Check if error is a rate limit error
 * @param {Error} error - Error object
 * @returns {boolean} - True if rate limit error
 */
function isRateLimitError(error) {
  const errorMessage = error.message?.toLowerCase() || '';
  const errorString = error.toString().toLowerCase();

  return (
    error.status === 429 ||
    errorMessage.includes('rate limit') ||
    errorMessage.includes('quota') ||
    errorMessage.includes('resource_exhausted') ||
    errorMessage.includes('429') ||
    errorString.includes('rate limit') ||
    errorString.includes('quota')
  );
}

/**
 * Upload file to Gemini File API using GoogleAIFileManager
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} mimeType - File MIME type
 * @param {string} displayName - Display name for the file
 * @returns {Promise<Object>} - Uploaded file object with URI
 */
async function uploadFileToGemini(fileBuffer, mimeType, displayName) {
  const fs = await import('fs');
  const path = await import('path');
  const os = await import('os');

  // Create a temporary file (GoogleAIFileManager requires file path)
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `resume-${Date.now()}.tmp`);

  try {
    // Write buffer to temp file
    fs.writeFileSync(tempFilePath, fileBuffer);

    // Initialize file manager
    const fileManager = initializeFileManager();

    // Upload to Gemini File API
    const uploadResult = await fileManager.uploadFile(tempFilePath, {
      mimeType: mimeType,
      displayName: displayName,
    });

    console.log(`✓ File uploaded to Gemini: ${uploadResult.file.displayName}`);
    console.log(`  URI: ${uploadResult.file.uri}`);

    // Clean up temp file
    fs.unlinkSync(tempFilePath);

    return uploadResult.file;
  } catch (error) {
    // Clean up temp file on error
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    throw error;
  }
}

/**
 * Generate the comprehensive analysis prompt with AI-powered insights
 */
function generateAnalysisPrompt(jobDescription) {
  return `You are an expert ATS (Applicant Tracking System) analyzer with deep hiring experience. Analyze this job description and the resume document I've provided.

=== JOB DESCRIPTION ===
${jobDescription}

=== YOUR TASK ===
Provide a comprehensive, intelligent ATS analysis with actionable insights. The resume is attached as a document file.

=== REQUIRED OUTPUT FORMAT ===
Return ONLY valid JSON (no markdown, no code blocks, no explanations) with this EXACT structure:

{
  "job_skills": {
    "technical_skills": ["skill1", "skill2"],
    "soft_skills": ["skill1", "skill2"],
    "certifications": ["cert1", "cert2"],
    "tools_technologies": ["tool1", "tool2"],
    "experience_requirements": {
      "years_required": <number or null>,
      "level": "entry|mid|senior|lead|executive"
    }
  },
  "resume_skills": {
    "technical_skills": ["skill1", "skill2"],
    "soft_skills": ["skill1", "skill2"],
    "certifications": ["cert1", "cert2"],
    "tools_technologies": ["tool1", "tool2"],
    "experience_years": <number>,
    "experience_level": "entry|mid|senior|lead|executive"
  },
  "matching_analysis": {
    "matched_technical_skills": ["skill1", "skill2"],
    "missing_technical_skills": ["skill1", "skill2"],
    "matched_soft_skills": ["skill1", "skill2"],
    "missing_soft_skills": ["skill1", "skill2"],
    "matched_tools": ["tool1", "tool2"],
    "missing_tools": ["tool1", "tool2"],
    "matched_certifications": ["cert1"],
    "missing_certifications": ["cert1"]
  },
  "scoring": {
    "ats_score": {
      "value": <0-100>,
      "formula": "Weighted average: (tech_skills * 0.40 + soft_skills * 0.15 + tools * 0.25 + certs * 0.10 + experience * 0.10)",
      "weights": {
        "technical_skills": 0.40,
        "soft_skills": 0.15,
        "tools_technologies": 0.25,
        "certifications": 0.10,
        "experience_match": 0.10
      },
      "component_scores": {
        "technical_skills_score": <0-100>,
        "soft_skills_score": <0-100>,
        "tools_score": <0-100>,
        "certifications_score": <0-100>,
        "experience_score": <0-100>
      }
    },
    "experience_match": {
      "value": <0-100>,
      "formula": "Comparison of years and level: exact match = 100, close = 80, below = 60, above = 70",
      "details": {
        "years_match_percentage": <0-100>,
        "level_match": "exact|close|below|above"
      }
    },
    "skill_proficiency": {
      "technical_proficiency": <0-100>,
      "soft_skills_proficiency": <0-100>,
      "formula": "Based on context depth and evidence in resume"
    }
  },
  "ai_insights": {
    "experience_gap_analysis": {
      "required_years": <number>,
      "candidate_years": <number>,
      "gap": <number (can be negative if exceeds)>,
      "insight": "AI-generated detailed explanation of experience gap",
      "suggestions": ["Specific suggestion 1", "Specific suggestion 2"]
    },
    "critical_missing_skills": [
      {
        "skill": "skill_name",
        "importance": "why this skill matters for the role",
        "how_to_demonstrate": "actionable advice on showcasing this skill"
      }
    ]
  },
  "recommendations": {
    "skills_to_add": [
      {
        "skill": "skill_name",
        "category": "technical|soft_skill|tool|certification",
        "priority": "critical|high|medium|low",
        "impact": "5.2%",
        "suggested_experience_bullets": [
          "Suggested bullet point 1 incorporating this skill",
          "Suggested bullet point 2 for project section"
        ]
      }
    ],
    "resume_improvements": [
      "Suggestion 1",
      "Suggestion 2"
    ],
    "experience_section_improvements": [
      {
        "current_weakness": "Description of what's missing",
        "suggested_bullet": "Replacement or new bullet point to add",
        "skills_addressed": ["skill1", "skill2"]
      }
    ],
    "project_section_improvements": [
      {
        "missing_skill": "skill_name",
        "suggested_project_description": "A project description that demonstrates this skill"
      }
    ],
    "estimated_score_with_improvements": <0-100>
  }
}

IMPORTANT RULES FOR AI INSIGHTS:
- Generate SPECIFIC experience gap insights (e.g., "JD requires 5 years but resume shows 1 year - consider highlighting leadership in your limited experience")
- For each missing skill, provide 2 CONCRETE bullet points that could be added to experience/project sections
- Make bullet points realistic and tailored to the candidate's background
- In experience_section_improvements, suggest SPECIFIC replacements or additions
- In project_section_improvements, create actual project descriptions that demonstrate missing skills
- Be actionable and specific, not generic

TECHNICAL RULES:
- Extract key skills, technologies, tools, and certifications (prioritize most relevant)
- Normalize skill names (JavaScript, javascript, JS → JavaScript)
- Consider synonyms and variations
- All scores must be 0-100 range
- Calculate impact_per_skill accurately for what-if simulator
- Keep skill lists focused and relevant (max 15 per category)
- Output ONLY valid JSON with NO newlines inside string values
- Use single spaces instead of newlines in descriptions
- Ensure all strings are properly escaped and terminated
- Do NOT include markdown code blocks, explanations, or any text outside the JSON
- CRITICAL: Complete the entire JSON structure - do not truncate`;
}

/**
 * Try to analyze with a specific model using uploaded file
 * @param {GoogleGenerativeAI} genAI - Initialized Gemini client
 * @param {string} modelName - Model name to use
 * @param {string} prompt - Analysis prompt
 * @param {Object} uploadedFile - Uploaded file object from Gemini File API
 * @returns {Promise<Object>} - Analysis result with model name
 */
async function tryAnalyzeWithModel(genAI, modelName, prompt, uploadedFile) {
  const model = genAI.getGenerativeModel({ model: modelName });

  // Configure generation with JSON response
  const generationConfig = {
    temperature: 0.1,  // Very low temperature for consistent JSON
    topK: 20,
    topP: 0.9,
    responseMimeType: 'application/json',  // Force JSON output
  };

  console.log(`Attempting analysis with ${modelName}...`);

  // Build content parts with file reference
  const parts = [{ text: prompt }];

  if (uploadedFile) {
    parts.push({
      fileData: {
        mimeType: uploadedFile.mimeType,
        fileUri: uploadedFile.uri
      }
    });
  }

  const result = await model.generateContent({
    contents: [{ role: 'user', parts }],
    generationConfig,
  });

  const response = result.response;
  const textResponse = response.text();

  return { textResponse, modelUsed: modelName };
}

/**
 * Analyze resume against job description using Gemini AI with model fallback
 * @param {string} jobDescription - Job description text
 * @param {Buffer} resumeFileBuffer - Resume file buffer
 * @param {string} fileName - Original filename
 * @returns {Promise<Object>} - Structured analysis result
 */
export async function analyzeResumeWithAI(jobDescription, resumeFileBuffer, fileName) {
  const genAI = initializeGemini();

  // Determine MIME type from filename
  let mimeType = 'application/pdf'; // default
  if (fileName.toLowerCase().endsWith('.docx')) {
    mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  } else if (fileName.toLowerCase().endsWith('.doc')) {
    mimeType = 'application/msword';
  } else if (fileName.toLowerCase().endsWith('.txt')) {
    mimeType = 'text/plain';
  }

  let uploadedFile = null;

  try {
    // Upload file to Gemini File API
    console.log(`Uploading ${fileName} to Gemini File API...`);
    uploadedFile = await uploadFileToGemini(resumeFileBuffer, mimeType, fileName);

    // Initialize file manager for status checks
    const fileManager = initializeFileManager();

    // Wait for file to be processed (if needed)
    let fileStatus = await fileManager.getFile(uploadedFile.name);
    let waitCount = 0;
    while (fileStatus.state === 'PROCESSING' && waitCount < 10) {
      console.log('Waiting for file processing...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      fileStatus = await fileManager.getFile(uploadedFile.name);
      waitCount++;
    }

    if (fileStatus.state === 'FAILED') {
      throw new Error('File processing failed in Gemini API');
    }

    console.log('✓ File ready for analysis');

    const prompt = generateAnalysisPrompt(jobDescription);

    let lastError = null;
    let textResponse = null;
    let modelUsed = null;

    // Try each model in the fallback chain
    for (let i = 0; i < MODEL_FALLBACK_CHAIN.length; i++) {
      const currentModel = MODEL_FALLBACK_CHAIN[i];

      try {
        const result = await tryAnalyzeWithModel(genAI, currentModel, prompt, uploadedFile);
        textResponse = result.textResponse;
        modelUsed = result.modelUsed;
        console.log(`✓ Successfully analyzed with ${modelUsed}`);
        break; // Success, exit loop
      } catch (error) {
        lastError = error;

        // Check if it's a rate limit error
        if (isRateLimitError(error)) {
          console.log(`✗ Rate limit hit on ${currentModel}, trying next model...`);

          // If this is the last model, throw the error
          if (i === MODEL_FALLBACK_CHAIN.length - 1) {
            console.error('All models exhausted due to rate limits');
            throw new Error('All available models are rate limited. Please try again in a few minutes.');
          }

          // Continue to next model
          continue;
        } else {
          // Non-rate-limit error, throw immediately
          console.error(`Error with ${currentModel}:`, error.message);
          throw error;
        }
      }
    }

    // If we couldn't get a response from any model
    if (!textResponse) {
      throw lastError || new Error('Failed to analyze resume with any available model');
    }

    try {
      console.log('Received AI response, parsing JSON...');

      // Save raw response to file for debugging
      // const fs = await import('fs');
      // const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      // const debugPath = `./debug-response-${timestamp}.json`;
      // fs.writeFileSync(debugPath, textResponse, 'utf-8');
      // console.log(`Raw AI response saved to: ${debugPath} (Model: ${modelUsed})`);

      // Parse JSON response with robust cleaning
      let jsonText = textResponse.trim();

      // Remove markdown code blocks
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '');
      }

      // Try to extract JSON if there's extra text
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      // Clean up common JSON issues
      jsonText = jsonText
        .replace(/\\n/g, ' ')  // Replace literal \n with spaces
        .replace(/\n/g, ' ')   // Replace actual newlines with spaces
        .replace(/\r/g, '')    // Remove carriage returns
        .replace(/\t/g, ' ')   // Replace tabs with spaces
        .replace(/\s+/g, ' ')  // Collapse multiple spaces
        .trim();

      let analysisResult;
      try {
        analysisResult = JSON.parse(jsonText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError.message);
        console.error('Problematic JSON snippet:', jsonText.substring(0, 500));
        console.error('JSON end snippet:', jsonText.substring(jsonText.length - 200));

        throw new Error(`Failed to parse AI response: ${parseError.message}`);
      }

      // Validate required structure
      validateAnalysisResult(analysisResult);

      console.log(`AI analysis completed successfully using ${modelUsed}`);
      return analysisResult;

    } catch (error) {
      console.error('Gemini AI analysis error:', error);

      // Categorize errors for better user feedback
      if (error.message.includes('API key') || error.message.includes('GEMINI_API_KEY')) {
        throw new Error('Invalid or missing API key. Please check GEMINI_API_KEY configuration.');
      } else if (error.message.includes('All available models are rate limited')) {
        throw error; // Pass through our custom rate limit message
      } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
        throw new Error('API rate limit exceeded. Please try again in a few moments.');
      } else if (error.message.includes('timeout')) {
        throw new Error('AI analysis timed out. The resume or job description may be too large.');
      } else if (error.name === 'SyntaxError' || error.message.includes('JSON')) {
        throw new Error('AI returned invalid response format. Please try again.');
      } else {
        throw new Error(`AI analysis failed: ${error.message}`);
      }
    }
  } finally {
    // Clean up uploaded file from Gemini
    if (uploadedFile) {
      try {
        const fileManager = initializeFileManager();
        await fileManager.deleteFile(uploadedFile.name);
        console.log('✓ Cleaned up uploaded file from Gemini');
      } catch (cleanupError) {
        console.warn('Warning: Failed to delete uploaded file:', cleanupError.message);
      }
    }
  }
}

/**
 * Validate the AI response has required structure
 */
function validateAnalysisResult(result) {
  const requiredKeys = [
    'job_skills',
    'resume_skills',
    'matching_analysis',
    'scoring',
    'ai_insights',
    'recommendations'
  ];

  for (const key of requiredKeys) {
    if (!result[key]) {
      throw new Error(`Invalid AI response: missing '${key}' field`);
    }
  }

  // Validate scoring structure
  if (!result.scoring.ats_score || typeof result.scoring.ats_score.value !== 'number') {
    throw new Error('Invalid AI response: missing or invalid ats_score');
  }

  // Validate ai_insights structure
  if (!result.ai_insights.experience_gap_analysis) {
    throw new Error('Invalid AI response: missing experience_gap_analysis in ai_insights');
  }

  // Validate recommendations structure
  if (!result.recommendations.skills_to_add) {
    throw new Error('Invalid AI response: missing skills_to_add in recommendations');
  }
}

/**
 * Extract skills from job description only (optional utility function)
 */
export async function extractJobSkills(jobDescription) {
  try {
    const genAI = initializeGemini();
    const model = genAI.getGenerativeModel({ model: GEMINI_MODELS.FLASH });

    const prompt = `Extract all skills, technologies, tools, and certifications from this job description.
Return ONLY a JSON array of strings, no other text.

JOB DESCRIPTION:
${jobDescription}

OUTPUT FORMAT (no markdown code blocks):
["skill1", "skill2", "skill3"]
`;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text().trim();

    // Parse and clean
    let jsonText = textResponse;
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json?\n?/, '').replace(/\n?```$/, '');
    }

    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error extracting job skills:', error);
    throw new Error(`Failed to extract job skills: ${error.message}`);
  }
}
