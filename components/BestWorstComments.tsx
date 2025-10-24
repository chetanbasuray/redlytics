import React from 'react';
import type { RedditComment } from '../types';

interface BestWorstCommentsProps {
  best: RedditComment | null;
  worst: RedditComment | null;
}

const ThumbsUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 18.233V10h7zm-7-1a1 1 0 00-1 1v7a1 1 0 001 1h2a1 1 0 001-1v-7a1 1 0 00-1-1H7z" />
    </svg>
);

const ThumbsDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.738 3h4.017c.163 0 .326.02.485.06L17 5.767V14h-7zm7 1a1 1 0 001-1V8a1 1 0 00-1-1h-2a1 1 0 00-1 1v7a1 1 0 001 1h2z" />
    </svg>
);

const CommentCard: React.FC<{ comment: RedditComment | null; type: 'Best' | 'Worst' }> = ({ comment, type }) => {
    const isBest = type === 'Best';
    const borderColor = isBest ? 'border-green-600/50' : 'border-red-600/50';
    const headerColor = isBest ? 'text-green-400' : 'text-red-400';
    const scoreColor = isBest ? 'text-green-400' : 'text-red-400';
    
    if (!comment) {
        return (
             <div className={`bg-gray-900/50 p-4 rounded-lg border-2 ${borderColor} flex items-center justify-center`}>
                 <p className="text-gray-400">Not enough comment data.</p>
             </div>
        );
    }

    return (
        <div className={`bg-gray-900/50 p-4 rounded-lg border-2 ${borderColor} h-full flex flex-col transition-shadow hover:shadow-lg hover:shadow-black/20`}>
            <div className="flex items-center gap-3 mb-3">
                {isBest ? <ThumbsUpIcon /> : <ThumbsDownIcon />}
                <h4 className={`font-semibold text-lg ${headerColor}`}>{type} Comment</h4>
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
                <span className={`font-bold text-base ${scoreColor}`}>{comment.score.toLocaleString()}</span>
            </div>
        </div>
    )
}

const BestWorstComments: React.FC<BestWorstCommentsProps> = ({ best, worst }) => {
  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Comment Highlights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CommentCard comment={best} type="Best" />
            <CommentCard comment={worst} type="Worst" />
        </div>
    </div>
  );
};

export default BestWorstComments;