import { runATSWorkflow, runStandaloneResumeWorkflow, GEMINI_MODELS, MODEL_FALLBACK_CHAIN } from './atsGraph.js';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';
import { initLangChainEnv } from './langchainEnv.js';

initLangChainEnv();

export { GEMINI_MODELS, MODEL_FALLBACK_CHAIN };

/**
 * Analyze resume against job description using LangChain + LangGraph pipeline with LangSmith tracing
 * @param {string} jobDescription - Job description text
 * @param {Buffer} resumeFileBuffer - Resume file buffer
 * @param {string} fileName - Original filename
 * @returns {Promise<Object>} - Structured analysis result
 */
export async function analyzeResumeWithAI(jobDescription, resumeFileBuffer, fileName) {
  try {
    const { analysisResult, modelUsed } = await runATSWorkflow(
      jobDescription,
      resumeFileBuffer,
      fileName
    );

    console.log(`✓ AI analysis completed successfully using ${modelUsed} via LangGraph & LangSmith`);
    return analysisResult;
  } catch (error) {
    console.error('LangGraph ATS AI analysis error:', error);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
}

/**
 * Perform Standalone ATS Audit on resume (without Job Description)
 * @param {Buffer} resumeFileBuffer - Resume file buffer
 * @param {string} fileName - Original filename
 * @returns {Promise<Object>} - Standalone analysis result
 */
export async function analyzeStandaloneResumeWithAI(resumeFileBuffer, fileName) {
  try {
    const { analysisResult, modelUsed } = await runStandaloneResumeWorkflow(
      resumeFileBuffer,
      fileName
    );

    console.log(`✓ Standalone AI analysis completed successfully using ${modelUsed} via LangGraph & LangSmith`);
    return analysisResult;
  } catch (error) {
    console.error('LangGraph Standalone ATS AI analysis error:', error);
    throw new Error(`Standalone AI analysis failed: ${error.message}`);
  }
}

/**
 * Extract skills from job description using LangChain structured output
 * @param {string} jobDescription - Job description text
 * @returns {Promise<string[]>} - Extracted skills list
 */
export async function extractJobSkills(jobDescription) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not found in environment variables');
  }

  try {
    const llm = new ChatGoogleGenerativeAI({
      model: GEMINI_MODELS.FLASH,
      apiKey: apiKey,
      temperature: 0.1
    });

    const schema = z.object({
      skills: z.array(z.string()).describe("List of extracted skills, technologies, tools, and certifications")
    });

    const structuredLLM = llm.withStructuredOutput(schema);

    const prompt = `Extract all skills, technologies, tools, and certifications from this job description:

JOB DESCRIPTION:
${jobDescription}`;

    const result = await structuredLLM.invoke(prompt, {
      runName: 'Extract Job Skills',
      tags: ['job-skills-extraction', 'langchain']
    });

    return result.skills || [];
  } catch (error) {
    console.error('Error extracting job skills via LangChain:', error);
    throw new Error(`Failed to extract job skills: ${error.message}`);
  }
}
