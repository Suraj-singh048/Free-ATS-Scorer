import { extractPdfText } from './pdfExtractor.js';
import { extractDocxText } from './docxExtractor.js';

/**
 * Extract text from file buffer based on filename extension
 * Replicates Python's extract_text_in_memory function
 * @param {Buffer} buffer - File buffer
 * @param {string} filename - Original filename
 * @returns {Promise<string>} - Extracted text content
 */
export async function extractTextFromFile(buffer, filename) {
  const lowerFilename = filename.toLowerCase();

  if (lowerFilename.endsWith('.pdf')) {
    return await extractPdfText(buffer);
  } else if (lowerFilename.endsWith('.docx')) {
    return await extractDocxText(buffer);
  } else if (lowerFilename.endsWith('.txt')) {
    // TXT files - decode as UTF-8
    return buffer.toString('utf-8');
  } else {
    console.warn(`Unsupported file type: ${filename}`);
    return '';
  }
}
