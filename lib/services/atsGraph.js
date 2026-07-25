import { StateGraph, Annotation, END, START } from '@langchain/langgraph';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';
import { extractTextFromFile } from '../extractors/index.js';
import { initLangChainEnv } from './langchainEnv.js';
import { logger } from '../utils/logger.js';

// Ensure environment variables for LangChain and LangSmith are loaded
initLangChainEnv();

/**
 * Zod Schema for ATS Analysis structured output
 */
export const atsAnalysisSchema = z.object({
  raw_text_parsed: z.string().default(""),
  job_skills: z.object({
    technical_skills: z.array(z.string()).default([]),
    soft_skills: z.array(z.string()).default([]),
    certifications: z.array(z.string()).default([]),
    tools_technologies: z.array(z.string()).default([]),
    experience_requirements: z.object({
      years_required: z.number().nullable().optional(),
      level: z.string().default("mid")
    })
  }),
  resume_skills: z.object({
    technical_skills: z.array(z.string()).default([]),
    soft_skills: z.array(z.string()).default([]),
    certifications: z.array(z.string()).default([]),
    tools_technologies: z.array(z.string()).default([]),
    experience_years: z.number().default(0),
    experience_level: z.string().default("mid")
  }),
  matching_analysis: z.object({
    matched_technical_skills: z.array(z.string()).default([]),
    missing_technical_skills: z.array(z.string()).default([]),
    matched_soft_skills: z.array(z.string()).default([]),
    missing_soft_skills: z.array(z.string()).default([]),
    matched_tools: z.array(z.string()).default([]),
    missing_tools: z.array(z.string()).default([]),
    matched_certifications: z.array(z.string()).default([]),
    missing_certifications: z.array(z.string()).default([])
  }),
  scoring: z.object({
    ats_score: z.object({
      value: z.number().min(0).max(100),
      formula: z.string().default("Weighted average: (tech_skills * 0.40 + soft_skills * 0.15 + tools * 0.25 + certs * 0.10 + experience * 0.10)"),
      weights: z.object({
        technical_skills: z.number().default(0.40),
        soft_skills: z.number().default(0.15),
        tools_technologies: z.number().default(0.25),
        certifications: z.number().default(0.10),
        experience_match: z.number().default(0.10)
      }),
      component_scores: z.object({
        technical_skills_score: z.number().default(0),
        soft_skills_score: z.number().default(0),
        tools_score: z.number().default(0),
        certifications_score: z.number().default(0),
        experience_score: z.number().default(0)
      })
    }),
    experience_match: z.object({
      value: z.number().min(0).max(100),
      formula: z.string().default("Comparison of years and level: exact match = 100, close = 80, below = 60, above = 70"),
      details: z.object({
        years_match_percentage: z.number().default(100),
        level_match: z.string().default("exact")
      })
    }),
    skill_proficiency: z.object({
      technical_proficiency: z.number().default(0),
      soft_skills_proficiency: z.number().default(0),
      formula: z.string().default("Based on context depth and evidence in resume")
    })
  }),
  formatting_checks: z.object({
    multi_column_tables_warning: z.boolean().default(false),
    graphics_textboxes_warning: z.boolean().default(false),
    non_standard_headers_found: z.array(z.string()).default([]),
    date_formatting_issues: z.array(z.string()).default([]),
    missing_contact_info: z.array(z.string()).default([]),
    parsing_health_score: z.number().default(90)
  }),
  ai_cover_letter: z.object({
    headline: z.string().default("Application for Target Position"),
    opening_paragraph: z.string().default(""),
    body_paragraphs: z.array(z.string()).default([]),
    closing_paragraph: z.string().default(""),
    full_letter_text: z.string().default("")
  }),
  interview_prep: z.array(z.object({
    question_type: z.string().default("Technical"), // Technical, Behavioral, Skill Gap
    target_skill_or_gap: z.string(),
    question: z.string(),
    interviewer_intent: z.string(),
    suggested_star_answer: z.string()
  })).default([]),
  ai_insights: z.object({
    experience_gap_analysis: z.object({
      required_years: z.number().default(0),
      candidate_years: z.number().default(0),
      gap: z.number().default(0),
      insight: z.string().default(""),
      suggestions: z.array(z.string()).default([])
    }),
    critical_missing_skills: z.array(z.object({
      skill: z.string(),
      importance: z.string(),
      how_to_demonstrate: z.string()
    })).default([])
  }),
  recommendations: z.object({
    skills_to_add: z.array(z.object({
      skill: z.string(),
      category: z.string().default("technical"),
      priority: z.string().default("high"),
      impact: z.string().default("5%"),
      suggested_experience_bullets: z.array(z.string()).default([])
    })).default([]),
    resume_improvements: z.array(z.string()).default([]),
    experience_section_improvements: z.array(z.object({
      current_weakness: z.string(),
      suggested_bullet: z.string(),
      skills_addressed: z.array(z.string()).default([])
    })).default([]),
    project_section_improvements: z.array(z.object({
      missing_skill: z.string(),
      suggested_project_description: z.string()
    })).default([]),
    estimated_score_with_improvements: z.number().default(85)
  })
});

