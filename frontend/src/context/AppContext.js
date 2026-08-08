// src/context/AppContext.js
import React, { createContext, useState, useContext } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearState = () => {
    setAnalysisResult(null);
    setFileId(null);
    setError(null);
  };

  const value = {
    analysisResult,
    setAnalysisResult,
    fileId,
    setFileId,
    isLoading,
    setIsLoading,
    error,
    setError,
    clearState,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};