import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

/**
 * Ensures LangChain and LangSmith environment variables are initialized.
 * Prioritizes standard server variables (LANGCHAIN_*), falling back to VITE_LANGCHAIN_*
 * for local development compatibility.
 */
export function initLangChainEnv() {
  dotenv.config();

  // Support VITE_LANGCHAIN_* fallback for local dev .env
  if (process.env.VITE_LANGCHAIN_TRACING_V2 && !process.env.LANGCHAIN_TRACING_V2) {
    process.env.LANGCHAIN_TRACING_V2 = process.env.VITE_LANGCHAIN_TRACING_V2;
  }
  if (process.env.VITE_LANGCHAIN_API_KEY && !process.env.LANGCHAIN_API_KEY) {
    process.env.LANGCHAIN_API_KEY = process.env.VITE_LANGCHAIN_API_KEY;
  }
  if (process.env.VITE_LANGCHAIN_PROJECT && !process.env.LANGCHAIN_PROJECT) {
    process.env.LANGCHAIN_PROJECT = process.env.VITE_LANGCHAIN_PROJECT;
  }

  // Ensure default project name if tracing is enabled
  if (process.env.LANGCHAIN_TRACING_V2 === 'true' && !process.env.LANGCHAIN_PROJECT) {
    process.env.LANGCHAIN_PROJECT = 'ATS_ANALYZER';
  }

  logger.debug('LangChain & LangSmith environment resolved', {
    tracing: process.env.LANGCHAIN_TRACING_V2 === 'true',
    project: process.env.LANGCHAIN_PROJECT || 'ATS_ANALYZER',
    hasApiKey: !!process.env.LANGCHAIN_API_KEY
  });
}
