import React from 'react';
import type { RedditTrophy } from '../types';

interface AchievementsListProps {
  title: string;
  items: RedditTrophy[];
}

const AchievementsList: React.FC<AchievementsListProps> = ({ title, items }) => {
  if (items.length === 0) {
    return null; // Rendered conditionally
  }
  
  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 h-full">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-4 max-h-80 overflow-y-auto pr-2">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center group" title={item.description || item.name}>
            <div className="bg-gray-700/50 p-2 rounded-full">
                <img src={item.icon_url} alt={item.name} className="h-10 w-10 transition-transform group-hover:scale-110" />
            </div>
            <span className="text-xs text-gray-400 mt-2 truncate w-full">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsList;