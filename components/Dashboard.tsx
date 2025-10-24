import React from 'react';
import type { AnalysisResult } from '../types';
import StatCard from './StatCard';
import ActivityChart from './ActivityChart';
import TopItemsList from './TopItemsList';
import KarmaBreakdownChart from './KarmaBreakdownChart';
import TopLanguagesList from './TopLanguagesList';
import UserFlairsList from './UserFlairsList';
import TimeSeriesChart from './TimeSeriesChart';
import KarmaDistributionChart from './KarmaDistributionChart';
import BestWorstComments from './BestWorstComments';
import AwardsList from './AwardsList';
import CommentLengthChart from './CommentLengthChart';
import WordCloud from './WordCloud';


interface DashboardProps {
  result: AnalysisResult;
}

const Dashboard: React.FC<DashboardProps> = ({ result }) => {
  const { 
    username,
    totalPosts,
    totalComments,
    totalKarma,
    totalPostKarma,
    totalCommentKarma,
    accountAgeDays,
    avgCommentKarma,
    avgPostKarma,
    activityByHour,
    activityByDay,
    topSubreddits,
    topWords,
    topLanguages,
    mostActiveHour,
    leastActiveHour,
    userFlairs,
    activityOverTime,
    scoreOverTime,
    karmaBySubreddit,
    commentLengthDistribution,
    bestComment,
    worstComment,
    totalAwards,
    awards,
  } = result;

  return (
    <div className="animate-fade-in">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Analysis for <span className="text-sky-400">u/{username}</span></h2>
          <p className="text-gray-400">Based on the latest {totalPosts} posts and {totalComments} comments.</p>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
            {/* Activity Stats */}
            <StatCard title="Total Posts" value={totalPosts.toLocaleString()} />
            <StatCard title="Total Comments" value={totalComments.toLocaleString()} />
            <StatCard title="Est. Age (Days)" value={accountAgeDays.toLocaleString()} />

            {/* Karma Stats */}
            <StatCard title="Total Karma" value={totalKarma.toLocaleString()} />
            <StatCard title="Avg Post Karma" value={avgPostKarma.toLocaleString()} />
            <StatCard title="Avg Comment Karma" value={avgCommentKarma.toLocaleString()} />
            
            {/* Engagement Stats */}
            {totalAwards > 0 && <StatCard title="Awards Received" value={totalAwards.toLocaleString()} />}
            <StatCard title="Most Active" value={mostActiveHour} />
            <StatCard title="Least Active" value={leastActiveHour} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ActivityChart 
                title="Activity by Hour"
                data={activityByHour}
                xAxisKey="hour"
                showTimezoneToggle={true}
            />
            <ActivityChart 
                title="Activity by Day"
                data={activityByDay}
                xAxisKey="day"
                showTimezoneToggle={false}
            />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <TimeSeriesChart
                title="Activity Over Time"
                data={activityOverTime}
                xAxisKey="date"
                lines={[
                    { dataKey: 'posts', name: 'Posts', color: '#38bdf8' },
                    { dataKey: 'comments', name: 'Comments', color: '#34d399' }
                ]}
            />
             <TimeSeriesChart
                title="Upvote Trends (Avg Score Over Time)"
                data={scoreOverTime}
                xAxisKey="date"
                lines={[
                    { dataKey: 'avgPostScore', name: 'Avg Post Score', color: '#38bdf8' },
                    { dataKey: 'avgCommentScore', name: 'Avg Comment Score', color: '#34d399' }
                ]}
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <KarmaDistributionChart data={karmaBySubreddit} />
            <CommentLengthChart data={commentLengthDistribution} />
        </div>
        
        <div className="grid grid-cols-1 gap-8 mb-8">
            <BestWorstComments best={bestComment} worst={worstComment} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
             <TopSubredditsList title="Top Subreddits by Activity" items={topSubreddits} />
             <WordCloud title="Top Words Used" words={topWords} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <KarmaBreakdownChart postKarma={totalPostKarma} commentKarma={totalCommentKarma} />
             {totalAwards > 0 ? (
                <AwardsList title="Awards Received" items={awards} />
             ) : (
                <UserFlairsList title="User Flairs" items={userFlairs} />
             )}
             <TopLanguagesList title="Top Languages" items={topLanguages} />
        </div>
    </div>
  );
};


// A new component for TopSubredditsList to add link to subreddit
const TopSubredditsList: React.FC<{title: string, items: {name: string, count: number}[]}> = ({ title, items }) => {
  const maxCount = items[0]?.count || 1;
  return (
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
          <ul className="space-y-3">
              {items.map((item, index) => (
                  <li key={index} className="text-sm">
                      <div className="flex justify-between items-center mb-1">
                          <a 
                            href={`https://www.reddit.com/r/${item.name}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-300 truncate hover:text-sky-400 transition-colors"
                          >
                            r/{item.name}
                          </a>
                          <span className="font-mono text-gray-400">{item.count.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div
                              className="bg-sky-500 h-1.5 rounded-full"
                              style={{ width: `${(item.count / maxCount) * 100}%` }}
                          ></div>
                      </div>
                  </li>
              ))}
          </ul>
      </div>
  );
}

export default Dashboard;