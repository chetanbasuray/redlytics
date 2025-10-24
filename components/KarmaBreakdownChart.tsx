import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface KarmaBreakdownChartProps {
  postKarma: number;
  commentKarma: number;
}

const KarmaBreakdownChart: React.FC<KarmaBreakdownChartProps> = ({ postKarma, commentKarma }) => {
  const data = [
    { name: 'Post Karma', value: postKarma },
    { name: 'Comment Karma', value: commentKarma },
  ];

  const COLORS = ['#38bdf8', '#34d399']; // Sky for posts, Green for comments
  const totalKarma = postKarma + commentKarma;

  if (totalKarma === 0) {
    return (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col items-center justify-center h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Karma Breakdown</h3>
            <p className="text-gray-400">No karma data available to display.</p>
        </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = totalKarma > 0 ? ((data.value / totalKarma) * 100).toFixed(1) : 0;
      return (
        <div className="bg-black/80 backdrop-blur-sm p-3 border border-gray-600 rounded-md shadow-lg text-sm">
          <p className="font-bold" style={{ color: data.payload.fill }}>{`${data.name}`}</p>
          <p className="text-gray-200 mt-1">{`${data.value.toLocaleString()} karma (${percentage}%)`}</p>
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
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="font-bold text-base">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Karma Breakdown</h3>
      <div className="relative" style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              innerRadius={70}
              outerRadius={115}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(147, 197, 253, 0.1)' }}/>
            <Legend iconType="circle" wrapperStyle={{fontSize: "14px", paddingTop: "20px"}} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-10">
            <span className="text-3xl font-bold text-white">{totalKarma.toLocaleString()}</span>
            <span className="text-sm text-gray-400">Total Karma</span>
        </div>
      </div>
    </div>
  );
};

export default KarmaBreakdownChart;