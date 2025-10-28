import React from 'react';

interface PostTypeChartProps {
  data: { name: string; value: number }[];
}

const PostTypeChart: React.FC<PostTypeChartProps> = ({ data }) => {
  const COLORS = ['#38bdf8', '#34d399', '#a78bfa', '#f472b6', '#fbbf24'];
  const totalPosts = data.reduce((sum, entry) => sum + entry.value, 0);

  if (totalPosts === 0) {
    return (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col items-center justify-center h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Post Type Distribution</h3>
            <p className="text-gray-400">No posts available to analyze.</p>
        </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Post Type Distribution</h3>
      <ul className="space-y-4">
        {data.map((item, index) => {
          const percentage = totalPosts > 0 ? (item.value / totalPosts) * 100 : 0;
          return (
            <li key={item.name} className="text-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-300">{item.name}</span>
                <span className="font-mono text-gray-400">
                  {item.value.toLocaleString()} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: COLORS[index % COLORS.length]
                  }}
                ></div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PostTypeChart;
