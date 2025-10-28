import React from 'react';
import type { RedditPost } from '../types';

interface PostHighlightsProps {
  highestScorePost: RedditPost | null;
  mostAwardedPost: RedditPost | null;
}

const ArrowUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

const PostCard: React.FC<{ post: RedditPost | null; type: 'Highest Voted' | 'Most Awarded' }> = ({ post, type }) => {
    const isHighest = type === 'Highest Voted';
    const borderColor = isHighest ? 'border-orange-600/50' : 'border-yellow-600/50';
    const headerColor = isHighest ? 'text-orange-400' : 'text-yellow-400';
    
    if (!post) {
        return (
             <div className={`bg-gray-900/50 p-4 rounded-lg border-2 ${borderColor} flex items-center justify-center`}>
                 <p className="text-gray-400">No post data available.</p>
             </div>
        );
    }
    
    const totalAwards = post.all_awardings.reduce((sum, award) => sum + award.count, 0);
    const permalink = `https://www.reddit.com/r/${post.subreddit}/comments/${post.id}`;


    return (
        <div className={`bg-gray-900/50 p-4 rounded-lg border-2 ${borderColor} h-full flex flex-col transition-shadow hover:shadow-lg hover:shadow-black/20`}>
            <div className="flex items-center gap-3 mb-3">
                {isHighest ? <ArrowUpIcon /> : <SparklesIcon />}
                <h4 className={`font-semibold text-lg ${headerColor}`}>{type} Post</h4>
            </div>
            <a 
              href={permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 font-semibold hover:text-sky-400 transition-colors mb-2 line-clamp-2 flex-grow"
              title={post.title}
            >
                {post.title}
            </a>
            <div className="text-xs text-gray-400 flex justify-between items-center mt-auto pt-2 border-t border-gray-700/50">
                <a href={`https://www.reddit.com/r/${post.subreddit}`} target="_blank" rel="noopener noreferrer" className="hover:underline truncate pr-2">
                  in r/{post.subreddit}
                </a>
                <div className="flex items-center gap-3">
                    <span className="font-bold text-base text-yellow-300 flex items-center gap-1">
                        <SparklesIcon /> {totalAwards.toLocaleString()}
                    </span>
                    <span className={`font-bold text-base ${headerColor} flex items-center gap-1`}>
                       <ArrowUpIcon /> {post.score.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    )
}

const PostHighlights: React.FC<PostHighlightsProps> = ({ highestScorePost, mostAwardedPost }) => {
  if (!highestScorePost && !mostAwardedPost) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Post Highlights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PostCard post={highestScorePost} type="Highest Voted" />
            <PostCard post={mostAwardedPost} type="Most Awarded" />
        </div>
    </div>
  );
};

export default PostHighlights;