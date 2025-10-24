import { getSentiment } from './sentimentAnalyzer';
import { STOP_WORDS, IDF_CORPUS } from './corpus';
import type {
  RedditData,
  AnalysisResult,
  RedditComment,
  RedditPost,
  WordStat,
  SentimentBySubreddit,
} from '../types';

// --- Helper Functions ---

/**
 * Counts syllables in a word using a heuristic approach.
 */
function countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
}

/**
 * Calculates the Flesch-Kincaid grade level for a given text.
 */
function calculateReadability(
    wordCount: number,
    sentenceCount: number,
    syllableCount: number
): number {
    if (wordCount === 0 || sentenceCount === 0) return 0;
    return (
        0.39 * (wordCount / sentenceCount) +
        11.8 * (syllableCount / wordCount) -
        15.59
    );
}


/**
 * Tokenizes text, removes stop words, and returns a clean array of words.
 */
function getCleanWords(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^a-z\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

// --- Main Analysis Function ---

export function analyzeData(
  data: RedditData,
  username: string
): AnalysisResult {
    const { posts, comments: rawComments, trophies } = data;

    // --- Comment Processing ---
    const comments: RedditComment[] = rawComments.map(c => ({
        ...c,
        sentiment: getSentiment(c.body),
    }));

    let bestComment: RedditComment | null = null;
    let worstComment: RedditComment | null = null;
    let mostPositiveComment: RedditComment | null = null;
    let mostNegativeComment: RedditComment | null = null;

    if (comments.length > 0) {
        bestComment = comments.reduce((prev, curr) => (prev.score > curr.score ? prev : curr));
        worstComment = comments.reduce((prev, curr) => (prev.score < curr.score ? prev : curr));
        mostPositiveComment = comments.reduce((prev, curr) =>
            prev.sentiment.comparative > curr.sentiment.comparative ? prev : curr
        );
        mostNegativeComment = comments.reduce((prev, curr) =>
            prev.sentiment.comparative < curr.sentiment.comparative ? prev : curr
        );
    }

    // --- Aggregations & Stats ---
    const activityBySubreddit: Record<string, { posts: number; comments: number; karma: number }> = {};

    const processItem = (item: RedditPost | RedditComment) => {
        const subreddit = item.subreddit;
        if (!activityBySubreddit[subreddit]) {
            activityBySubreddit[subreddit] = { posts: 0, comments: 0, karma: 0 };
        }
        activityBySubreddit[subreddit].karma += item.score;
        'title' in item ? activityBySubreddit[subreddit].posts++ : activityBySubreddit[subreddit].comments++;
    };

    posts.forEach(processItem);
    comments.forEach(processItem);

    const allActivity = [...posts, ...comments];
    const yearlyActivityMap = new Map<string, number>();

    allActivity.forEach(item => {
        const date = new Date(item.created_utc * 1000).toISOString().split('T')[0];
        yearlyActivityMap.set(date, (yearlyActivityMap.get(date) || 0) + 1);
    });

    // --- Time-based Analysis ---
    const activityByHour = Array(24).fill(0).map((_, i) => ({ hour: `${i}`, posts: 0, comments: 0 }));
    const activityByDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => ({ day, posts: 0, comments: 0 }));
    
    const activityOverTimeMap = new Map<string, { posts: number, comments: number }>();

    allActivity.forEach(item => {
        const date = new Date(item.created_utc * 1000);
        const hour = date.getUTCHours();
        const day = date.getUTCDay();
        const dateString = date.toISOString().split('T')[0];

        if (!activityOverTimeMap.has(dateString)) {
            activityOverTimeMap.set(dateString, { posts: 0, comments: 0 });
        }

        if ('title' in item) {
            activityByHour[hour].posts++;
            activityByDay[day].posts++;
            activityOverTimeMap.get(dateString)!.posts++;
        } else {
            activityByHour[hour].comments++;
            activityByDay[day].comments++;
            activityOverTimeMap.get(dateString)!.comments++;
        }
    });
    
    const activityOverTime = Array.from(activityOverTimeMap.entries())
        .map(([date, counts]) => ({ date, ...counts }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


    // --- Vocabulary Analysis ---
    let wordCount = 0;
    let totalSyllables = 0;
    let totalSentences = 0;
    let totalWordLength = 0;
    const wordFreq = new Map<string, { count: number, sentiment: number[], context: string[] }>();
    
    comments.forEach(comment => {
        const sentences = comment.body.match(/[^.!?]+[.!?]+/g) || [comment.body];
        totalSentences += sentences.length;

        const words = comment.body.split(/\s+/).filter(w => w.length > 0);
        wordCount += words.length;

        words.forEach(word => {
            totalSyllables += countSyllables(word);
            totalWordLength += word.length;
        });

        const cleanWords = getCleanWords(comment.body);
        cleanWords.forEach(word => {
            if (!wordFreq.has(word)) {
                wordFreq.set(word, { count: 0, sentiment: [], context: [] });
            }
            const stat = wordFreq.get(word)!;
            stat.count++;
            stat.sentiment.push(comment.sentiment.comparative);
            if (stat.context.length < 5 && !stat.context.includes(comment.body)) {
                 stat.context.push(comment.body);
            }
        });
    });

    const topWords: WordStat[] = Array.from(wordFreq.entries())
        .map(([text, data]) => {
            const tf = wordCount > 0 ? data.count / wordCount : 0;
            const idf = IDF_CORPUS[text] || Math.log((comments.length || 1) / (data.count + 1)) + 1;
            const sentimentScore = data.sentiment.length > 0 ? data.sentiment.reduce((a, b) => a + b, 0) / data.sentiment.length : 0;
            return {
                text,
                value: tf * idf, // TF-IDF score
                sentiment: sentimentScore,
                context: data.context,
                freq: data.count,
            };
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, 50)
        .map(w => ({ ...w, value: w.freq })); // Change value to frequency for display

    // --- Final Assembly ---
    const postKarma = posts.reduce((sum, p) => sum + p.score, 0);
    const commentKarma = comments.reduce((sum, c) => sum + c.score, 0);
    
    const gildedContent = allActivity
        .filter(item => item.all_awardings && item.all_awardings.some(a => ['Gold Award', 'Platinum Award'].includes(a.name) || a.count > 0))
        .sort((a, b) => b.score - a.score);

    const awardsReceived = allActivity
        .flatMap(item => item.all_awardings || [])
        .reduce((acc, award) => {
            const existing = acc.find(a => a.name === award.name);
            if (existing) {
                existing.count += award.count;
            } else {
                acc.push({ ...award });
            }
            return acc;
        }, [] as any[])
        .sort((a, b) => b.count - a.count);
        
    const topSubredditsByActivity = Object.entries(activityBySubreddit)
        .map(([name, data]) => ({ name, value: data.posts + data.comments }))
        .sort((a, b) => b.value - a.value).slice(0, 10);
        
    const topSubredditsByKarma = Object.entries(activityBySubreddit)
        .map(([name, data]) => ({ name, karma: data.karma }))
        .sort((a, b) => b.karma - a.karma).slice(0, 10);

    // Subreddit Stickiness (Refactored Logic)
    const totalActivityInTopSubs = topSubredditsByActivity.reduce((sum, s) => sum + s.value, 0);
    const top1 = topSubredditsByActivity.slice(0, 1);
    const top2to3 = topSubredditsByActivity.slice(1, 3);
    const otherValue = allActivity.length - top1.reduce((s, i) => s + i.value, 0) - top2to3.reduce((s, i) => s + i.value, 0);

    const subredditStickiness = [
        { category: 'Top Subreddit', value: top1.reduce((s, i) => s + i.value, 0), subreddits: top1.map(s => s.name) },
        { category: 'Subreddits 2-3', value: top2to3.reduce((s, i) => s + i.value, 0), subreddits: top2to3.map(s => s.name) },
        { category: 'Other', value: otherValue, subreddits: [] },
    ].filter(d => d.value > 0);

    // Sentiment
    const sentimentDistribution = [
        { name: 'Positive', value: comments.filter(c => c.sentiment.comparative > 0.05).length },
        { name: 'Neutral', value: comments.filter(c => c.sentiment.comparative >= -0.05 && c.sentiment.comparative <= 0.05).length },
        { name: 'Negative', value: comments.filter(c => c.sentiment.comparative < -0.05).length },
    ];
    
    const sentimentBySubreddit = Object.entries(
        comments.reduce((acc, comment) => {
            if (!acc[comment.subreddit]) {
                acc[comment.subreddit] = { scores: [], count: 0 };
            }
            acc[comment.subreddit].scores.push(comment.sentiment.comparative);
            acc[comment.subreddit].count++;
            return acc;
        }, {} as Record<string, { scores: number[]; count: number }>)
    )
    .map(([name, data]) => ({
        name,
        avgScore: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
        count: data.count,
    }))
    .filter(s => s.count > 2) // Min 3 comments
    .sort((a, b) => Math.abs(b.avgScore) - Math.abs(a.avgScore))
    .slice(0, 10);

    return {
        username,
        totalPosts: posts.length,
        totalComments: comments.length,
        postKarma,
        commentKarma,
        avgPostScore: posts.length ? postKarma / posts.length : 0,
        avgCommentScore: comments.length ? commentKarma / comments.length : 0,
        topSubredditsByActivity,
        topSubredditsByKarma,
        activityByHour,
        activityByDay,
        activityOverTime,
        yearlyActivity: Array.from(yearlyActivityMap.entries()).map(([date, count]) => ({ date, count })),
        bestComment,
        worstComment,
        mostPositiveComment,
        mostNegativeComment,
        gildedContent,
        postTypes: [
            { name: 'Text Posts', value: posts.filter(p => p.is_self).length },
            { name: 'Link Posts', value: posts.filter(p => !p.is_self && !p.is_video && p.post_hint === 'link').length },
            { name: 'Image Posts', value: posts.filter(p => !p.is_self && p.post_hint === 'image').length },
            { name: 'Video Posts', value: posts.filter(p => p.is_video).length },
            { name: 'Other', value: posts.filter(p => !p.is_self && !p.is_video && !['link', 'image'].includes(p.post_hint || '')).length }
        ].filter(p => p.value > 0),
        userFlairs: [...posts, ...comments]
            .filter(item => item.author_flair_text)
            .reduce((acc, item) => {
                if (!acc.some(f => f.subreddit === item.subreddit && f.text === item.author_flair_text)) {
                    acc.push({ subreddit: item.subreddit, text: item.author_flair_text! });
                }
                return acc;
            }, [] as { subreddit: string; text: string }[]).slice(0, 10),
        subredditStickiness,
        awardsReceived,
        trophies,
        sentimentDistribution,
        sentimentBySubreddit,
        vocabulary: {
            wordCount,
            uniqueWords: wordFreq.size,
            avgWordLength: wordCount > 0 ? totalWordLength / wordCount : 0,
            readability: calculateReadability(wordCount, totalSentences, totalSyllables),
            topWords,
        },
        commentLengthDistribution: [
            { name: '0-50', count: comments.filter(c => c.body.length <= 50).length },
            { name: '51-150', count: comments.filter(c => c.body.length > 50 && c.body.length <= 150).length },
            { name: '151-300', count: comments.filter(c => c.body.length > 150 && c.body.length <= 300).length },
            { name: '301-500', count: comments.filter(c => c.body.length > 300 && c.body.length <= 500).length },
            { name: '500+', count: comments.filter(c => c.body.length > 500).length },
        ]
    };
}