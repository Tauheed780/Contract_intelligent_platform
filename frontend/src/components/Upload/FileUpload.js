// src/components/Upload/FileUpload.js
import React, { useState, useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadContract, getAnalysis } from '../../services/contractService';
import { AppContext } from '../../context/AppContext';
import UploadProgress from './UploadProgress';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, uploading, processing, complete, error
  
  const { setAnalysisResult, setFileId } = useContext(AppContext);

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setStatus('idle');
      setProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    multiple: false
  });

  const removeFile = () => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setStatus('uploading');
    setProgress(10);

    try {
      // Upload file
      const uploadResult = await uploadContract(file);
      setProgress(50);
      
      // Get file_id
      const fileId = uploadResult.file_id;
      setFileId(fileId);
      
      // Poll for analysis completion
      setStatus('processing');
      setProgress(70);
      
      let analysisData = null;
      let attempts = 0;
      const maxAttempts = 30;
      
      while (attempts < maxAttempts) {
        try {
          const result = await getAnalysis(fileId);
          if (result && result.analysis) {
            analysisData = result;
            break;
          }
        } catch (error) {
          // Still processing
        }
        
        attempts++;
        setProgress(70 + (attempts / maxAttempts) * 25);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      if (analysisData) {
        setProgress(100);
        setStatus('complete');
        setAnalysisResult(analysisData);
        toast.success('Contract analysed successfully!');
      } else {
        throw new Error('Analysis timed out');
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      setStatus('error');
      toast.error(error.message || 'Failed to upload or analyse contract');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
          ${file ? 'bg-gray-50' : ''}
          cursor-pointer
        `}
      >
        <input {...getInputProps()} />
        
        {!file ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Upload className="w-16 h-16 text-gray-400" />
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-700">
                Drop your PDF contract here
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or click to browse files (Max 10MB)
              </p>
            </div>
            <div className="flex justify-center space-x-4 text-xs text-gray-400">
              <span>📄 PDF only</span>
              <span>🔒 Secure upload</span>
              <span>⚡ AI-powered analysis</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-4">
              <File className="w-8 h-8 text-primary-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="text-gray-400 hover:text-red-500 transition-colors"
              disabled={uploading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {status !== 'idle' && (
        <UploadProgress 
          status={status} 
          progress={progress}
          fileName={file?.name}
        />
      )}

      {/* Action Buttons */}
      {file && status === 'idle' && (
        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="btn-primary flex items-center space-x-2 px-6 py-3"
          >
            <Upload className="w-5 h-5" />
            <span>Analyse Contract</span>
          </button>
        </div>
      )}

      {/* Status Messages */}
      {status === 'complete' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-700 font-medium">
            Analysis complete! View the results in the Analysis tab.
          </span>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-700 font-medium">
            Upload failed. Please try again.
          </span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;