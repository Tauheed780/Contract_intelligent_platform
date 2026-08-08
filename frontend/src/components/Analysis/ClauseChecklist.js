// src/components/Analysis/ClauseChecklist.js
import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Search, Filter } from 'lucide-react';

const ClauseChecklist = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, present, absent, needs_review

  if (!data || !Array.isArray(data)) {
    return <p className="text-gray-500">No clause checklist available</p>;
  }

  const getStatusIcon = (present, quality) => {
    if (present && quality === 'good') return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (present && quality === 'needs_review') return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    if (present && quality === 'poor') return <AlertCircle className="w-5 h-5 text-red-600" />;
    return <XCircle className="w-5 h-5 text-gray-400" />;
  };

  const getStatusColor = (present, quality) => {
    if (present && quality === 'good') return 'bg-green-50 border-green-200';
    if (present && quality === 'needs_review') return 'bg-yellow-50 border-yellow-200';
    if (present && quality === 'poor') return 'bg-red-50 border-red-200';
    return 'bg-gray-50 border-gray-200';
  };

  const getStatusBadge = (present, quality) => {
    if (present && quality === 'good') return 'bg-green-100 text-green-700';
    if (present && quality === 'needs_review') return 'bg-yellow-100 text-yellow-700';
    if (present && quality === 'poor') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-600';
  };

  const filteredData = data.filter((clause) => {
    const matchesSearch = clause.clause_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
      (filter === 'present' && clause.present) ||
      (filter === 'absent' && !clause.present) ||
      (filter === 'needs_review' && clause.present && clause.quality === 'needs_review');
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: data.length,
    present: data.filter(c => c.present).length,
    absent: data.filter(c => !c.present).length,
    needsReview: data.filter(c => c.present && c.quality === 'needs_review').length,
  };

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50 border-blue-200">
          <p className="text-sm text-gray-600">Total Clauses</p>
          <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
        </div>
        <div className="card bg-green-50 border-green-200">
          <p className="text-sm text-gray-600">Present</p>
          <p className="text-2xl font-bold text-green-700">{stats.present}</p>
        </div>
        <div className="card bg-red-50 border-red-200">
          <p className="text-sm text-gray-600">Absent</p>
          <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
        </div>
        <div className="card bg-yellow-50 border-yellow-200">
          <p className="text-sm text-gray-600">Needs Review</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.needsReview}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search clauses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex space-x-2">
          {['all', 'present', 'absent', 'needs_review'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${filter === f 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                capitalize
              `}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Clause List */}
      <div className="space-y-2">
        {filteredData.map((clause, index) => (
          <div
            key={index}
            className={`
              flex items-start space-x-3 p-4 rounded-lg border transition-all
              ${getStatusColor(clause.present, clause.quality)}
              hover:shadow-md
            `}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getStatusIcon(clause.present, clause.quality)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h4 className="font-medium text-gray-900">
                  {clause.clause_name}
                </h4>
                <span className={`
                  text-xs px-3 py-1 rounded-full font-medium
                  ${getStatusBadge(clause.present, clause.quality)}
                `}>
                  {clause.present ? clause.quality.replace('_', ' ').toUpperCase() : 'ABSENT'}
                </span>
              </div>
              {clause.notes && (
                <p className="text-sm text-gray-600 mt-1">{clause.notes}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No clauses match your search criteria
        </div>
      )}
    </div>
  );
};

export default ClauseChecklist;