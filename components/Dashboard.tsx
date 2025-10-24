import React from 'react';
import type { AnalysisResult } from '../types';

import StatCard from './StatCard';
import GildedContent from './GildedContent';
import BestWorstComments from './BestWorstComments';
import KarmaBreakdownChart from './KarmaBreakdownChart';
import TopSubredditsList from './TopSubredditsList';
import KarmaDistributionChart from './KarmaDistributionChart';
import TimeSeriesChart from './TimeSeriesChart';
import YearlyActivityHeatmap from './YearlyActivityHeatmap';
import PostTypeChart from './PostTypeChart';
import UserFlairsList from './UserFlairsList';
import SubredditStickinessChart from './SubredditStickinessChart';
import AwardsList from './AwardsList';
import AchievementsList from './AchievementsList';
import CommentLengthChart from './CommentLengthChart';
import SentimentBreakdownChart from './SentimentBreakdownChart';
import SentimentBySubredditChart from './SentimentBySubredditChart';
import SentimentHighlights from './SentimentHighlights';
import VocabularyAnalysis from './VocabularyAnalysis';
import ActivityChart from './ActivityChart';

interface DashboardProps {
  result: AnalysisResult;
}

const Dashboard: React.FC<DashboardProps> = ({ result }) => {
  const hasAwards = result.awardsReceived.length > 0;
  const hasTrophies = result.trophies.length > 0;

  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard title="Total Posts" value={result.totalPosts.toLocaleString()} />
          <StatCard title="Total Comments" value={result.totalComments.toLocaleString()} />
          <StatCard title="Post Karma" value={result.postKarma.toLocaleString()} />
          <StatCard title="Comment Karma" value={result.commentKarma.toLocaleString()} />
          <StatCard title="Avg. Post Score" value={Math.round(result.avgPostScore)} />
          <StatCard title="Avg. Comment Score" value={Math.round(result.avgCommentScore)} />
        </div>
      </section>

      <GildedContent items={result.gildedContent} />

      {/* Activity Section */}
      <section className="space-y-8">
         <h2 className="text-2xl font-bold text-white border-b-2 border-gray-700 pb-2">Activity Breakdown</h2>
         <YearlyActivityHeatmap data={result.yearlyActivity} />
         <TimeSeriesChart
            title="Activity Over Time"
            data={result.activityOverTime}
            xAxisKey="date"
            lines={[
                { dataKey: 'posts', name: 'Posts', color: '#38bdf8' },
                { dataKey: 'comments', name: 'Comments', color: '#34d399' }
            ]}
         />
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ActivityChart title="Activity by Hour of Day (UTC)" data={result.activityByHour} xAxisKey="hour" />
            <ActivityChart title="Activity by Day of Week (UTC)" data={result.activityByDay} xAxisKey="day" />
         </div>
      </section>

      {/* Content & Sentiment Section */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-white border-b-2 border-gray-700 pb-2">Content &amp; Sentiment Analysis</h2>
        <VocabularyAnalysis data={result.vocabulary} />
        <BestWorstComments best={result.bestComment} worst={result.worstComment} />
        <SentimentHighlights best={result.mostPositiveComment} worst={result.mostNegativeComment} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SentimentBreakdownChart data={result.sentimentDistribution} />
          <SentimentBySubredditChart data={result.sentimentBySubreddit} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PostTypeChart data={result.postTypes} />
            <CommentLengthChart data={result.commentLengthDistribution} />
        </div>
      </section>

      {/* Community Interaction Section */}
      <section className="space-y-8">
         <h2 className="text-2xl font-bold text-white border-b-2 border-gray-700 pb-2">Community Interaction</h2>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SubredditStickinessChart data={result.subredditStickiness} />
            <KarmaBreakdownChart postKarma={result.postKarma} commentKarma={result.commentKarma} />
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TopSubredditsList title="Top Subreddits by Activity" items={result.topSubredditsByActivity} />
            <KarmaDistributionChart data={result.topSubredditsByKarma} />
         </div>
         <div className={`grid grid-cols-1 ${hasAwards && hasTrophies ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-8`}>
             <UserFlairsList title="Recent User Flairs" items={result.userFlairs} />
             {hasAwards && <AwardsList title="Awards Received" items={result.awardsReceived} />}
             {hasTrophies && <AchievementsList items={result.trophies} />}
         </div>
      </section>
    </div>
  );
};

export default Dashboard;