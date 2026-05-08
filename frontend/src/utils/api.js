import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 120000, // 2 min — GPT-4o can be slow on large files
});

/**
 * Analyze resume file with optional job description.
 * @param {File} file - Resume file
 * @param {string} [jobDescription] - Optional JD text
 * @param {Function} [onProgress] - Upload progress callback
 */
export async function analyzeResume(file, jobDescription = '', onProgress) {
  const formData = new FormData();
  formData.append('file', file);
  if (jobDescription.trim()) {
    formData.append('jobDescription', jobDescription.trim());
  }

  const response = await api.post('/resume/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress) {
        const pct = Math.round((e.loaded * 100) / e.total);
        onProgress(pct);
      }
    },
  });

  return response.data;
}

/**
 * Tailor resume for a specific job description.
 */
export async function tailorResume(resumeText, jobDescription) {
  const response = await api.post('/resume/tailor', { resumeText, jobDescription });
  return response.data;
}

export default api;
