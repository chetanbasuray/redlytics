import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface KarmaDistributionProps {
  title: string;
  items: { name: string; karma: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-sm p-3 border border-gray-600 rounded-md shadow-lg text-sm">
          <p className="font-bold text-gray-200 mb-2">{`r/${label}`}</p>
          <div className="flex items-center justify-between gap-4">
              <span className="text-gray-300">Karma:</span>
              <span className="font-semibold text-white">{payload[0].value.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
};

const KarmaDistributionChart: React.FC<KarmaDistributionProps> = ({ title, items }) => {
  const positiveKarmaItems = items.filter(item => item.karma > 0);

  if (!positiveKarmaItems || positiveKarmaItems.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart 
            data={positiveKarmaItems} 
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis type="number" stroke="#A0AEC0" tick={{ fill: '#A0AEC0', fontSize: 12 }} />
            <YAxis 
                type="category" 
                dataKey="name" 
                width={120} 
                stroke="#A0AEC0" 
                tick={{ fill: '#A0AEC0', fontSize: 12 }} 
                tickFormatter={(value) => `r/${value}`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(147, 197, 253, 0.1)' }}
            />
            <Bar dataKey="karma" fill="#34d399" name="Karma" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default KarmaDistributionChart;