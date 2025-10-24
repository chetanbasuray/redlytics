import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface ActivityChartProps {
  title: string;
  data: { posts: number; comments: number; [key: string]: any }[];
  xAxisKey: string;
  showTimezoneToggle: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-sm p-3 border border-gray-600 rounded-md shadow-lg text-sm">
          <p className="font-bold text-gray-200 mb-2">{label}</p>
          {payload.map((pld: any) => (
            <div key={pld.dataKey} className="flex items-center justify-between gap-4">
                <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: pld.color }}></div>
                    <span className="text-gray-300">{pld.name}:</span>
                </div>
                <span className="font-semibold text-white">{pld.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
};


const ActivityChart: React.FC<ActivityChartProps> = ({ title, data, xAxisKey, showTimezoneToggle }) => {
  const [visibility, setVisibility] = useState({ posts: true, comments: true });
  const [timeZone, setTimeZone] = useState<'Local' | 'UTC'>('Local');

  const processedData = useMemo(() => {
    if (showTimezoneToggle && xAxisKey === 'hour') {
      const offsetHours = timeZone === 'Local' ? new Date().getTimezoneOffset() / -60 : 0;
      const adjustedData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        posts: 0,
        comments: 0,
      }));

      data.forEach((item, index) => {
        let newHour = index + offsetHours;
        if (newHour < 0) newHour += 24;
        if (newHour >= 24) newHour -= 24;
        newHour = Math.floor(newHour);

        adjustedData[newHour].posts += item.posts;
        adjustedData[newHour].comments += item.comments;
      });
      return adjustedData;
    }
    return data;
  }, [data, timeZone, showTimezoneToggle, xAxisKey]);

  const toggleVisibility = (dataKey: 'posts' | 'comments') => {
    setVisibility(prev => ({ ...prev, [dataKey]: !prev[dataKey] }));
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {showTimezoneToggle && (
            <div className="flex items-center justify-end gap-2">
                <button
                onClick={() => setTimeZone('Local')}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${timeZone === 'Local' ? 'bg-sky-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                Local Time
                </button>
                <button
                onClick={() => setTimeZone('UTC')}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${timeZone === 'UTC' ? 'bg-sky-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                UTC
                </button>
            </div>
        )}
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={processedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis 
              dataKey={xAxisKey} 
              stroke="#A0AEC0" 
              tick={{ fill: '#A0AEC0', fontSize: 12 }} 
              interval={xAxisKey === 'hour' ? 3 : 0}
            />
            <YAxis stroke="#A0AEC0" tick={{ fill: '#A0AEC0', fontSize: 12 }} allowDecimals={false}/>
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(147, 197, 253, 0.1)' }}
            />
            <Legend
              onClick={(e) => toggleVisibility(e.dataKey as 'posts' | 'comments')}
              wrapperStyle={{fontSize: "14px", cursor: 'pointer'}}
              formatter={(value, entry) => {
                  const { dataKey } = entry;
                  const color = visibility[dataKey as 'posts' | 'comments'] ? entry.color : '#718096';
                  return <span style={{ color }}>{value}</span>;
              }}
            />
            <Bar dataKey="posts" name="Posts" stackId="a" fill="#38bdf8" radius={[4, 4, 0, 0]} hide={!visibility.posts} />
            <Bar dataKey="comments" name="Comments" stackId="a" fill="#34d399" radius={[4, 4, 0, 0]} hide={!visibility.comments} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;