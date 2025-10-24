import React from 'react';

interface Award {
    name: string;
    count: number;
    icon_url: string;
}

interface AwardsListProps {
  title: string;
  items: Award[];
}

const AwardsList: React.FC<AwardsListProps> = ({ title, items }) => {
  if (items.length === 0) {
    return null; // This component is rendered conditionally, so no need for an empty state here
  }
  
  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 h-full">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
        {items.map((item, index) => (
          <li key={index} className="text-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 truncate">
                <img src={item.icon_url} alt={item.name} className="h-6 w-6" />
                <span className="text-gray-300 truncate">{item.name}</span>
            </div>
            <span className="font-mono text-gray-400 font-semibold">{item.count.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AwardsList;