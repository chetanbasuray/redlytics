import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface TimeSeriesChartProps {
  title: string;
  data: any[];
  xAxisKey: string;
  lines: {
      dataKey: string;
      name: string;
      color: string;
  }[];
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ title, data, xAxisKey, lines }) => {
    const initialVisibility = lines.reduce((acc, line) => {
        acc[line.dataKey] = true;
        return acc;
    }, {} as Record<string, boolean>);

    const [visibility, setVisibility] = useState(initialVisibility);

    const toggleVisibility = (dataKey: string) => {
        setVisibility(prev => ({ ...prev, [dataKey]: !prev[dataKey] }));
    };

    const formatXAxis = (tickItem: string) => {
        // Example: "2023-04-15" -> "Apr 15"
        const date = new Date(tickItem + 'T00:00:00'); // Ensure parsing as local time
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis 
              dataKey={xAxisKey} 
              stroke="#A0AEC0" 
              tick={{ fill: '#A0AEC0', fontSize: 12 }}
              tickFormatter={formatXAxis}
              dy={5}
            />
            <YAxis stroke="#A0AEC0" tick={{ fill: '#A0AEC0', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A202C',
                borderColor: '#4A5568',
                color: '#E2E8F0',
                borderRadius: '0.5rem',
              }}
              labelFormatter={(label) => new Date(label + 'T00:00:00').toLocaleDateString('en-US', { dateStyle: 'medium'})}
            />
            <Legend 
              onClick={(e) => toggleVisibility(e.dataKey as string)}
              wrapperStyle={{fontSize: "14px", cursor: 'pointer'}}
              formatter={(value, entry) => {
                  const { dataKey } = entry;
                  const color = visibility[dataKey as string] ? entry.color : '#718096';
                  return <span style={{ color }}>{value}</span>;
              }}
            />
            {lines.map(line => (
                 <Line 
                    key={line.dataKey}
                    type="monotone" 
                    dataKey={line.dataKey} 
                    name={line.name}
                    stroke={line.color} 
                    strokeWidth={2}
                    dot={false}
                    hide={!visibility[line.dataKey]}
                />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimeSeriesChart;