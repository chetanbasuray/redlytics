import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SubredditStickinessChartProps {
  data: { name: string; value: number }[];
}

const SubredditStickinessChart: React.FC<SubredditStickinessChartProps> = ({ data }) => {
  const COLORS = ['#818cf8', '#da35ccff'];
  const totalActivity = data.reduce((sum, entry) => sum + entry.value, 0);

  if (totalActivity === 0) {
    return (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col items-center justify-center h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Community Focus</h3>
            <p className="text-gray-400">No activity data available.</p>
        </div>
    );
  }
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = totalActivity > 0 ? ((data.value / totalActivity) * 100).toFixed(1) : 0;
      return (
        <div className="bg-gray-700 p-3 border border-gray-600 rounded-md shadow-lg text-sm">
          <p className="font-bold" style={{ color: data.payload.fill }}>{`${data.name}`}</p>
          <p className="text-gray-200 mt-1">{`${data.value.toLocaleString()} actions (${percentage}%)`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Community Focus (Stickiness)</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(147, 197, 253, 0.1)' }} />
            <Legend iconType="circle" wrapperStyle={{fontSize: "14px", paddingTop: "20px"}} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SubredditStickinessChart;