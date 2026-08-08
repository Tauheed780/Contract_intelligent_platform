// src/components/Analysis/RiskFlags.js
import React, { useState } from 'react';
import { AlertTriangle, Shield, TrendingUp, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const RiskFlags = ({ data }) => {
  const [expanded, setExpanded] = useState({});

  if (!data || !Array.isArray(data)) {
    return <p className="text-gray-500">No risk flags identified</p>;
  }

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'medium': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'low': return <Shield className="w-5 h-5 text-blue-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'legal': return <AlertTriangle className="w-4 h-4" />;
      case 'financial': return <TrendingUp className="w-4 h-4" />;
      case 'operational': return <Shield className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const toggleExpand = (index) => {
    setExpanded(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const highRisks = data.filter(r => r.severity?.toLowerCase() === 'high').length;
  const mediumRisks = data.filter(r => r.severity?.toLowerCase() === 'medium').length;
  const lowRisks = data.filter(r => r.severity?.toLowerCase() === 'low').length;

  return (
    <div className="space-y-4">
      {/* Risk Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card bg-red-50 border-red-200">
          <p className="text-sm text-gray-600">High Risk</p>
          <p className="text-2xl font-bold text-red-700">{highRisks}</p>
        </div>
        <div className="card bg-yellow-50 border-yellow-200">
          <p className="text-sm text-gray-600">Medium Risk</p>
          <p className="text-2xl font-bold text-yellow-700">{mediumRisks}</p>
        </div>
        <div className="card bg-blue-50 border-blue-200">
          <p className="text-sm text-gray-600">Low Risk</p>
          <p className="text-2xl font-bold text-blue-700">{lowRisks}</p>
        </div>
      </div>

      {/* Risk List */}
      <div className="space-y-3">
        {data.map((risk, index) => (
          <div
            key={index}
            className={`
              border rounded-lg transition-all
              ${getSeverityColor(risk.severity)}
              hover:shadow-md
            `}
          >
            <div 
              className="p-4 cursor-pointer"
              onClick={() => toggleExpand(index)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getSeverityIcon(risk.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{risk.risk}</span>
                      <span className={`
                        text-xs px-2 py-0.5 rounded-full font-medium
                        ${getSeverityColor(risk.severity)}
                      `}>
                        {risk.severity?.toUpperCase()}
                      </span>
                    </div>
                    {risk.category && (
                      <div className="flex items-center space-x-1 text-xs text-gray-600">
                        {getCategoryIcon(risk.category)}
                        <span>{risk.category}</span>
                      </div>
                    )}
                  </div>
                  {expanded[index] && risk.recommendation && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Recommendation: </span>
                        {risk.recommendation}
                      </p>
                    </div>
                  )}
                </div>
                <button className="flex-shrink-0">
                  {expanded[index] ? 
                    <ChevronUp className="w-5 h-5" /> : 
                    <ChevronDown className="w-5 h-5" />
                  }
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No risks identified in this contract
        </div>
      )}
    </div>
  );
};

export default RiskFlags;