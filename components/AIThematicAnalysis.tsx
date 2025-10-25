import React from 'react';
import type { AITheme } from '../types';

interface AIThematicAnalysisProps {
  themes: AITheme[];
}

const AIThematicAnalysis: React.FC<AIThematicAnalysisProps> = ({ themes }) => {
  if (!themes || themes.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">AI Thematic Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme, index) => (
                <div key={index} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex items-start gap-4 transform transition-transform hover:-translate-y-1">
                    <div className="text-3xl mt-1">{theme.emoji}</div>
                    <div className="flex-1">
                        <h4 className="font-bold text-white">{theme.theme}</h4>
                        <p className="text-sm text-gray-400">{theme.description}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default AIThematicAnalysis;
