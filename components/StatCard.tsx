import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="bg-gray-800 p-3 rounded-lg shadow-lg text-center border border-gray-700">
      <p className="text-xs text-gray-400 uppercase tracking-wider truncate" title={title}>{title}</p>
      <p className="text-xl font-bold text-white truncate" title={String(value)}>{value}</p>
    </div>
  );
};

export default StatCard;