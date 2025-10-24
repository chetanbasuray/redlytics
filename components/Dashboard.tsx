import React from 'react';
import type { AnalysisResult } from '../types';
import StatCard from './StatCard';
import ActivityChart from './ActivityChart';
import KarmaBreakdownChart from './KarmaBreakdownChart';
import TopLanguagesList from './TopLanguagesList';
import UserFlairsList from './UserFlairsList';
import TimeSeriesChart from './TimeSeriesChart';
import KarmaDistributionChart from './KarmaDistributionChart';
import BestWorstComments from './BestWorstComments';
import AwardsList from './AwardsList';
import CommentLengthChart from './CommentLengthChart';
import WordCloud from './WordCloud';
import GildedContent from './GildedContent';
import PostTypeChart from './PostTypeChart';
import SubredditStickinessChart from './SubredditStickinessChart';
import TopSubredditsList from './TopSubredditsList';


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
    postTypeDistribution,
    subredditStickiness,
    gildedContent,
  } = result;

  return (
    <div className="animate-fade-in">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Analysis for <span className="text-sky-400">u/{username}</span></h2>
          <p className="text-gray-400">Based on the latest {totalPosts} posts and {totalComments} comments.</p>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
            <StatCard title="Total Posts" value={totalPosts.toLocaleString()} />
            <StatCard title="Total Comments" value={totalComments.toLocaleString()} />
            <StatCard title="Est. Age (Days)" value={accountAgeDays.toLocaleString()} />
            <StatCard title="Total Karma" value={totalKarma.toLocaleString()} />
            <StatCard title="Avg Post Karma" value={avgPostKarma.toLocaleString()} />
            <StatCard title="Avg Comment Karma" value={avgCommentKarma.toLocaleString()} />
            {totalAwards > 0 && <StatCard title="Awards Received" value={totalAwards.toLocaleString()} />}
            <StatCard title="Most Active" value={mostActiveHour} />
            <StatCard title="Least Active" value={leastActiveHour} />
        </div>
        
        {gildedContent.length > 0 && (
            <div className="mb-8">
                <GildedContent items={gildedContent} />
            </div>
        )}

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
             <PostTypeChart data={postTypeDistribution} />
             <SubredditStickinessChart data={subredditStickiness} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
             {totalAwards > 0 ? (
                <AwardsList title="All Awards Received" items={awards} />
             ) : (
                <UserFlairsList title="User Flairs" items={userFlairs} />
             )}
             <TopLanguagesList title="Top Languages" items={topLanguages} />
             {/* Placeholder for potential 3rd item in this row */}
             {totalAwards > 0 && <UserFlairsList title="User Flairs" items={userFlairs} />}
        </div>
    </div>
  );
};

export default Dashboard;