import type { RedditData, AnalysisResult, RedditAward, RedditComment, RedditPost } from '../types';
import { franc } from 'franc';
import { getLanguageInfo } from './languageUtils';
import { getSentiment } from './sentimentAnalyzer';


const STOP_WORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 
  'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 
  'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 
  'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 
  'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 
  'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 
  'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 
  'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 
  'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 've', 'll'
]);

const PREMIUM_AWARDS = new Set(['Gold Award', 'Platinum Award', 'Ternion All-Powerful Award', 'Argentium Award']);


export function analyzeData(data: RedditData, username: string): AnalysisResult {
  const { posts, comments: rawComments } = data;
  
  // --- Pre-process comments with sentiment ---
  const comments = rawComments.map(comment => ({
      ...comment,
      sentiment: getSentiment(comment.body),
  }));

  const allItems = [...posts, ...comments];

  // Basic Stats
  const totalPosts = posts.length;
  const totalComments = comments.length;
  const totalKarma = allItems.reduce((sum, item) => sum + item.score, 0);
  const totalPostKarma = posts.reduce((sum, item) => sum + item.score, 0);
  const totalCommentKarma = comments.reduce((sum, item) => sum + item.score, 0);

  // Account Age
  const oldestItem = allItems.sort((a, b) => a.created_utc - b.created_utc)[0];
  const accountAgeDays = oldestItem ? Math.round((Date.now() / 1000 - oldestItem.created_utc) / (60 * 60 * 24)) : 0;

  // Activity by Hour and Day
  const hourlyActivityRaw = Array.from({ length: 24 }, () => ({ posts: 0, comments: 0 }));
  const dailyActivityRaw = Array.from({ length: 7 }, () => ({ posts: 0, comments: 0 }));
  
  allItems.forEach(item => {
    const date = new Date(item.created_utc * 1000);
    const hour = date.getUTCHours();
    const day = date.getUTCDay(); // 0 = Sunday
    
    if ('title' in item) { // It's a post
      hourlyActivityRaw[hour].posts++;
      dailyActivityRaw[day].posts++;
    } else { // It's a comment
      hourlyActivityRaw[hour].comments++;
      dailyActivityRaw[day].comments++;
    }
  });

  const activityByHour = hourlyActivityRaw.map((data, i) => ({
    hour: `${i}:00`,
    ...data
  }));
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const activityByDay = dailyActivityRaw.map((data, i) => ({
    day: daysOfWeek[i],
    ...data
  }));

  const totalHourlyActivity = hourlyActivityRaw.map(h => h.posts + h.comments);
  let mostActiveHourIndex = -1, leastActiveHourIndex = -1;
  let maxActivity = -1, minActivity = Infinity;

  totalHourlyActivity.forEach((activity, i) => {
    if (activity > maxActivity) {
      maxActivity = activity;
      mostActiveHourIndex = i;
    }
    if (activity < minActivity) {
      minActivity = activity;
      leastActiveHourIndex = i;
    }
  });

  // Top Subreddits by Activity
  const subredditCounts = allItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.subreddit] = (acc[item.subreddit] || 0) + 1;
    return acc;
  }, {});
  const sortedSubreddits = Object.entries(subredditCounts)
    .sort(([, a], [, b]) => b - a);

  const topSubreddits = sortedSubreddits
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));
    
  // Top Subreddits by Comments
  const subredditCommentCounts = comments.reduce<Record<string, number>>((acc, item) => {
    acc[item.subreddit] = (acc[item.subreddit] || 0) + 1;
    return acc;
  }, {});
  const topSubredditsByComments = Object.entries(subredditCommentCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  // Top Subreddits by Comment Karma
  const subredditCommentKarma = comments.reduce<Record<string, number>>((acc, item) => {
    acc[item.subreddit] = (acc[item.subreddit] || 0) + item.score;
    return acc;
  }, {});
  const topSubredditsByCommentKarma = Object.entries(subredditCommentKarma)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, karma]) => ({ name, karma }));
    
  // Top Subreddits by Post Karma
  const subredditPostKarma = posts.reduce<Record<string, number>>((acc, item) => {
    acc[item.subreddit] = (acc[item.subreddit] || 0) + item.score;
    return acc;
  }, {});
  const topSubredditsByPostKarma = Object.entries(subredditPostKarma)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, karma]) => ({ name, karma }));

  // Subreddit Stickiness
  const top3Count = sortedSubreddits.slice(0, 3).reduce((sum, [, count]) => sum + count, 0);
  const totalActivity = allItems.length;
  const subredditStickiness = totalActivity > 0 ? [
      { name: 'Top 3 Subreddits', value: top3Count },
      { name: 'Other', value: totalActivity - top3Count },
  ] : [];


  // Karma by Subreddit
  const subredditKarma = allItems.reduce<Record<string, number>>((acc, item) => {
      acc[item.subreddit] = (acc[item.subreddit] || 0) + item.score;
      return acc;
  }, {});
  const karmaBySubreddit = Object.entries(subredditKarma)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, karma]) => ({ name, karma }));

  // Best/Worst Comments by Karma
  let bestComment: RedditComment | null = null;
  let worstComment: RedditComment | null = null;
  if (comments.length > 0) {
    const sortedComments = [...comments].sort((a, b) => b.score - a.score);
    bestComment = sortedComments[0];
    worstComment = sortedComments[sortedComments.length - 1];
  }
  
  // --- Sentiment Analysis ---
  const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
  const sentimentBySubredditRaw: Record<string, { sum: number; count: number }> = {};
  
  comments.forEach(comment => {
    const { score } = comment.sentiment;
    if (score > 0.5) sentimentCounts.positive++;
    else if (score < -0.5) sentimentCounts.negative++;
    else sentimentCounts.neutral++;

    if (!sentimentBySubredditRaw[comment.subreddit]) {
        sentimentBySubredditRaw[comment.subreddit] = { sum: 0, count: 0 };
    }
    sentimentBySubredditRaw[comment.subreddit].sum += score;
    sentimentBySubredditRaw[comment.subreddit].count++;
  });

  const sentimentBreakdown = [
      { name: 'Positive', value: sentimentCounts.positive },
      { name: 'Neutral', value: sentimentCounts.neutral },
      { name: 'Negative', value: sentimentCounts.negative },
  ];
  
  const sentimentBySubreddit = Object.entries(sentimentBySubredditRaw)
    .map(([name, data]) => ({ name, avgScore: data.count > 0 ? data.sum / data.count : 0, count: data.count }))
    .filter(item => item.count >= 5) // Only include subreddits with enough comments
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 10);
  
  let mostPositiveComment: RedditComment | null = null;
  let mostNegativeComment: RedditComment | null = null;
  if (comments.length > 0) {
      const sortedBySentiment = [...comments].sort((a, b) => b.sentiment.score - a.sentiment.score);
      mostPositiveComment = sortedBySentiment[0];
      mostNegativeComment = sortedBySentiment[sortedBySentiment.length - 1];
  }

  // Award Analysis
  const awardCounts: Record<string, { name: string; count: number; icon_url: string }> = {};
  const gildedContent: (RedditPost | RedditComment)[] = [];
  let totalAwards = 0;

  allItems.forEach(item => {
      if (item.all_awardings) {
          let hasPremiumAward = false;
          item.all_awardings.forEach(award => {
              totalAwards += award.count;
              if (awardCounts[award.name]) {
                  awardCounts[award.name].count += award.count;
              } else {
                  awardCounts[award.name] = {
                      name: award.name,
                      count: award.count,
                      icon_url: award.icon_url,
                  };
              }
              if (PREMIUM_AWARDS.has(award.name)) {
                  hasPremiumAward = true;
              }
          });
          if (hasPremiumAward) {
              gildedContent.push(item);
          }
      }
  });
  const awards = Object.values(awardCounts).sort((a, b) => b.count - a.count);


  // Flair detection
  const subredditToFlair = new Map<string, string>();
  allItems
    .sort((a, b) => b.created_utc - a.created_utc)
    .forEach(item => {
      if (item.author_flair_text && !subredditToFlair.has(item.subreddit)) {
        subredditToFlair.set(item.subreddit, item.author_flair_text);
      }
    });
  const userFlairs = Array.from(subredditToFlair, ([subreddit, text]) => ({ subreddit, text }))
    .sort((a,b) => a.subreddit.toLowerCase().localeCompare(b.subreddit.toLowerCase()));

  // Word & Language Analysis
  const wordCounts: Record<string, number> = {};
  const languageCounts: Record<string, number> = {};
  allItems.forEach(item => {
    const text = 'title' in item ? `${item.title} ${item.selftext}` : item.body;
    const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
    for (const word of words) {
      if (word && !STOP_WORDS.has(word)) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    }
    const textSample = text.substring(0, 500);
    if (textSample.trim().length > 25) {
      const langCode = franc(textSample);
      if (langCode && langCode !== 'und') {
        languageCounts[langCode] = (languageCounts[langCode] || 0) + 1;
      }
    }
  });
  const topWords = Object.entries(wordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([text, value]) => ({ text, value }));
  const topLanguages = Object.entries(languageCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([code, count]) => {
        const langInfo = getLanguageInfo(code);
        return { name: langInfo.name, flag: langInfo.flag, count };
    }).filter(lang => lang.name !== 'Unknown');

  // Comment Length Distribution
  const lengthBuckets = {
    '1-20': 0, '21-100': 0, '101-300': 0, '301-1000': 0, '1001+': 0,
  };
  comments.forEach(comment => {
      const len = comment.body.length;
      if (len >= 1 && len <= 20) lengthBuckets['1-20']++;
      else if (len >= 21 && len <= 100) lengthBuckets['21-100']++;
      else if (len >= 101 && len <= 300) lengthBuckets['101-300']++;
      else if (len >= 301 && len <= 1000) lengthBuckets['301-1000']++;
      else if (len > 1000) lengthBuckets['1001+']++;
  });
  const commentLengthDistribution = [
      { name: 'Tiny (1-20)', count: lengthBuckets['1-20'] },
      { name: 'Short (21-100)', count: lengthBuckets['21-100'] },
      { name: 'Medium (101-300)', count: lengthBuckets['101-300'] },
      { name: 'Long (301-1000)', count: lengthBuckets['301-1000'] },
      { name: 'Very Long (1001+)', count: lengthBuckets['1001+'] },
  ];
  
    // Post Type Distribution
    const postTypes = { 'Text': 0, 'Link': 0, 'Image': 0, 'Video': 0, 'Other': 0 };
    posts.forEach(post => {
        if (post.is_video || post.post_hint === 'hosted:video' || post.post_hint === 'rich:video') postTypes['Video']++;
        else if (post.post_hint === 'image') postTypes['Image']++;
        else if (post.is_self) postTypes['Text']++;
        else if (post.post_hint === 'link') postTypes['Link']++;
        else postTypes['Other']++;
    });
    const postTypeDistribution = Object.entries(postTypes)
        .map(([name, value]) => ({ name, value }))
        .filter(item => item.value > 0);


  // Time Series Analysis
  let activityOverTime: { date: string; posts: number; comments: number }[] = [];
  let scoreOverTime: { date: string; avgPostScore: number; avgCommentScore: number }[] = [];
  if (allItems.length > 0) {
    const sortedItems = [...allItems].sort((a, b) => a.created_utc - b.created_utc);
    const oldestDate = new Date(sortedItems[0].created_utc * 1000);
    const newestDate = new Date(sortedItems[sortedItems.length - 1].created_utc * 1000);
    const startDate = new Date(oldestDate.getFullYear(), oldestDate.getMonth(), oldestDate.getDate());
    const endDate = new Date(newestDate.getFullYear(), newestDate.getMonth(), newestDate.getDate());
    const activityMap: Map<string, { posts: number; comments: number }> = new Map();
    const scoreMap: Map<string, { postScoreSum: number; postCount: number; commentScoreSum: number; commentCount: number }> = new Map();
    const toDateString = (d: Date) => d.toISOString().split('T')[0];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = toDateString(d);
        activityMap.set(dateStr, { posts: 0, comments: 0 });
        scoreMap.set(dateStr, { postScoreSum: 0, postCount: 0, commentScoreSum: 0, commentCount: 0 });
    }
    posts.forEach(post => {
        const dateStr = toDateString(new Date(post.created_utc * 1000));
        if (activityMap.has(dateStr)) {
            activityMap.get(dateStr)!.posts++;
            scoreMap.get(dateStr)!.postScoreSum += post.score;
            scoreMap.get(dateStr)!.postCount++;
        }
    });
    comments.forEach(comment => {
        const dateStr = toDateString(new Date(comment.created_utc * 1000));
        if (activityMap.has(dateStr)) {
            activityMap.get(dateStr)!.comments++;
            scoreMap.get(dateStr)!.commentScoreSum += comment.score;
            scoreMap.get(dateStr)!.commentCount++;
        }
    });
    activityOverTime = Array.from(activityMap, ([date, data]) => ({ date, ...data }));
    scoreOverTime = Array.from(scoreMap, ([date, data]) => ({
        date,
        avgPostScore: data.postCount > 0 ? Math.round(data.postScoreSum / data.postCount) : 0,
        avgCommentScore: data.commentCount > 0 ? Math.round(data.commentScoreSum / data.commentCount) : 0,
    }));
  }

  // Yearly Activity Heatmap
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const oneYearAgoTimestamp = oneYearAgo.getTime() / 1000;

  const activityByDate = new Map<string, number>();
  
  allItems.forEach(item => {
      if (item.created_utc >= oneYearAgoTimestamp) {
          const date = new Date(item.created_utc * 1000);
          const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
          activityByDate.set(dateString, (activityByDate.get(dateString) || 0) + 1);
      }
  });
  
  const yearlyActivityHeatmap = Array.from(activityByDate, ([date, count]) => ({ date, count }));
  
  return {
    username,
    totalPosts,
    totalComments,
    totalKarma,
    totalPostKarma,
    totalCommentKarma,
    accountAgeDays,
    avgCommentKarma: totalComments > 0 ? Math.round(totalCommentKarma / totalComments) : 0,
    avgPostKarma: totalPosts > 0 ? Math.round(totalPostKarma / totalPosts) : 0,
    activityByHour,
    activityByDay,
    topSubreddits,
    topWords,
    topLanguages,
    mostActiveHour: mostActiveHourIndex !== -1 ? `${mostActiveHourIndex}:00 UTC` : 'N/A',
    leastActiveHour: leastActiveHourIndex !== -1 ? `${leastActiveHourIndex}:00 UTC` : 'N/A',
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
    topSubredditsByComments,
    topSubredditsByCommentKarma,
    topSubredditsByPostKarma,
    yearlyActivityHeatmap,
    sentimentBreakdown,
    sentimentBySubreddit,
    mostPositiveComment,
    mostNegativeComment,
  };
}