// src/components/Layout/Navbar.js
import React from 'react';
import { FileText, Github, Twitter } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Contract Analyser</h1>
              <p className="text-xs text-gray-500">AI-Powered Contract Intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;