/**
 * Zod Schema for Standalone Resume Audit (No Job Description)
 */
export const standaloneResumeSchema = z.object({
  overall_health_score: z.number().min(0).max(100),
  summary_tagline: z.string().default("General ATS Resume Audit"),
  category_scores: z.object({
    impact_quantification: z.number().min(0).max(100).default(70),
    formatting_structure: z.number().min(0).max(100).default(70),
    brevity_style: z.number().min(0).max(100).default(70),
    skills_competencies: z.number().min(0).max(100).default(70)
  }),
  impact_analysis: z.object({
    quantified_bullets_percentage: z.number().min(0).max(100).default(0),
    total_bullets_analyzed: z.number().default(0),
    action_verb_rating: z.string().default("Moderate"), // Excellent, Strong, Moderate, Needs Improvement
    strong_action_verbs: z.array(z.string()).default([]),
    weak_action_verbs: z.array(z.string()).default([]),
    bullets_with_metrics_count: z.number().default(0),
    sample_strong_bullets: z.array(z.string()).default([])
  }),
  structure_analysis: z.object({
    contact_info: z.object({
      email_present: z.boolean().default(false),
      phone_present: z.boolean().default(false),
      linkedin_present: z.boolean().default(false),
      location_present: z.boolean().default(false),
      portfolio_github_present: z.boolean().default(false)
    }),
    missing_contact_fields: z.array(z.string()).default([]),
    sections_found: z.array(z.string()).default([]),
    missing_sections: z.array(z.string()).default([]),
    parseability_warning_count: z.number().default(0),
    parseability_notes: z.array(z.string()).default([])
  }),
  brevity_analysis: z.object({
    total_word_count: z.number().default(0),
    estimated_page_count: z.number().default(1),
    word_count_status: z.string().default("Optimal"), // Optimal, Too Short, Too Long
    bullet_length_status: z.string().default("Good"),
    buzzwords_cliches: z.array(z.string()).default([]),
    passive_voice_count: z.number().default(0),
    readability_level: z.string().default("Professional")
  }),
  skills_profile: z.object({
    technical_skills: z.array(z.string()).default([]),
    soft_skills: z.array(z.string()).default([]),
    tools_and_frameworks: z.array(z.string()).default([]),
    certifications: z.array(z.string()).default([]),
    skills_diversity_score: z.number().min(0).max(100).default(75)
  }),
  bullet_optimizations: z.array(z.object({
    original_bullet: z.string(),
    improved_bullet: z.string(),
    reason: z.string(),
    category: z.string().default("Impact & Quantification")
  })).default([]),
  strengths: z.array(z.string()).default([]),
  critical_fixes: z.array(z.object({
    priority: z.string().default("High"), // High, Medium, Low
    issue: z.string(),
    recommendation: z.string()
  })).default([])
});

/**
 * State annotation for the ATS Graph workflow
 */
const ATSStateAnnotation = Annotation.Root({
  jobDescription: Annotation({
    value: (x, y) => y ?? x,
    default: () => ''
  }),
  fileName: Annotation({
    value: (x, y) => y ?? x,
    default: () => ''
  }),
  fileBuffer: Annotation({
    value: (x, y) => y ?? x,
    default: () => null
  }),
  extractedText: Annotation({
    value: (x, y) => y ?? x,
    default: () => ''
  }),
  rawAnalysis: Annotation({
    value: (x, y) => y ?? x,
    default: () => null
  }),
  formattedResult: Annotation({
    value: (x, y) => y ?? x,
    default: () => null
  }),
  modelUsed: Annotation({
    value: (x, y) => y ?? x,
    default: () => ''
  }),
  error: Annotation({
    value: (x, y) => y ?? x,
    default: () => null
  })
});

