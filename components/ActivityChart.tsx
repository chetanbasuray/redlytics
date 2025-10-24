import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface ActivityDataPoint {
    posts: number;
    comments: number;
    [key: string]: any; // Allows for 'hour' or 'day'
}

interface ActivityChartProps {
  title: string;
  data: ActivityDataPoint[];
  xAxisKey: 'hour' | 'day';
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const finalLabel = payload[0].payload.day || `${label}:00 - ${parseInt(label, 10)+1}:00`;
      return (
        <div className="bg-black/80 backdrop-blur-sm p-3 border border-gray-600 rounded-md shadow-lg text-sm">
          <p className="font-bold text-gray-200 mb-2">{finalLabel}</p>
          {payload.map((pld: any) => (
             <div key={pld.dataKey} className="flex items-center justify-between gap-4">
                <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: pld.fill }}></div>
                    <span className="text-gray-300 capitalize">{pld.dataKey}:</span>
                </div>
                <span className="font-semibold text-white">{pld.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
};

const ActivityChart: React.FC<ActivityChartProps> = ({ title, data, xAxisKey }) => {
  const formatXAxis = (tickItem: string) => {
    if (xAxisKey === 'hour') {
        // Show every 4 hours for clarity
        const hour = parseInt(tickItem, 10);
        return hour % 4 === 0 ? `${hour}:00` : '';
    }
    return tickItem;
  };
    
  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis 
              dataKey={xAxisKey} 
              stroke="#A0AEC0" 
              tick={{ fill: '#A0AEC0', fontSize: 12 }}
              tickFormatter={formatXAxis}
              interval={0}
            />
            <YAxis 
                stroke="#A0AEC0" 
                tick={{ fill: '#A0AEC0', fontSize: 12 }} 
                allowDecimals={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(147, 197, 253, 0.1)' }}
            />
            <Legend wrapperStyle={{fontSize: "14px", paddingTop: "10px"}} />
            <Bar dataKey="posts" fill="#38bdf8" name="Posts" stackId="a" />
            <Bar dataKey="comments" fill="#34d399" name="Comments" stackId="a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;