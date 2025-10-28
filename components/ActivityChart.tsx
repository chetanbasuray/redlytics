import React, { useState, useMemo } from 'react';
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
      const totalActivity = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);

      return (
        <div className="bg-black/80 backdrop-blur-sm p-3 border border-gray-600 rounded-md shadow-lg text-sm min-w-[150px]">
          <p className="font-bold text-gray-200 mb-2">{finalLabel}</p>
          {payload.map((pld: any) => (
             <div key={pld.dataKey} className="flex items-center justify-between gap-4">
                <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: pld.fill }}></div>
                    <span className="text-gray-300 capitalize">{pld.name}:</span>
                </div>
                <span className="font-semibold text-white">{pld.value.toLocaleString()}</span>
            </div>
          ))}
           {payload.length > 1 && totalActivity > 0 && (
              <>
                <hr className="border-gray-600 my-2" />
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        <span className="text-gray-300 font-bold">Total:</span>
                    </div>
                    <span className="font-bold text-white">{totalActivity.toLocaleString()}</span>
                </div>
              </>
          )}
        </div>
      );
    }
    return null;
};

const ActivityChart: React.FC<ActivityChartProps> = ({ title, data, xAxisKey }) => {
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);

  const { totalComments, totalPosts } = useMemo(() => {
    return data.reduce((acc, entry) => {
        acc.totalComments += entry.comments;
        acc.totalPosts += entry.posts;
        return acc;
    }, { totalComments: 0, totalPosts: 0 });
  }, [data]);


  if (!data || data.every(d => d.posts === 0 && d.comments === 0)) {
    return null;
  }

  const handleLegendClick = (dataKey: string) => {
    if (hiddenKeys.includes(dataKey)) {
        setHiddenKeys(hiddenKeys.filter(key => key !== dataKey));
    } else {
        setHiddenKeys([...hiddenKeys, dataKey]);
    }
  };

  const formatXAxis = (tickItem: string) => {
    if (xAxisKey === 'hour') {
        const hour = parseInt(tickItem, 10);
        return hour % 4 === 0 ? `${hour}:00` : '';
    }
    return tickItem;
  };
  
  const renderLegendText = (value: string, entry: any) => {
      const { color } = entry;
      const total = value === 'Comments' ? totalComments : totalPosts;
      return <span style={{ color }}>{value} <span className="text-gray-400 text-xs">({total.toLocaleString()})</span></span>;
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
            <Legend 
                wrapperStyle={{fontSize: "14px", paddingTop: "10px", cursor: 'pointer'}} 
                onClick={(e) => handleLegendClick(String(e.dataKey))}
                formatter={renderLegendText}
            />
            <Bar dataKey="posts" name="Posts" fill="#38bdf8" stackId="a" hide={hiddenKeys.includes('posts')} />
            <Bar dataKey="comments" name="Comments" fill="#34d399" stackId="a" radius={[4, 4, 0, 0]} hide={hiddenKeys.includes('comments')} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;