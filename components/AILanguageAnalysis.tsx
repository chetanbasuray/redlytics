import React from 'react';
import type { AILanguageAnalysis } from '../types';

interface AILanguageAnalysisProps {
  analysis: AILanguageAnalysis;
}

const AILanguageAnalysis: React.FC<AILanguageAnalysisProps> = ({ analysis }) => {
  if (!analysis || !analysis.languages || analysis.languages.length === 0) {
    return null;
  }
  
  const { summary, languages } = analysis;
  const sortedLanguages = [...languages].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-2">AI Language Analysis</h3>
      {summary && (
        <p className="text-sm text-gray-400 mb-4 border-l-2 border-gray-600 pl-3 italic">
          {summary}
        </p>
      )}
      <ul className="space-y-4">
        {sortedLanguages.map((lang, index) => (
          <li key={index} className="bg-gray-900/50 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="flex items-center gap-3">
                <span className="text-2xl">{lang.emoji}</span>
                <span className="font-bold text-gray-200">{lang.language}</span>
              </span>
              <span className="font-mono text-gray-300 font-semibold">{lang.percentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
              <div
                className="bg-sky-500 h-2 rounded-full"
                style={{ width: `${lang.percentage}%` }}
              ></div>
            </div>
            {lang.topSubreddits && lang.topSubreddits.length > 0 && (
                <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400">Often seen in:</span>
                    <div className="flex flex-wrap gap-2">
                        {lang.topSubreddits.map(sub => (
                             <a 
                                key={sub}
                                href={`https://www.reddit.com/r/${sub}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-gray-700/80 hover:bg-sky-800/50 text-sky-300 px-2 py-0.5 rounded-full transition-colors"
                            >
                                r/{sub}
                            </a>
                        ))}
                    </div>
                </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AILanguageAnalysis;