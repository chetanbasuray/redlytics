import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SentimentBreakdownChartProps {
  data: { name: string; value: number }[];
}

const SentimentBreakdownChart: React.FC<SentimentBreakdownChartProps> = ({ data }) => {
  const COLORS = {
      'Positive': '#22c55e', // Green
      'Neutral': '#64748b',  // Slate
      'Negative': '#ef4444', // Red
  };
  const totalComments = data.reduce((sum, entry) => sum + entry.value, 0);

  if (totalComments === 0) {
    return (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col items-center justify-center h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Sentiment Breakdown</h3>
            <p className="text-gray-400">No comments to analyze sentiment.</p>
        </div>
    );
  }
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = totalComments > 0 ? ((data.value / totalComments) * 100).toFixed(1) : 0;
      return (
        <div className="bg-black/80 backdrop-blur-sm p-3 border border-gray-600 rounded-md shadow-lg text-sm">
          <p className="font-bold" style={{ color: data.payload.fill }}>{`${data.name}`}</p>
          <p className="text-gray-200 mt-1">{`${data.value.toLocaleString()} comments (${percentage}%)`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Comment Sentiment Breakdown</h3>
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
              {data.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
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

export default SentimentBreakdownChart;