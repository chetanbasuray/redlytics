import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { StickinessData } from '../types';

interface SubredditStickinessChartProps {
  data: StickinessData[];
}

const SubredditStickinessChart: React.FC<SubredditStickinessChartProps> = ({ data }) => {
  const COLORS = ['#38bdf8', '#34d399', '#a78bfa', '#64748b']; // Sky, Green, Violet, Slate
  const totalActivity = data.reduce((sum, entry) => sum + entry.value, 0);

  if (totalActivity === 0) {
    return (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col items-center justify-center h-full min-h-[300px]">
            <h3 className="text-lg font-semibold text-white mb-4">Community Focus (Stickiness)</h3>
            <p className="text-gray-400">Not enough activity to analyze focus.</p>
        </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as StickinessData;
      const percentage = totalActivity > 0 ? ((dataPoint.value / totalActivity) * 100).toFixed(1) : 0;
      return (
        <div className="bg-black/80 backdrop-blur-sm p-3 border border-gray-600 rounded-md shadow-lg text-sm">
          <p className="font-bold" style={{ color: payload[0].payload.fill }}>{dataPoint.category}</p>
          <p className="text-gray-200 mt-1">{`${dataPoint.value.toLocaleString()} activities (${percentage}%)`}</p>
          {dataPoint.subreddits.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-700">
                <p className="text-gray-400 text-xs">Includes: {dataPoint.subreddits.map(s => `r/${s}`).join(', ')}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent === 0) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="font-bold text-sm pointer-events-none">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white">Community Focus (Stickiness)</h3>
        <p className="text-sm text-gray-400 mb-4">Percentage of activity in most frequented subreddits.</p>
      
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 items-center">
            <div className="w-full h-[250px]">
                <ResponsiveContainer>
                <PieChart>
                    <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="category"
                    paddingAngle={2}
                    >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(147, 197, 253, 0.1)' }} />
                </PieChart>
                </ResponsiveContainer>
            </div>

            <ul className="space-y-4 text-sm mt-4 md:mt-0">
                {data.map((entry, index) => (
                    <li key={index} className="flex items-start">
                        <div style={{ backgroundColor: COLORS[index % COLORS.length] }} className="w-3 h-3 rounded-full mr-3 mt-1 flex-shrink-0"></div>
                        <div>
                            <span className="font-bold text-white">
                                {((entry.value / totalActivity) * 100).toFixed(1)}% - {entry.category}
                            </span>
                            {entry.subreddits.length > 0 && (
                                <p className="text-gray-400 text-xs">({entry.subreddits.map(s => `r/${s}`).join(', ')})</p>
                            )}
                             {entry.category === 'Other' && (
                                <p className="text-gray-400 text-xs">(All Other Subreddits)</p>
                             )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
};

export default SubredditStickinessChart;