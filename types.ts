// types.ts

export interface RedditAward {
  name: string;
  count: number;
  icon_url: string;
  [key: string]: any; // Allow other properties from Reddit API
}

export interface RedditTrophy {
    name: string;
    icon_url: string;
    description: string | null;
}

export interface RedditComment {
  id: string;
  subreddit: string;
  body: string;
  score: number;
  created_utc: number;
  author_flair_text: string | null;
  all_awardings: RedditAward[];
  permalink: string;
  sentiment: { score: number; comparative: number }; // Added by dataProcessor
}

export interface RedditPost {
  id: string;
  subreddit: string;
  title: string;
  selftext: string;
  score: number;
  created_utc: number;
  author_flair_text: string | null;
  all_awardings: RedditAward[];
  is_self: boolean;
  is_video: boolean;
  post_hint?: string;
}

export interface RedditData {
  comments: Omit<RedditComment, 'sentiment'>[];
  posts: RedditPost[];
  trophies: RedditTrophy[];
}

// For charts
export interface NameValueData {
  name: string;
  value: number;
}

export interface StickinessData {
  category: string;
  value: number;
  subreddits: string[];
  [key: string]: any;
}


export interface ActivityData {
  posts: number;
  comments: number;
  [key: string]: any; // for xAxisKey
}

export interface TimeSeriesDataPoint {
    date: string;
    posts: number;
    comments: number;
    postKarma: number;
    commentKarma: number;
}

export interface SentimentBySubreddit {
    name: string;
    avgScore: number;
    count: number;
}

export interface WordStat {
    text: string;
    value: number; // frequency or TF-IDF score
    sentiment: number;
    context: string[];
}

// The main result object
export interface AnalysisResult {
  username: string;
  totalPosts: number;
  totalComments: number;
  totalKarma: number;
  postKarma: number;
  commentKarma: number;
  avgPostScore: number;
  avgCommentScore: number;
  dataSpansDays: number;
  mostActiveDay: string;
  mostActiveHour: string;
  activeHours: ActivityData[];
  activeDays: ActivityData[];
  activityByMonth: TimeSeriesDataPoint[];
  topSubredditsByActivity: NameValueData[];
  topSubredditsByKarma: NameValueData[];
  postTypes: NameValueData[];
  subredditStickiness: StickinessData[];
  commentLengthDistribution: { name: string; count: number }[];
  bestComment: RedditComment | null;
  worstComment: RedditComment | null;
  mostPositiveComment: RedditComment | null;
  mostNegativeComment: RedditComment | null;
  gildedContent: (RedditPost | RedditComment)[];
  totalAwards: number;
  topAwards: RedditAward[];
  userFlairs: { subreddit: string; text: string }[];
  achievements: RedditTrophy[];
  yearlyActivity: { date: string; count: number }[];
  sentimentBreakdown: NameValueData[];
  sentimentBySubreddit: SentimentBySubreddit[];
  topMentionedSubreddits: NameValueData[];
  vocabulary: {
      wordCount: number;
      uniqueWords: number;
      avgWordLength: number;
      readability: number; // Flesch-Kincaid Grade Level
      topWords: WordStat[];
  };
}