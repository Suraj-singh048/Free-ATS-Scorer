import axios from 'axios';

/**
 * Submit job description and resumes for ATS analysis
 * @param {string} jobDescription - Job description text
 * @param {File[]} files - Array of resume files
 * @param {string} mode - 'job_match' | 'resume_only'
 * @returns {Promise<Object>} - API response with results
 */
export async function analyzeResumes(jobDescription, files, mode = 'job_match') {
  const formData = new FormData();
  formData.append('job_description', jobDescription || '');
  formData.append('analysis_mode', mode);

  // Append all resume files
  files.forEach((file) => {
    formData.append('resumes', file);
  });

  try {
    const response = await axios.post('/api/matcher', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // 120 second timeout (2 minutes) for Pro model analysis
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.error || 'Server error occurred');
    } else if (error.request) {
      // No response received
      throw new Error('No response from server. Please try again.');
    } else {
      // Request setup error
      throw new Error(error.message || 'Failed to submit request');
    }
  }
}
