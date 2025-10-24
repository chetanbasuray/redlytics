import React from 'react';
import type { AnalysisResult } from '../types';
import StatCard from './StatCard';
import ActivityChart from './ActivityChart';
import TimeSeriesChart from './TimeSeriesChart';
import KarmaBreakdownChart from './KarmaBreakdownChart';
import KarmaDistributionChart from './KarmaDistributionChart';
import PostTypeChart from './PostTypeChart';
import SubredditStickinessChart from './SubredditStickinessChart';
import TopSubredditsList from './TopSubredditsList';
import BestWorstComments from './BestWorstComments';
import GildedContent from './GildedContent';
import AwardsList from './AwardsList';
import UserFlairsList from './UserFlairsList';
import YearlyActivityHeatmap from './YearlyActivityHeatmap';
import CommentLengthChart from './CommentLengthChart';
import SentimentBreakdownChart from './SentimentBreakdownChart';
import SentimentBySubredditChart from './SentimentBySubredditChart';
import SentimentHighlights from './SentimentHighlights';
import SimpleRankedList from './SimpleRankedList';
import VocabularyAnalysis from './VocabularyAnalysis';
import AchievementsList from './AchievementsList';

interface DashboardProps {
  result: AnalysisResult;
}

const Dashboard: React.FC<DashboardProps> = ({ result }) => {
  return (
    <div className="animate-fade-in space-y-8">
        <header className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Analysis for <a 
                                href={`https://www.reddit.com/user/${result.username}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sky-400 hover:underline"
                            >
                                u/{result.username}
                            </a>
            </h2>
        </header>

        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <StatCard title="Total Karma" value={result.totalKarma.toLocaleString()} />
            <StatCard title="Post Karma" value={result.postKarma.toLocaleString()} />
            <StatCard title="Comment Karma" value={result.commentKarma.toLocaleString()} />
            <StatCard title="Total Posts" value={result.totalPosts.toLocaleString()} />
            <StatCard title="Total Comments" value={result.totalComments.toLocaleString()} />
            <StatCard title="Avg. Post Karma" value={Math.round(result.avgPostScore)} />
            <StatCard title="Avg. Comment Karma" value={Math.round(result.avgCommentScore)} />
            <StatCard title="Data Spans (Days)" value={result.dataSpansDays.toLocaleString()} />
            <StatCard title="Most Active Day" value={result.mostActiveDay} />
            <StatCard title="Most Active Hour" value={result.mostActiveHour} />
            {result.totalAwards > 0 && <StatCard title="Awards Received" value={result.totalAwards.toLocaleString()} />}
        </section>

        {result.gildedContent.length > 0 && (
             <section>
                <GildedContent items={result.gildedContent} />
             </section>
        )}
        
        <section>
            <YearlyActivityHeatmap data={result.yearlyActivity} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ActivityChart title="Activity by Day of Week (UTC)" data={result.activeDays} xAxisKey="day" showTimezoneToggle={false} />
            <ActivityChart title="Activity by Hour of Day" data={result.activeHours} xAxisKey="hour" showTimezoneToggle={true} />
        </div>

        <section>
             <TimeSeriesChart 
                title="Activity & Karma Over Time" 
                data={result.activityByMonth} 
                xAxisKey="date" 
                lines={[
                    { dataKey: 'posts', name: 'Posts', color: '#38bdf8' },
                    { dataKey: 'comments', name: 'Comments', color: '#34d399' },
                    { dataKey: 'postKarma', name: 'Post Karma', color: '#f472b6' },
                    { dataKey: 'commentKarma', name: 'Comment Karma', color: '#fbbf24' }
                ]} 
            />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <KarmaBreakdownChart postKarma={result.postKarma} commentKarma={result.commentKarma} />
            <KarmaDistributionChart data={result.topSubredditsByKarma.map(s => ({name: s.name, karma: s.value}))} />
            <TopSubredditsList title="Most Active Subreddits (by Posts & Comments)" items={result.topSubredditsByActivity} />
            <SubredditStickinessChart data={result.subredditStickiness} />
        </div>

        <section>
            <BestWorstComments best={result.bestComment} worst={result.worstComment} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PostTypeChart data={result.postTypes} />
            <CommentLengthChart data={result.commentLengthDistribution} />
        </div>

        <section className="space-y-8">
            <div className="text-center">
                 <h3 className="text-2xl font-bold text-white tracking-tight">Sentiment Analysis</h3>
                 <p className="text-gray-400 mt-1">Analysis of the user's comment sentiment.</p>
            </div>
            <SentimentHighlights best={result.mostPositiveComment} worst={result.mostNegativeComment} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SentimentBreakdownChart data={result.sentimentBreakdown} />
                <SentimentBySubredditChart data={result.sentimentBySubreddit} />
            </div>
        </section>

        <section>
            <VocabularyAnalysis data={result.vocabulary} />
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            { result.achievements.length > 0 && <AchievementsList title="Achievements" items={result.achievements} /> }
            { result.topAwards.length > 0 && <AwardsList title="Top Awards Received" items={result.topAwards} /> }
            { result.userFlairs.length > 0 && <UserFlairsList title="Recently Used Flairs" items={result.userFlairs} /> }
            { result.topMentionedSubreddits.length > 0 && <SimpleRankedList title="Most Mentioned Subreddits" items={result.topMentionedSubreddits} valueLabel="mentions" /> }
        </div>
    </div>
  );
};

export default Dashboard;