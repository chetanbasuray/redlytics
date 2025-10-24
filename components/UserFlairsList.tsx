import React from 'react';

interface UserFlairsListProps {
  title: string;
  items: { subreddit: string; text: string }[];
}

const UserFlairsList: React.FC<UserFlairsListProps> = ({ title, items }) => {
    if (items.length === 0) {
    return (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col items-center justify-center h-full">
            <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
            <p className="text-gray-400">No user flairs found in recent activity.</p>
        </div>
    );
  }
  
  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 h-full">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={index} className="text-sm flex flex-col sm:flex-row sm:justify-between gap-2">
            <div className="flex-shrink mr-2">
              <span 
                className="font-semibold text-white bg-gray-700/60 px-2 py-1 rounded-md inline-block"
              >
                {item.text}
              </span>
            </div>
            <a 
              href={`https://www.reddit.com/r/${item.subreddit}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline truncate text-xs sm:text-sm self-start sm:self-center"
            >
              r/{item.subreddit}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserFlairsList;