import React from 'react';
import type { RedditComment } from '../types';

interface SentimentHighlightsProps {
  best: RedditComment | null;
  worst: RedditComment | null;
}

const HappyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SentimentCard: React.FC<{ comment: RedditComment | null; type: 'Positive' | 'Negative' }> = ({ comment, type }) => {
    const isPositive = type === 'Positive';
    const borderColor = isPositive ? 'border-green-600/50' : 'border-red-600/50';
    const headerColor = isPositive ? 'text-green-400' : 'text-red-400';
    
    if (!comment) {
        return (
             <div className={`bg-gray-900/50 p-4 rounded-lg border-2 ${borderColor} flex items-center justify-center`}>
                 <p className="text-gray-400">Not enough comment data.</p>
             </div>
        );
    }
    
    const sentimentScore = comment.sentiment.score.toFixed(2);

    return (
        <div className={`bg-gray-900/50 p-4 rounded-lg border-2 ${borderColor} h-full flex flex-col transition-shadow hover:shadow-lg hover:shadow-black/20`}>
            <div className="flex items-center gap-3 mb-3">
                {isPositive ? <HappyIcon /> : <SadIcon />}
                <h4 className={`font-semibold text-lg ${headerColor}`}>Most {type} Comment</h4>
            </div>
            <blockquote
              className="text-gray-300 text-sm italic border-l-2 border-gray-700 pl-3 mb-4 flex-grow"
              title={comment.body}
            >
                {comment.body.length > 200 ? `${comment.body.substring(0, 200)}...` : comment.body}
            </blockquote>
            <div className="text-xs text-gray-400 flex justify-between items-center mt-auto pt-2 border-t border-gray-700/50">
                <a href={`https://www.reddit.com${comment.permalink}`} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors truncate pr-2">
                  in r/{comment.subreddit}
                </a>
                <span className={`font-bold text-base ${headerColor}`}>Sentiment: {sentimentScore}</span>
            </div>
        </div>
    )
}

const SentimentHighlights: React.FC<SentimentHighlightsProps> = ({ best, worst }) => {
  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Sentiment Highlights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SentimentCard comment={best} type="Positive" />
            <SentimentCard comment={worst} type="Negative" />
        </div>
    </div>
  );
};

export default SentimentHighlights;