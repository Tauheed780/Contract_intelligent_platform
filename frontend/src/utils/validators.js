// src/utils/validators.js
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateFile = (file) => {
  if (!file) return { valid: false, error: 'No file selected' };
  
  if (!file.type || file.type !== 'application/pdf') {
    return { valid: false, error: 'File must be a PDF' };
  }
  
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }
  
  return { valid: true };
};

export const validateQuestion = (question) => {
  if (!question || question.trim().length === 0) {
    return { valid: false, error: 'Question cannot be empty' };
  }
  
  if (question.trim().length < 3) {
    return { valid: false, error: 'Question must be at least 3 characters' };
  }
  
  return { valid: true };
};