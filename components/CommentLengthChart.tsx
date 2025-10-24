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
                  <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#a78bfa' }}></div>
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
  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Comment Length Distribution</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart 
            data={data} 
            margin={{ top: 5, right: 20, left: -10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis 
                dataKey="name"
                stroke="#A0AEC0" 
                tick={{ fill: '#A0AEC0', fontSize: 10 }}
                interval={0}
                angle={-30}
                textAnchor="end"
                dy={10}
             />
            <YAxis stroke="#A0AEC0" tick={{ fill: '#A0AEC0', fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(147, 197, 253, 0.1)' }}
            />
            <Bar dataKey="count" fill="#a78bfa" name="Comments" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CommentLengthChart;