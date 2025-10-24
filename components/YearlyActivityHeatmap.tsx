import React from 'react';

interface YearlyActivityHeatmapProps {
  data: { date: string; count: number }[];
}

// Fix: Replaced component with a more robust version that was incorrectly placed in types.ts
const YearlyActivityHeatmap: React.FC<YearlyActivityHeatmapProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Last Year's Activity</h3>
                <p className="text-gray-400 text-center py-10">No activity data available for the past year.</p>
            </div>
        );
    }

  const today = new Date();
  const yearAgo = new Date(today);
  yearAgo.setFullYear(today.getFullYear() - 1);
  yearAgo.setDate(yearAgo.getDate() + 1); // Start from exactly 365 days ago

  const activityByDate = new Map<string, number>();
  data.forEach(d => activityByDate.set(d.date, d.count));
  
  const allDays: { date: Date; count: number }[] = [];
  let currentDate = new Date(yearAgo);
  
  while (currentDate <= today) {
    const dateString = currentDate.toISOString().split('T')[0];
    allDays.push({
      date: new Date(currentDate),
      count: activityByDate.get(dateString) || 0
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const maxCount = Math.max(...allDays.map(d => d.count), 0);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-700/60';
    if (maxCount === 0) return 'bg-gray-700/60';
    const ratio = Math.sqrt(count / maxCount); // Sqrt scale for better visual difference
    if (ratio > 0.85) return 'bg-sky-400';
    if (ratio > 0.6) return 'bg-sky-500';
    if (ratio > 0.3) return 'bg-sky-600';
    return 'bg-sky-700';
  };

  const firstDayOffset = allDays[0].date.getDay();
  const emptyDays = Array(firstDayOffset).fill(null);
  
  const monthLabels: { label: string; weekIndex: number }[] = [];
  let lastMonth = -1;

  const totalColumns = Math.ceil((allDays.length + firstDayOffset) / 7);

  allDays.forEach((day, index) => {
      const currentDay = day.date;
      const month = currentDay.getMonth();
      // Add a label for the first week of a new month
      if (month !== lastMonth) {
          const weekIndex = Math.floor((index + firstDayOffset) / 7);
          // Prevent label from being too close to the previous one
          const lastLabelWeek = monthLabels[monthLabels.length-1]?.weekIndex ?? -Infinity;
          if (weekIndex > lastLabelWeek + 2) {
            monthLabels.push({ label: currentDay.toLocaleDateString('en-US', { month: 'short' }), weekIndex });
            lastMonth = month;
          }
      }
  });

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Last Year's Activity</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {/* Day Labels */}
        <div className="flex flex-col text-xs text-gray-500 pt-8 pr-2 flex-shrink-0">
          <div className="h-4 flex items-center">Mon</div>
          <div className="h-4 flex items-center" style={{marginTop: '3px'}}></div>
          <div className="h-4 flex items-center" style={{marginTop: '3px'}}>Wed</div>
          <div className="h-4 flex items-center" style={{marginTop: '3px'}}></div>
          <div className="h-4 flex items-center" style={{marginTop: '3px'}}>Fri</div>
        </div>
        
        <div className="relative">
          {/* Month Labels */}
          <div className="absolute top-0 left-0 h-8 flex" style={{ gap: '3px', alignItems: 'center' }}>
              {Array.from({ length: totalColumns }).map((_, weekIndex) => {
                  const month = monthLabels.find(m => m.weekIndex === weekIndex);
                  return (
                      <div key={weekIndex} className="w-4 text-xs text-gray-400">
                          {month ? month.label : ''}
                      </div>
                  );
              })}
          </div>

          {/* Heatmap Grid */}
          <div className="grid grid-rows-7 grid-flow-col gap-[3px] pt-8">
            {emptyDays.map((_, index) => <div key={`empty-${index}`} className="w-4 h-4" />)}
            {allDays.map((day, index) => (
              <div key={day.date.toString() + index} className="group relative">
                <div
                  className={`w-4 h-4 rounded-sm ${getColor(day.count)}`}
                />
                <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                  {day.count} {day.count === 1 ? 'activity' : 'activities'} on {day.date.toLocaleDateString('en-US', { dateStyle: 'medium' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyActivityHeatmap;
