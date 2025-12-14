import axios from 'axios';

/**
 * Submit job description and resumes for ATS analysis
 * @param {string} jobDescription - Job description text
 * @param {File[]} files - Array of resume files
 * @returns {Promise<Object>} - API response with results
 */
export async function analyzeResumes(jobDescription, files) {
  const formData = new FormData();
  formData.append('job_description', jobDescription);

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
