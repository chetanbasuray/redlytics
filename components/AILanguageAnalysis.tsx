import React from 'react';
import type { AILanguageUsage } from '../types';

interface AILanguageAnalysisProps {
  languages: AILanguageUsage[];
}

const AILanguageAnalysis: React.FC<AILanguageAnalysisProps> = ({ languages }) => {
  if (!languages || languages.length === 0) {
    return null;
  }
  
  // Sort by percentage descending
  const sortedLanguages = [...languages].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">AI Language Analysis</h3>
      <ul className="space-y-3">
        {sortedLanguages.map((lang, index) => (
          <li key={index} className="text-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="flex items-center gap-3">
                <span className="text-2xl">{lang.emoji}</span>
                <span className="font-bold text-gray-200">{lang.language}</span>
              </span>
              <span className="font-mono text-gray-400">{lang.percentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-sky-500 h-2 rounded-full"
                style={{ width: `${lang.percentage}%` }}
              ></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AILanguageAnalysis;