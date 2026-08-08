// src/components/Analysis/ContractAnalysis.js
import React, { useState } from 'react';
import { FileText, ListChecks, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import SummarySection from './SummarySection';
import ClauseChecklist from './ClauseChecklist';
import RiskFlags from './RiskFlags';

const ContractAnalysis = ({ data }) => {
  const [activeSection, setActiveSection] = useState('summary');
  const [expanded, setExpanded] = useState(true);

  const sections = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'clauses', label: 'Clause Checklist', icon: ListChecks },
    { id: 'risks', label: 'Risk Flags', icon: AlertTriangle },
  ];

  if (!data || !data.analysis) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No analysis data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* File Info */}
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-primary-600" />
            <div>
              <h3 className="font-semibold text-gray-900">{data.file_info.filename}</h3>
              <p className="text-sm text-gray-500">
                {data.file_info.page_count} pages • {(data.file_info.file_size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
              Analysis Complete
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex space-x-2 border-b border-gray-200">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`
              flex items-center space-x-2 px-4 py-3 border-b-2 transition-all duration-200
              ${activeSection === section.id
                ? 'border-primary-600 text-primary-600 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <section.icon className="w-4 h-4" />
            <span>{section.label}</span>
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="min-h-[400px]">
        {activeSection === 'summary' && (
          <SummarySection data={data.analysis.summary} />
        )}
        {activeSection === 'clauses' && (
          <ClauseChecklist data={data.analysis.clause_checklist} />
        )}
        {activeSection === 'risks' && (
          <RiskFlags data={data.analysis.risk_flags} />
        )}
      </div>
    </div>
  );
};

export default ContractAnalysis;