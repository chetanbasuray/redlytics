import React from 'react';

interface AIInsightCardProps {
  title: string;
  summary: string;
  icon: 'clock' | 'mood' | 'group';
}

// FIX: Changed type from 'JSX.Element' to 'React.ReactElement' to resolve namespace error.
// 'React.ReactElement' is a more explicit type provided by the React import.
const ICONS: Record<string, React.ReactElement> = {
    clock: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    mood: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    group: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
}

const AIInsightCard: React.FC<AIInsightCardProps> = ({ title, summary, icon }) => {
  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">{ICONS[icon]}</div>
            <div>
                <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{summary}</p>
            </div>
        </div>
    </div>
  );
};

export default AIInsightCard;