import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, ReferenceLine } from 'recharts';
import type { SentimentBySubreddit } from '../types';

interface SentimentBySubredditChartProps {
  data: SentimentBySubreddit[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/80 backdrop-blur-sm p-3 border border-gray-600 rounded-md shadow-lg text-sm">
          <p className="font-bold text-gray-200 mb-2">{`r/${label}`}</p>
          <div className="flex items-center justify-between gap-4">
              <span className="text-gray-300">Avg. Sentiment Score:</span>
              <span className="font-semibold text-white">{data.avgScore.toFixed(2)}</span>
          </div>
           <div className="flex items-center justify-between gap-4">
              <span className="text-gray-300">Comment Count:</span>
              <span className="font-semibold text-white">{data.count.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
};

const SentimentBySubredditChart: React.FC<SentimentBySubredditChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col items-center justify-center h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Sentiment by Subreddit</h3>
            <p className="text-gray-400 text-center">Not enough data to compare sentiment across subreddits.</p>
        </div>
    );
  }

  // Sort by name for consistent order, then reverse to show most positive on top if layout is vertical.
  const sortedData = [...data].sort((a, b) => a.avgScore - b.avgScore);

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Avg. Comment Sentiment by Subreddit</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart 
            layout="vertical" 
            data={sortedData} 
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis 
              type="number" 
              stroke="#A0AEC0" 
              tick={{ fill: '#A0AEC0', fontSize: 12 }} 
              domain={['auto', 'auto']}
              allowDataOverflow={true}
            />
            <YAxis 
                type="category" 
                dataKey="name" 
                interval={0}
                stroke="#A0AEC0" 
                tick={{ fill: '#A0AEC0', fontSize: 12 }} 
                tickFormatter={(value) => `r/${value}`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(147, 197, 253, 0.1)' }}
            />
            <ReferenceLine x={0} stroke="#A0AEC0" strokeDasharray="2 2" />
            <Bar dataKey="avgScore" name="Avg Sentiment" barSize={20}>
              {sortedData.map((entry, index) => {
                  let color = '#64748b'; // Neutral
                  if (entry.avgScore > 0.05) color = '#22c55e'; // Positive
                  if (entry.avgScore < -0.05) color = '#ef4444'; // Negative
                  return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SentimentBySubredditChart;