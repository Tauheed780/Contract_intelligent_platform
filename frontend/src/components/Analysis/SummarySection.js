// src/components/Analysis/SummarySection.js
import React from 'react';
import { FileText, Users, Calendar, DollarSign, Clock, AlertCircle } from 'lucide-react';

const SummarySection = ({ data }) => {
  if (!data) {
    return <p className="text-gray-500">No summary available</p>;
  }

  // If data is a string (raw summary), display it differently
  if (typeof data === 'string') {
    return (
      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Contract Summary</h3>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{data}</p>
        </div>
      </div>
    );
  }

  const summaryItems = [
    { key: 'main_purpose', label: 'Main Purpose', icon: FileText },
    { key: 'key_parties', label: 'Key Parties', icon: Users },
    { key: 'key_dates', label: 'Key Dates', icon: Calendar },
    { key: 'payment_terms', label: 'Payment Terms', icon: DollarSign },
    { key: 'duration', label: 'Duration', icon: Clock },
    { key: 'critical_clauses', label: 'Critical Clauses', icon: AlertCircle },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {summaryItems.map((item) => {
          const value = data[item.key];
          if (!value) return null;

          return (
            <div key={item.key} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    {item.label}
                  </h4>
                  <p className="text-gray-900 break-words">
                    {typeof value === 'string' ? value : JSON.stringify(value)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Raw summary fallback */}
      {data.raw_summary && (
        <div className="card mt-4">
          <h4 className="font-medium text-gray-700 mb-2">Full Summary</h4>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{data.raw_summary}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummarySection;