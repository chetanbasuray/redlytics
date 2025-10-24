import React from 'react';

interface SimpleRankedListProps {
  title: string;
  items: { name: string; value: number }[];
  valueLabel: string;
}

const SimpleRankedList: React.FC<SimpleRankedListProps> = ({ title, items, valueLabel }) => {
  if (items.length === 0) {
    return (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col items-center justify-center h-full">
            <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
            <p className="text-gray-400 text-center">No data available for this section.</p>
        </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 h-full">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={index}>
            <a 
              href={`https://www.reddit.com/r/${item.name}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-sky-400 transition-colors font-medium"
            >
              r/{item.name}
            </a>
            <p className="text-sm text-gray-400">
              {item.value.toLocaleString()} {valueLabel}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SimpleRankedList;