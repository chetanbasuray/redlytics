import React from 'react';
import type { RedditPost, RedditComment } from '../types';

interface GildedContentProps {
  items: (RedditPost | RedditComment)[];
}

const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a3 3 0 100-6 3 3 0 000 6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 12a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);


const GildedItemCard: React.FC<{ item: RedditPost | RedditComment }> = ({ item }) => {
    const isPost = 'title' in item;
    const content = isPost ? item.title : item.body;
    const permalink = isPost ? `https://www.reddit.com/r/${item.subreddit}/comments/${item.id}` : `https://www.reddit.com${(item as RedditComment).permalink}`;
    
    // Find the highest-tier award icon to display
    const goldAward = item.all_awardings?.find(a => a.name === 'Gold Award');
    const platinumAward = item.all_awardings?.find(a => a.name === 'Platinum Award');
    const awardIconUrl = platinumAward?.icon_url || goldAward?.icon_url;

    return (
        <a href={permalink} target="_blank" rel="noopener noreferrer" className="block bg-gray-900/50 p-4 rounded-lg border-2 border-yellow-600/50 hover:border-yellow-500/80 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30">
            <div className="flex items-start gap-4">
                {awardIconUrl && <img src={awardIconUrl} alt="Award" className="h-8 w-8 mt-1 flex-shrink-0" />}
                <div className="flex-grow">
                    <p className="text-yellow-200 text-sm italic line-clamp-2" title={content}>
                        {content}
                    </p>
                    <div className="text-xs text-gray-400 mt-2 flex justify-between items-center">
                        <span>in r/{item.subreddit}</span>
                        <span className="font-bold text-yellow-300">{item.score.toLocaleString()} points</span>
                    </div>
                </div>
            </div>
        </a>
    );
};

const GildedContent: React.FC<GildedContentProps> = ({ items }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
            <TrophyIcon />
            <h3 className="text-lg font-semibold text-yellow-300">Trophy Case: Gilded Content</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.slice(0, 6).map((item) => ( // Show up to 6 items
                <GildedItemCard key={item.id} item={item} />
            ))}
        </div>
    </div>
  );
};

export default GildedContent;