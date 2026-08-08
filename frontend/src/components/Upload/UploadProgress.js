// src/components/Upload/UploadProgress.js
import React from 'react';
import { Loader2, CheckCircle, AlertCircle, FileText } from 'lucide-react';

const UploadProgress = ({ status, progress, fileName }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'uploading':
        return {
          icon: <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />,
          text: 'Uploading your contract...',
          color: 'text-primary-600'
        };
      case 'processing':
        return {
          icon: <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />,
          text: 'Analysing contract with AI...',
          color: 'text-primary-600'
        };
      case 'complete':
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          text: 'Analysis complete!',
          color: 'text-green-600'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5 text-red-600" />,
          text: 'Upload failed',
          color: 'text-red-600'
        };
      default:
        return {
          icon: <FileText className="w-5 h-5 text-gray-500" />,
          text: 'Preparing...',
          color: 'text-gray-500'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {statusInfo.icon}
          <div>
            <p className={`font-medium ${statusInfo.color}`}>
              {statusInfo.text}
            </p>
            {fileName && (
              <p className="text-sm text-gray-500 truncate max-w-md">
                {fileName}
              </p>
            )}
          </div>
        </div>
        <span className="text-sm font-medium text-gray-700">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`
            h-full rounded-full transition-all duration-500 ease-out
            ${status === 'error' ? 'bg-red-500' : 'bg-primary-600'}
          `}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status Details */}
      {status === 'processing' && (
        <div className="text-sm text-gray-500">
          <p>This may take a few moments...</p>
          <div className="flex space-x-2 mt-1">
            <span className="inline-block w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" />
            <span className="inline-block w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse delay-75" />
            <span className="inline-block w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse delay-150" />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadProgress;