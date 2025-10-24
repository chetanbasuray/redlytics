// utils/dataProcessor.ts

import type {
  RedditData,
  RedditComment,
  RedditPost,
  AnalysisResult,
  ActivityData,
  TimeSeriesDataPoint,
  NameValueData,
  SentimentBySubreddit,
  WordStat,
  RedditAward,
  StickinessData,
} from '../types';
import { getSentiment } from './sentimentAnalyzer';
import { STOP_WORDS, IDF_CORPUS } from './corpus';

// Main analysis function
export function analyzeData(data: RedditData, username: string): AnalysisResult {
  // 1. Perform sentiment analysis on comments first
  const commentsWithSentiment: RedditComment[] = data.comments.map(comment => ({
    ...comment,
    sentiment: getSentiment(comment.body),
  }));

  const allContent: (RedditPost | RedditComment)[] = [...data.posts, ...commentsWithSentiment];
  if (allContent.length === 0) {
    // This case is handled in App.tsx, but as a fallback:
    throw new Error('No content available to analyze.');
  }

  // 2. Basic Stats
  const totalPosts = data.posts.length;
  const totalComments = commentsWithSentiment.length;
  const postKarma = data.posts.reduce((sum, p) => sum + p.score, 0);
  const commentKarma = commentsWithSentiment.reduce((sum, c) => sum + c.score, 0);
  const totalKarma = postKarma + commentKarma;
  const avgPostScore = totalPosts > 0 ? postKarma / totalPosts : 0;
  const avgCommentScore = totalComments > 0 ? commentKarma / totalComments : 0;

  // 3. Time-based Analysis
  const timestamps = allContent.map(item => item.created_utc * 1000).filter(t => t > 0);
  const firstActivity = Math.min(...timestamps);
  const lastActivity = Math.max(...timestamps);
  const dataSpansDays = timestamps.length > 1 ? Math.ceil((lastActivity - firstActivity) / (1000 * 60 * 60 * 24)) : 1;
  
  const activeHoursData = Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, posts: 0, comments: 0 }));
  const activeDaysData = [
    { day: 'Sun', posts: 0, comments: 0 }, { day: 'Mon', posts: 0, comments: 0 },
    { day: 'Tue', posts: 0, comments: 0 }, { day: 'Wed', posts: 0, comments: 0 },
    { day: 'Thu', posts: 0, comments: 0 }, { day: 'Fri', posts: 0, comments: 0 },
    { day: 'Sat', posts: 0, comments: 0 },
  ];
  const activityByMonthData: { [key: string]: TimeSeriesDataPoint } = {};
  const yearlyActivityData: { [key: string]: number } = {};
  const today = new Date();
  const oneYearAgo = new Date(new Date().setFullYear(today.getFullYear() - 1));

  allContent.forEach(item => {
    const date = new Date(item.created_utc * 1000);
    const hour = date.getUTCHours();
    const day = date.getUTCDay();
    const monthKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-01`;

    if ('title' in item) { // is Post
      activeHoursData[hour].posts++;
      activeDaysData[day].posts++;
    } else { // is Comment
      activeHoursData[hour].comments++;
      activeDaysData[day].comments++;
    }
    
    if (!activityByMonthData[monthKey]) {
      activityByMonthData[monthKey] = { date: monthKey, posts: 0, comments: 0, postKarma: 0, commentKarma: 0 };
    }
    if ('title' in item) {
      activityByMonthData[monthKey].posts++;
      activityByMonthData[monthKey].postKarma += item.score;
    } else {
      activityByMonthData[monthKey].comments++;
      activityByMonthData[monthKey].commentKarma += item.score;
    }
    
    if (date >= oneYearAgo) {
        const dateKey = date.toISOString().split('T')[0];
        yearlyActivityData[dateKey] = (yearlyActivityData[dateKey] || 0) + 1;
    }
  });
  
  const totalHourlyActivity = activeHoursData.map(h => h.posts + h.comments);
  const mostActiveHour = activeHoursData[totalHourlyActivity.indexOf(Math.max(...totalHourlyActivity))].hour;
  const totalDailyActivity = activeDaysData.map(d => d.posts + d.comments);
  const mostActiveDay = activeDaysData[totalDailyActivity.indexOf(Math.max(...totalDailyActivity))].day;


  // 4. Subreddit Analysis
  const subreddits: { [name: string]: { activity: number, karma: number, comments: RedditComment[] } } = {};
  allContent.forEach(item => {
    if (!subreddits[item.subreddit]) {
      subreddits[item.subreddit] = { activity: 0, karma: 0, comments: [] };
    }
    subreddits[item.subreddit].activity++;
    subreddits[item.subreddit].karma += item.score;
    if (!('title' in item)) {
        subreddits[item.subreddit].comments.push(item);
    }
  });
  
  const sortedByActivity = Object.entries(subreddits).sort((a, b) => b[1].activity - a[1].activity);
  const sortedByKarma = Object.entries(subreddits).sort((a, b) => b[1].karma - a[1].karma);

  const topSubredditsByActivity: NameValueData[] = sortedByActivity.slice(0, 10).map(([name, data]) => ({ name, value: data.activity }));
  const topSubredditsByKarma: NameValueData[] = sortedByKarma.slice(0, 10).map(([name, data]) => ({ name, value: data.karma }));
  
  const subredditStickiness: StickinessData[] = [];
  
  if (allContent.length > 0 && sortedByActivity.length > 0) {
      const top1 = sortedByActivity[0];
      let runningTotal = top1[1].activity;
      subredditStickiness.push({ category: 'Top Subreddit', value: top1[1].activity, subreddits: [top1[0]] });

      if (sortedByActivity.length > 3) {
          const top2 = sortedByActivity[1];
          const top3 = sortedByActivity[2];
          const next2Activity = top2[1].activity + top3[1].activity;
          runningTotal += next2Activity;
          if (next2Activity > 0) {
            subredditStickiness.push({ category: 'Subreddits 2-3', value: next2Activity, subreddits: [top2[0], top3[0]] });
          }
      }
      const otherActivity = allContent.length - runningTotal;
      if (otherActivity > 0) {
            subredditStickiness.push({ category: 'Other', value: otherActivity, subreddits: [] });
      }
  }


  // 5. Post & Comment Details
  const postTypesMap: {[key: string]: number} = { 'Text': 0, 'Link': 0, 'Image': 0, 'Video': 0, 'Other': 0 };
  data.posts.forEach(p => {
    if (p.is_video) postTypesMap.Video++;
    else if (p.post_hint === 'image' || /\.(jpg|jpeg|png|gif)$/i.test(p.title)) postTypesMap.Image++;
    else if (p.is_self) postTypesMap.Text++;
    else if (p.post_hint === 'link' || (!p.is_self && p.selftext === '')) postTypesMap.Link++;
    else postTypesMap.Other++;
  });
  
  const commentLengthDistribution = [
    { name: '0-25 chars', count: 0 }, { name: '26-100 chars', count: 0 },
    { name: '101-250 chars', count: 0 }, { name: '251-500 chars', count: 0 },
    { name: '501-1000 chars', count: 0 }, { name: '1000+ chars', count: 0 },
  ];
  commentsWithSentiment.forEach(c => {
    const len = c.body.length;
    if (len <= 25) commentLengthDistribution[0].count++;
    else if (len <= 100) commentLengthDistribution[1].count++;
    else if (len <= 250) commentLengthDistribution[2].count++;
    else if (len <= 500) commentLengthDistribution[3].count++;
    else if (len <= 1000) commentLengthDistribution[4].count++;
    else commentLengthDistribution[5].count++;
  });

  const bestComment = totalComments > 0 ? commentsWithSentiment.reduce((max, c) => c.score > max.score ? c : max) : null;
  const worstComment = totalComments > 0 ? commentsWithSentiment.reduce((min, c) => c.score < min.score ? c : min) : null;
  
  // 6. Awards & Flairs
  const gildedContent = allContent.filter(item => item.all_awardings.length > 0 && item.all_awardings.some(a => a.name === 'Gold' || a.name === 'Platinum' || a.name.includes('Gold') || a.name.includes('Platinum'))).sort((a,b) => b.score - a.score);
  const allAwards = allContent.flatMap(item => item.all_awardings);
  const totalAwards = allAwards.reduce((sum, award) => sum + award.count, 0);
  const awardsMap: { [name: string]: RedditAward } = {};
  allAwards.forEach(award => {
    if (!awardsMap[award.name]) {
      awardsMap[award.name] = { ...award, count: 0 };
    }
    awardsMap[award.name].count += award.count;
  });
  const topAwards = Object.values(awardsMap).sort((a, b) => b.count - a.count).slice(0, 10);
  
  const flairsMap: { [key: string]: string } = {};
  allContent.forEach(item => {
    if (item.author_flair_text) {
      flairsMap[`${item.subreddit}::${item.author_flair_text}`] = item.subreddit;
    }
  });
  const userFlairs = Object.keys(flairsMap).map(key => {
    const [subreddit, text] = key.split('::');
    return { subreddit, text };
  }).slice(0, 10);

  // 7. Sentiment Analysis Details
  const sentimentBreakdown = { positive: 0, neutral: 0, negative: 0 };
  commentsWithSentiment.forEach(c => {
    if (c.sentiment.comparative > 0.05) sentimentBreakdown.positive++;
    else if (c.sentiment.comparative < -0.05) sentimentBreakdown.negative++;
    else sentimentBreakdown.neutral++;
  });

  const commentsWithSentimentData = commentsWithSentiment.filter(c => c.sentiment.score !== 0);
  const mostPositiveComment = commentsWithSentimentData.length > 0 ? [...commentsWithSentimentData].sort((a, b) => b.sentiment.comparative - a.sentiment.comparative)[0] : null;
  const mostNegativeComment = commentsWithSentimentData.length > 0 ? [...commentsWithSentimentData].sort((a, b) => a.sentiment.comparative - b.sentiment.comparative)[0] : null;


  const sentimentBySubreddit: SentimentBySubreddit[] = Object.entries(subreddits)
    .filter(([, data]) => data.comments.length >= 3)
    .map(([name, data]) => {
        const totalScore = data.comments.reduce((sum, c) => sum + c.sentiment.comparative, 0);
        return { name, avgScore: totalScore / data.comments.length, count: data.comments.length };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
    
  const mentionedSubreddits: { [name: string]: number } = {};
  const mentionRegex = /\br\/([a-zA-Z0-9_]{3,21})\b/g;
  commentsWithSentiment.forEach(comment => {
      const matches = comment.body.match(mentionRegex);
      if (matches) {
          matches.forEach(match => {
              const subName = match.substring(2);
              if (subName.toLowerCase() !== username.toLowerCase()) {
                mentionedSubreddits[subName] = (mentionedSubreddits[subName] || 0) + 1;
              }
          });
      }
  });
  const topMentionedSubreddits = Object.entries(mentionedSubreddits)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));


  // 8. Vocabulary Analysis
  const vocabulary = analyzeVocabulary(commentsWithSentiment);

  // 9. Assemble final result
  return {
    username,
    totalPosts,
    totalComments,
    totalKarma,
    postKarma,
    commentKarma,
    avgPostScore,
    avgCommentScore,
    dataSpansDays,
    mostActiveDay,
    mostActiveHour,
    activeHours: activeHoursData,
    activeDays: activeDaysData,
    activityByMonth: Object.values(activityByMonthData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    topSubredditsByActivity,
    topSubredditsByKarma,
    postTypes: Object.entries(postTypesMap).map(([name, value]) => ({ name, value })).filter(item => item.value > 0),
    subredditStickiness,
    commentLengthDistribution,
    bestComment,
    worstComment,
    mostPositiveComment,
    mostNegativeComment,
    gildedContent,
    totalAwards,
    topAwards,
    userFlairs,
    achievements: data.trophies,
    yearlyActivity: Object.entries(yearlyActivityData).map(([date, count]) => ({ date, count })),
    sentimentBreakdown: [
        { name: 'Positive', value: sentimentBreakdown.positive },
        { name: 'Neutral', value: sentimentBreakdown.neutral },
        { name: 'Negative', value: sentimentBreakdown.negative },
    ],
    sentimentBySubreddit,
    topMentionedSubreddits,
    vocabulary,
  };
}

function analyzeVocabulary(comments: RedditComment[]): AnalysisResult['vocabulary'] {
    if (!comments || comments.length === 0) {
        return { wordCount: 0, uniqueWords: 0, avgWordLength: 0, readability: 0, topWords: [] };
    }
    
    let totalText = comments.map(c => c.body).join(' ');
    
    const words: string[] = totalText.toLowerCase().match(/\b[a-z']+\b/g) || [];
    if (words.length === 0) {
        return { wordCount: 0, uniqueWords: 0, avgWordLength: 0, readability: 0, topWords: [] };
    }

    const wordCount = words.length;
    const uniqueWords = new Set(words).size;
    const avgWordLength = words.reduce((sum: number, w: string) => sum + w.length, 0) / wordCount;

    const sentences = totalText.match(/[^.!?]+[.!?]+/g) || [];
    const sentenceCount = sentences.length > 0 ? sentences.length : 1;
    
    const syllableCount = words.reduce((sum: number, word: string) => {
        if (!word) return sum;
        word = word.toLowerCase();
        if(word.length <= 3) return sum + 1;
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        const matches = word.match(/[aeiouy]{1,2}/g);
        return sum + (matches ? matches.length : 1);
    }, 0);

    const gradeLevel = 0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59;

    const wordFreq: { [key: string]: number } = {};
    for (const comment of comments) {
        const commentWords = new Set(comment.body.toLowerCase().match(/\b[a-z']+\b/g) || []);
        for (const word of commentWords) {
             if (word.length > 2 && !STOP_WORDS.has(word)) {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
             }
        }
    }

    const topWordsPreSort: (WordStat & { score: number })[] = Object.entries(wordFreq)
        .map(([text, docFreq]) => {
            const tf = docFreq / comments.length;
            const idf = IDF_CORPUS[text] || Math.log(comments.length / docFreq); 
            const score = tf * idf;
            return { text, value: docFreq, score, sentiment: 0, context: [] };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 50);

    const topWords: WordStat[] = topWordsPreSort.map(topWord => {
        const contexts: string[] = [];
        let totalSentiment = 0;
        let sentimentCount = 0;

        for (const comment of comments) {
            if (contexts.length < 5 && comment.body.toLowerCase().includes(topWord.text)) {
                const regex = new RegExp(`.{0,50}${topWord.text}.{0,50}`, 'i');
                const match = comment.body.match(regex);
                if (match) {
                    contexts.push(match[0]);
                }
            }
            if (comment.body.toLowerCase().includes(topWord.text)) {
                totalSentiment += comment.sentiment.comparative;
                sentimentCount++;
            }
        }
        
        return {
            text: topWord.text,
            value: topWord.value,
            sentiment: sentimentCount > 0 ? totalSentiment / sentimentCount : 0,
            context: contexts,
        };
    });

    return {
        wordCount,
        uniqueWords,
        avgWordLength,
        readability: gradeLevel < 0 ? 0 : gradeLevel,
        topWords,
    };
}