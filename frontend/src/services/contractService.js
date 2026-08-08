// src/services/contractService.js
import api from './api';

export const uploadContract = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const getAnalysis = async (fileId) => {
  try {
    const response = await api.get(`/analysis/${fileId}`);
    return response.data;
  } catch (error) {
    console.error('Get analysis error:', error);
    throw error;
  }
};

export const askQuestion = async (data) => {
  try {
    const response = await api.post('/ask', data);
    return response.data;
  } catch (error) {
    console.error('Ask question error:', error);
    throw error;
  }
};

export const getQaHistory = async () => {
  try {
    const response = await api.get('/qa-history');
    return response.data;
  } catch (error) {
    console.error('Get QA history error:', error);
    throw error;
  }
};

export const deleteAnalysis = async (fileId) => {
  try {
    const response = await api.delete(`/analysis/${fileId}`);
    return response.data;
  } catch (error) {
    console.error('Delete analysis error:', error);
    throw error;
  }
};

export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};