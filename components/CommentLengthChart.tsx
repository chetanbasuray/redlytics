import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface CommentLengthChartProps {
  data: { name: string; count: number }[];
}

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
              contentStyle={{
                backgroundColor: '#1A202C',
                borderColor: '#4A5568',
                color: '#E2E8F0',
                borderRadius: '0.5rem',
              }}
              cursor={{ fill: 'rgba(147, 197, 253, 0.1)' }}
              formatter={(value: number) => [value.toLocaleString(), 'Comments']}
              labelFormatter={(label) => `Length: ${label} chars`}
            />
            <Bar dataKey="count" fill="#a78bfa" name="Comments" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CommentLengthChart;