// Original Model fallback chain: Pro → Flash → Flash Lite
export const GEMINI_MODELS = {
  PRO: 'gemini-3.6-flash',
  FLASH: 'gemini-3.1-flash-lite',
  FLASH_LITE: 'gemma-4-31b-a4b-it'
};

export const MODEL_FALLBACK_CHAIN = [
  GEMINI_MODELS.PRO,
  GEMINI_MODELS.FLASH,
  GEMINI_MODELS.FLASH_LITE
];

/**
 * Node 1: Extract & Prepare Input
 */
async function prepareInputNode(state) {
  const { fileBuffer, fileName } = state;
  let text = '';

  if (fileBuffer && fileName) {
    try {
      text = await extractTextFromFile(fileBuffer, fileName);
    } catch (err) {
      logger.warn(`[LangGraph prepareInput] Text extraction warning for ${fileName}:`, err.message);
    }
  }

  if (!text && fileBuffer) {
    text = fileBuffer.toString('utf-8');
  }

  return {
    extractedText: text
  };
}

/**
 * Node 2: Analyze ATS with LangChain Model Fallback Chain & Structured Output
 */
async function analyzeATSNode(state) {
  const { jobDescription, extractedText, fileName } = state;
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not found in environment variables');
  }

  const promptText = `You are an enterprise-grade ATS (Applicant Tracking System) analyzer, technical recruiter, and executive resume writer. Analyze this job description and candidate resume.

=== JOB DESCRIPTION ===
${jobDescription}

=== RESUME CONTENT (File: ${fileName}) ===
${extractedText || '[No readable text extracted from document file]'}

=== YOUR TASK ===
Perform a comprehensive, high-precision ATS audit:
1. Populate raw_text_parsed with exact extracted plain text.
2. Calculate multi-dimensional ATS score, matched and missing skills across technical, soft, tools, and certification categories.
3. Check document formatting red flags (multi-column warning, graphics/tables, date syntax consistency, missing contact info).
4. Tailored Cover Letter: Generate a full professional cover letter matching candidate experience to job requirements.
5. Technical & Behavioral Interview Prep: Generate 4-6 STAR-method interview questions targeting missing skills/gaps with suggested answers.`;

  let lastError = null;

  for (const modelName of MODEL_FALLBACK_CHAIN) {
    try {
      logger.info(`[LangGraph analyzeATS] Attempting analysis with ${modelName}...`);
      const llm = new ChatGoogleGenerativeAI({
        model: modelName,
        apiKey: apiKey,
        temperature: 0.1
      });

      const structuredLLM = llm.withStructuredOutput(atsAnalysisSchema);

      const result = await structuredLLM.invoke(promptText, {
        runName: `ATS Analysis Model Run - ${modelName}`,
        tags: ['ats-analyzer', modelName],
        metadata: { fileName }
      });

      if (result && !result.raw_text_parsed && extractedText) {
        result.raw_text_parsed = extractedText;
      }

      logger.info(`[LangGraph analyzeATS] Successfully analyzed with model: ${modelName}`);

      return {
        rawAnalysis: result,
        modelUsed: modelName
      };
    } catch (error) {
      logger.warn(`[LangGraph analyzeATS] Model ${modelName} failed:`, error.message);
      lastError = error;
    }
  }

  throw new Error(`LangGraph ATS Analysis failed across all models: ${lastError?.message || 'Unknown error'}`);
}

/**
 * Node 3: Format & Validate Final Results
 */
async function formatResultsNode(state) {
  const { rawAnalysis, modelUsed, extractedText } = state;

  if (!rawAnalysis) {
    throw new Error('No raw analysis result to format');
  }

  if (extractedText && (!rawAnalysis.raw_text_parsed || rawAnalysis.raw_text_parsed.length === 0)) {
    rawAnalysis.raw_text_parsed = extractedText;
  }

  return {
    formattedResult: rawAnalysis,
    modelUsed
  };
}

/**
 * Create and compile the LangGraph workflow
 */
const workflow = new StateGraph(ATSStateAnnotation)
  .addNode('prepareInput', prepareInputNode)
  .addNode('analyzeATS', analyzeATSNode)
  .addNode('formatResults', formatResultsNode)
  .addEdge(START, 'prepareInput')
  .addEdge('prepareInput', 'analyzeATS')
  .addEdge('analyzeATS', 'formatResults')
  .addEdge('formatResults', END);

