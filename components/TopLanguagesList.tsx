import React from 'react';

interface TopLanguagesListProps {
  title: string;
  items: { name: string; flag: string; count: number }[];
}

const TopLanguagesList: React.FC<TopLanguagesListProps> = ({ title, items }) => {
  if (items.length === 0) {
    return (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col items-center justify-center h-full">
            <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
            <p className="text-gray-400 text-center">Could not confidently detect languages from recent activity.</p>
        </div>
    );
  }

  const maxCount = items[0]?.count || 1;

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="text-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-300 truncate">
                <span className="mr-3 text-lg">{item.flag}</span>
                {item.name}
              </span>
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
};

export default TopLanguagesList;