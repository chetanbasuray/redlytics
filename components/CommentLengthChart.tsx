import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface CommentLengthChartProps {
  data: { name: string; count: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-sm p-3 border border-gray-600 rounded-md shadow-lg text-sm">
          <p className="font-bold text-gray-200 mb-2">{label}</p>
          <div className="flex items-center justify-between gap-4">
              <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#38bdf8' }}></div>
                  <span className="text-gray-300">Comments:</span>
              </div>
              <span className="font-semibold text-white">{payload[0].value.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
};


const CommentLengthChart: React.FC<CommentLengthChartProps> = ({ data }) => {
  if (!data || data.every(d => d.count === 0)) {
    return (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col items-center justify-center h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Comment Length Distribution</h3>
            <p className="text-gray-400">No comment data to analyze.</p>
        </div>
    );
  }
  
  const formatCountValue = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Comment Length Distribution (by chars)</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart 
            layout="vertical" 
            data={data} 
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="commentLengthGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis 
              type="number" 
              stroke="#A0AEC0" 
              tick={{ fill: '#A0AEC0', fontSize: 12 }} 
              tickFormatter={formatCountValue}
            />
            <YAxis 
                type="category" 
                dataKey="name" 
                width={120} 
                stroke="#A0AEC0" 
                tick={{ fill: '#A0AEC0', fontSize: 12 }} 
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(147, 197, 253, 0.1)' }}
            />
            <Bar dataKey="count" fill="url(#commentLengthGradient)" name="Comments" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CommentLengthChart;
