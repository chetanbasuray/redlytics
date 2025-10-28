import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface TimeSeriesDataPoint {
    date: string;
    posts: number;
    comments: number;
}

interface TimeSeriesChartProps {
  title: string;
  data: TimeSeriesDataPoint[];
  xAxisKey: 'date';
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const formattedLabel = new Date(label + 'T00:00:00').toLocaleDateString('en-US', { dateStyle: 'medium'});
      const totalActivity = payload.reduce((sum, entry) => sum + entry.value, 0);

      return (
        <div className="bg-black/80 backdrop-blur-sm p-3 border border-gray-600 rounded-md shadow-lg text-sm min-w-[150px]">
          <p className="font-bold text-gray-200 mb-2">{formattedLabel}</p>
          {payload.map((pld: any) => (
             <div key={pld.dataKey} className="flex items-center justify-between gap-4">
                <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: pld.color }}></div>
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

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ title, data }) => {
    if (!data || data.length === 0) {
        return null;
    }
    
    const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);
    
    const { totalComments, totalPosts } = useMemo(() => {
        return data.reduce((acc, entry) => {
            acc.totalComments += entry.comments;
            acc.totalPosts += entry.posts;
            return acc;
        }, { totalComments: 0, totalPosts: 0 });
    }, [data]);

    const handleLegendClick = (dataKey: string) => {
        if (hiddenKeys.includes(dataKey)) {
            setHiddenKeys(hiddenKeys.filter(key => key !== dataKey));
        } else {
            setHiddenKeys([...hiddenKeys, dataKey]);
        }
    };

    const formatXAxis = (tickItem: string) => {
        const date = new Date(tickItem + 'T00:00:00');
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    const tickInterval = data.length > 30 ? Math.floor(data.length / 12) : 0;

    const renderLegendText = (value: string, entry: any) => {
        const { color } = entry;
        const total = value === 'Comments' ? totalComments : totalPosts;
        return <span style={{ color }}>{value} <span className="text-gray-400 text-xs">({total.toLocaleString()})</span></span>;
    };


  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis}
              tick={{ fill: '#A0AEC0', fontSize: 12 }} 
              interval={tickInterval}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis stroke="#A0AEC0" tick={{ fill: '#A0AEC0', fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: 'rgba(147, 197, 253, 0.2)', strokeWidth: 1 }}
            />
            <Legend 
                iconType="plainline"
                wrapperStyle={{fontSize: "14px", paddingTop: "20px", cursor: "pointer"}} 
                verticalAlign="bottom"
                onClick={(e) => handleLegendClick(String(e.dataKey))}
                formatter={renderLegendText}
            />
            <Line 
                type="monotone" 
                dataKey="comments" 
                name="Comments" 
                stroke="#34d399" 
                strokeWidth={2.5} 
                dot={false} 
                activeDot={{ r: 6, strokeWidth: 2, fill: '#34d399' }}
                hide={hiddenKeys.includes('comments')}
            />
            <Line 
                type="monotone" 
                dataKey="posts" 
                name="Posts" 
                stroke="#38bdf8" 
                strokeWidth={2.5} 
                dot={false} 
                activeDot={{ r: 6, strokeWidth: 2, fill: '#38bdf8' }}
                hide={hiddenKeys.includes('posts')}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimeSeriesChart;