import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

interface SentimentBySubredditChartProps {
  data: { name:string; avgScore: number; count: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const sentiment = data.avgScore > 0.2 ? 'Positive' : data.avgScore < -0.2 ? 'Negative' : 'Neutral';
      return (
        <div className="bg-black/80 backdrop-blur-sm p-3 border border-gray-600 rounded-md shadow-lg text-sm">
          <p className="font-bold text-gray-200 mb-2">{`r/${label}`}</p>
          <p className="text-gray-300">Avg. Sentiment: <span className="font-semibold text-white">{data.avgScore.toFixed(2)} ({sentiment})</span></p>
          <p className="text-gray-300">Based on {data.count} comments</p>
        </div>
      );
    }
    return null;
};


const SentimentBySubredditChart: React.FC<SentimentBySubredditChartProps> = ({ data }) => {
  
  if (data.length === 0) {
    return (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col items-center justify-center h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Sentiment by Subreddit</h3>
            <p className="text-gray-400 text-center">Not enough comment data to analyze sentiment by community.</p>
        </div>
    );
  }

  const sortedData = [...data].sort((a,b) => a.avgScore - b.avgScore);

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Average Sentiment by Subreddit</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart 
            layout="vertical" 
            data={sortedData} 
            margin={{ top: 5, right: 20, left: 140, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis 
              type="number" 
              stroke="#A0AEC0" 
              tick={{ fill: '#A0AEC0', fontSize: 12 }} 
              domain={[-5, 5]}
            />
            <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#A0AEC0" 
                tick={{ fill: '#A0AEC0', fontSize: 12 }} 
                tickFormatter={(value) => `r/${value}`}
                interval={0}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(147, 197, 253, 0.1)' }}
            />
            <ReferenceLine x={0} stroke="#A0AEC0" strokeDasharray="2 2" />
            {sortedData.map((entry, index) => (
                <Bar key={`bar-${index}`} dataKey="avgScore" fill={entry.avgScore > 0 ? '#22c55e' : '#ef4444'} radius={[0, 4, 4, 0]} barSize={15} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SentimentBySubredditChart;