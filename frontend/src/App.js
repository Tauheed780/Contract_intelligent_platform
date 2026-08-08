// src/App.js
import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import FileUpload from './components/Upload/FileUpload';
import ContractAnalysis from './components/Analysis/ContractAnalysis';
import QASection from './components/Q&A/QASection';
import { AppContext } from './context/AppContext';
import { FileText, MessageSquare, Home, Upload } from 'lucide-react';

function App() {
  const { analysisResult } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('upload');

  const tabs = [
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'analysis', label: 'Analysis', icon: FileText, disabled: !analysisResult },
    { id: 'qa', label: 'Q&A', icon: MessageSquare, disabled: !analysisResult },
  ];

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        
        <main className="flex-grow container-custom py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Contract Analyser
            </h1>
            <p className="text-gray-600">
              Upload, analyse, and query your contracts with AI
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-2 mb-8 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                  ${activeTab === tab.id 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                  ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="animate-fade-in">
            {activeTab === 'upload' && <FileUpload />}
            {activeTab === 'analysis' && analysisResult && <ContractAnalysis data={analysisResult} />}
            {activeTab === 'qa' && analysisResult && <QASection contractText={analysisResult.full_text} />}
          </div>
        </main>

        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;