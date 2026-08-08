// src/components/Q&A/QASection.js
import React, { useState, useContext } from 'react';
import { Send, MessageSquare, History, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { askQuestion } from '../../services/contractService';
import { AppContext } from '../../context/AppContext';

const QASection = ({ contractText }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [qaHistory, setQaHistory] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const { fileId } = useContext(AppContext);

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    setLoading(true);
    try {
      const response = await askQuestion({
        question: question,
        file_id: fileId,
        contract_text: contractText
      });

      const newQA = {
        question: question,
        answer: response.answer,
        confidence: response.confidence,
        timestamp: new Date().toISOString(),
        sources: response.sources || []
      };

      setQaHistory(prev => [newQA, ...prev]);
      setQuestion('');
      toast.success('Answer received!');
    } catch (error) {
      console.error('Q&A error:', error);
      toast.error(error.message || 'Failed to get answer');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast.success('Copied to clipboard!');
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence?.toLowerCase()) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const suggestedQuestions = [
    "What are the main obligations of each party?",
    "What is the termination clause?",
    "When does this contract expire?",
    "What are the payment terms?",
    "Is there a confidentiality clause?",
    "What happens in case of a dispute?"
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Question Input */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <MessageSquare className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">Ask Questions About Your Contract</h3>
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question here..."
            className="input-field flex-1"
            disabled={loading}
          />
          <button
            onClick={handleAskQuestion}
            disabled={loading || !question.trim()}
            className="btn-primary flex items-center space-x-2 px-6"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Ask</span>
              </>
            )}
          </button>
        </div>

        {/* Suggested Questions */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => setQuestion(q)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                disabled={loading}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Q&A History */}
      {qaHistory.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-gray-500" />
              <h4 className="font-medium text-gray-700">Q&A History</h4>
            </div>
            <span className="text-xs text-gray-500">{qaHistory.length} questions</span>
          </div>

          {qaHistory.map((item, index) => (
            <div key={index} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-start space-x-2">
                    <div className="bg-primary-100 p-1.5 rounded-lg flex-shrink-0 mt-0.5">
                      <MessageSquare className="w-4 h-4 text-primary-600" />
                    </div>
                    <p className="font-medium text-gray-900">{item.question}</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(item.answer, index)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {copiedIndex === index ? 
                    <Check className="w-4 h-4 text-green-600" /> : 
                    <Copy className="w-4 h-4" />
                  }
                </button>
              </div>

              <div className="ml-7 mt-2">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-700 whitespace-pre-wrap">{item.answer}</p>
                </div>
                <div className="flex items-center space-x-4 mt-2">
                  {item.confidence && (
                    <span className={`
                      text-xs px-2 py-0.5 rounded-full font-medium
                      ${getConfidenceColor(item.confidence)}
                    `}>
                      Confidence: {item.confidence}
                    </span>
                  )}
                  {item.sources && item.sources.length > 0 && (
                    <span className="text-xs text-gray-500">
                      Sources: {item.sources.join(', ')}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {qaHistory.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
          <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-lg font-medium text-gray-400">No questions asked yet</p>
          <p className="text-sm">Ask a question about your contract to get started</p>
        </div>
      )}
    </div>
  );
};

export default QASection;