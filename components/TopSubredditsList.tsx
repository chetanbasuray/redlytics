import React from 'react';

interface TopSubredditsListProps {
  title: string;
  items: { name: string; count: number }[];
}

const TopSubredditsList: React.FC<TopSubredditsListProps> = ({ title, items }) => {
  const maxCount = items[0]?.count || 1;
  return (
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
          <ul className="space-y-3">
              {items.map((item, index) => (
                  <li key={index} className="text-sm">
                      <div className="flex justify-between items-center mb-1">
                          <a 
                            href={`https://www.reddit.com/r/${item.name}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-300 truncate hover:text-sky-400 transition-colors"
                          >
                            r/{item.name}
                          </a>
                          <span className="font-mono text-gray-400">{item.count.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div
                              className="bg-sky-500 h-1.5 rounded-full"
                              style={{ width: `${(item.count / maxCount) * 100}%` }}
                          ></div>
                      </div>
                  </li>
              ))}
          </ul>
      </div>
  );
}

export default TopSubredditsList;