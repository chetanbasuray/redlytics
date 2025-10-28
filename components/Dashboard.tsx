import React from 'react';
import type { AnalysisResult } from '../types';

import StatCard from './StatCard';
import GildedContent from './GildedContent';
import BestWorstComments from './BestWorstComments';
import KarmaBreakdownChart from './KarmaBreakdownChart';
import TopSubredditsList from './TopSubredditsList';
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
import AIPersona from './AIPersona';
import AIInsightCard from './AIInsightCard';
import AIThematicAnalysis from './AIThematicAnalysis';
import AILanguageAnalysis from './AILanguageAnalysis';
import KarmaDistributionChart from './KarmaDistributionChart';
import PostHighlights from './PostHighlights';
import ShareButton from './ShareButton';

interface DashboardProps {
  result: AnalysisResult;
}

const Dashboard: React.FC<DashboardProps> = ({ result }) => {
  const { aiAnalysis } = result;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <h2 className="text-3xl font-bold text-white tracking-tight">
            AI Analysis for{' '}
            <a
                href={`https://www.reddit.com/user/${result.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:underline transition-colors"
            >
                u/{result.username}
            </a>
            </h2>
            <ShareButton username={result.username} />
        </div>
        {result.aiAnalysis?.redditBio && (
        <p className="mt-2 max-w-2xl mx-auto text-lg text-gray-400 italic">
            &ldquo;{result.aiAnalysis.redditBio}&rdquo;
        </p>
        )}
      </div>

      {/* AI Persona and Avatar Section */}
      {aiAnalysis && <AIPersona summary={aiAnalysis.personaSummary} image={aiAnalysis.avatarImage} />}

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

      {result.gildedContent.length > 0 && <GildedContent items={result.gildedContent} />}

      {/* Activity Section */}
      <section className="space-y-8">
         <h2 className="text-2xl font-bold text-white border-b-2 border-gray-700 pb-2">Activity Breakdown</h2>
         {aiAnalysis && <AIInsightCard title="AI Activity Summary" summary={aiAnalysis.activitySummary} icon="clock" />}
         <YearlyActivityHeatmap data={result.yearlyActivity} />
         <TimeSeriesChart
            title="Activity Over Time"
            data={result.activityOverTime}
            xAxisKey="date"
         />
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ActivityChart title="Activity by Hour of Day (UTC)" data={result.activityByHour} xAxisKey="hour" />
            <ActivityChart title="Activity by Day of Week (UTC)" data={result.activityByDay} xAxisKey="day" />
         </div>
      </section>

      {/* Content & Sentiment Section */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-white border-b-2 border-gray-700 pb-2">Content &amp; Sentiment Analysis</h2>
        {aiAnalysis && <AIInsightCard title="AI Content & Sentiment Summary" summary={aiAnalysis.sentimentSummary} icon="mood" />}
        {aiAnalysis && <AIThematicAnalysis themes={aiAnalysis.topThemes} />}
        {aiAnalysis && <AILanguageAnalysis analysis={aiAnalysis.languageAnalysis} />}
        <VocabularyAnalysis data={result.vocabulary} />
        
        <h3 className="text-xl font-bold text-gray-200 pt-4">Comment Analysis</h3>
        <BestWorstComments best={result.bestComment} worst={result.worstComment} />
        <SentimentHighlights best={result.mostPositiveComment} worst={result.mostNegativeComment} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SentimentBreakdownChart data={result.sentimentDistribution} />
          <SentimentBySubredditChart data={result.sentimentBySubreddit} />
        </div>
        <CommentLengthChart data={result.commentLengthDistribution} />

        <h3 className="text-xl font-bold text-gray-200 pt-4">Post Analysis</h3>
        <PostHighlights highestScorePost={result.highestScorePost} mostAwardedPost={result.mostAwardedPost} />
        <PostTypeChart data={result.postTypes} />
      </section>

      {/* Community Interaction Section */}
      <section className="space-y-8">
         <h2 className="text-2xl font-bold text-white border-b-2 border-gray-700 pb-2">Community Interaction</h2>
         {aiAnalysis && <AIInsightCard title="AI Community Summary" summary={aiAnalysis.communitySummary} icon="group" />}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SubredditStickinessChart data={result.subredditStickiness} />
            <KarmaBreakdownChart postKarma={result.postKarma} commentKarma={result.commentKarma} />
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TopSubredditsList title="Top Subreddits by Activity" items={result.topSubredditsByActivity} />
            <KarmaDistributionChart title="Top Subreddits by Karma" items={result.topSubredditsByKarma} />
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <UserFlairsList title="Recent User Flairs" items={result.userFlairs} />
             <AwardsList title="Awards Received" items={result.awardsReceived} />
             <AchievementsList items={result.trophies} />
         </div>
      </section>
    </div>
  );
};

export default Dashboard;