export const atsGraph = workflow.compile();

/**
 * Helper to run the LangGraph workflow with LangSmith tracing enabled
 */
export async function runATSWorkflow(jobDescription, resumeFileBuffer, fileName) {
  initLangChainEnv();

  logger.info(`🚀 [LangGraph] Starting ATS Graph Workflow for ${fileName}...`);

  const initialInput = {
    jobDescription,
    fileBuffer: resumeFileBuffer,
    fileName
  };

  const finalState = await atsGraph.invoke(initialInput, {
    runName: `ATS Analysis Workflow - ${fileName}`,
    tags: ['ats-workflow', 'langgraph'],
    metadata: {
      fileName,
      jobDescriptionLength: jobDescription?.length || 0
    }
  });

  return {
    analysisResult: finalState.formattedResult,
    modelUsed: finalState.modelUsed
  };
}

/**
 * Node for Standalone Resume Analysis (No Job Description)
 */
async function analyzeStandaloneATSNode(state) {
  const { extractedText, fileName } = state;
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not found in environment variables');
  }

  const promptText = `You are a world-class ATS audit specialist and career strategist. Perform a rigorous, standalone ATS audit on this resume without a job description.

=== RESUME CONTENT (File: ${fileName}) ===
${extractedText || '[No readable text extracted from document file]'}

=== YOUR TASK ===
Evaluate the candidate's resume across 4 core pillars:
1. Impact & Quantification: Are bullet points backed by quantifiable metrics (%, $, numbers)? Are strong action verbs used instead of passive phrasing?
2. ATS Structure & Formatting: Are contact details (email, phone, linkedin, location, github) present? Are standard ATS section headers used?
3. Brevity, Style & Readability: Analyze word count, bullet length, passive voice, and clichés/buzzwords.
4. Skill Profile Audit: Extract all technical skills, soft skills, tools, and certifications present.

Provide specific original vs improved bullet suggestions and actionable critical fixes conforming strictly to the standalone schema.`;

  let lastError = null;

  for (const modelName of MODEL_FALLBACK_CHAIN) {
    try {
      logger.info(`[LangGraph analyzeStandaloneATS] Attempting analysis with ${modelName}...`);
      const llm = new ChatGoogleGenerativeAI({
        model: modelName,
        apiKey: apiKey,
        temperature: 0.1
      });

      const structuredLLM = llm.withStructuredOutput(standaloneResumeSchema);

      const result = await structuredLLM.invoke(promptText, {
        runName: `Standalone Resume Audit Run - ${modelName}`,
        tags: ['standalone-ats-audit', modelName],
        metadata: { fileName }
      });

      logger.info(`[LangGraph analyzeStandaloneATS] Successfully audited with model: ${modelName}`);

      return {
        rawAnalysis: result,
        modelUsed: modelName
      };
    } catch (error) {
      logger.warn(`[LangGraph analyzeStandaloneATS] Model ${modelName} failed:`, error.message);
      lastError = error;
    }
  }

  throw new Error(`LangGraph Standalone ATS Audit failed across all models: ${lastError?.message || 'Unknown error'}`);
}

const standaloneWorkflow = new StateGraph(ATSStateAnnotation)
  .addNode('prepareInput', prepareInputNode)
  .addNode('analyzeStandalone', analyzeStandaloneATSNode)
  .addNode('formatResults', formatResultsNode)
  .addEdge(START, 'prepareInput')
  .addEdge('prepareInput', 'analyzeStandalone')
  .addEdge('analyzeStandalone', 'formatResults')
  .addEdge('formatResults', END);

export const standaloneAtsGraph = standaloneWorkflow.compile();

/**
 * Helper to run Standalone Resume Audit workflow with LangSmith tracing
 */
export async function runStandaloneResumeWorkflow(resumeFileBuffer, fileName) {
  initLangChainEnv();

  logger.info(`🚀 [LangGraph] Starting Standalone Resume Audit Workflow for ${fileName}...`);

  const initialInput = {
    jobDescription: '',
    fileBuffer: resumeFileBuffer,
    fileName
  };

  const finalState = await standaloneAtsGraph.invoke(initialInput, {
    runName: `Standalone Resume Audit Workflow - ${fileName}`,
    tags: ['standalone-resume-audit', 'langgraph'],
    metadata: { fileName }
  });

  return {
    analysisResult: finalState.formattedResult,
    modelUsed: finalState.modelUsed
  };
}

