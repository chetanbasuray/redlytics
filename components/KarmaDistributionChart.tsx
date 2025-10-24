import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface KarmaDistributionChartProps {
  data: { name: string; karma: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-sm p-3 border border-gray-600 rounded-md shadow-lg text-sm">
          <p className="font-bold text-gray-200 mb-2">{`r/${label}`}</p>
          <div className="flex items-center justify-between gap-4">
              <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#a78bfa' }}></div>
                  <span className="text-gray-300">Karma:</span>
              </div>
              <span className="font-semibold text-white">{payload[0].value.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
};


const KarmaDistributionChart: React.FC<KarmaDistributionChartProps> = ({ data }) => {
  
  // Formats large numbers for better readability on the axis and tooltip
  const formatKarmaValue = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Top Subreddits by Karma</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart 
            layout="vertical" 
            data={data} 
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="karmaBarGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis 
              type="number" 
              stroke="#A0AEC0" 
              tick={{ fill: '#A0AEC0', fontSize: 12 }} 
              tickFormatter={formatKarmaValue}
            />
            <YAxis 
                type="category" 
                dataKey="name" 
                width={80} 
                stroke="#A0AEC0" 
                tick={{ fill: '#A0AEC0', fontSize: 12 }} 
                tickFormatter={(value) => `r/${value}`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(147, 197, 253, 0.1)' }}
            />
            <Bar dataKey="karma" fill="url(#karmaBarGradient)" name="Karma" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default KarmaDistributionChart;