// --- Raw data from Reddit API ---

export interface RedditAward {
  name: string;
  count: number;
  icon_url: string;
  id: string; // Add id for gilded content uniqueness
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
  sentiment: { score: number; comparative: number };
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

export interface RedditTrophy {
  name: string;
  icon_url: string;
  description: string | null;
}

// The shape of data fetched and cached from Reddit.
export interface RedditData {
  comments: Omit<RedditComment, 'sentiment'>[];
  posts: RedditPost[];
  trophies: RedditTrophy[];
}

// --- Processed data for dashboard ---

export interface WordStat {
  text: string;
  value: number; // Represents frequency or TF-IDF score
  sentiment: number;
  context: string[];
}

export interface StickinessData {
  category: string;
  value: number;
  subreddits: string[];
}

export interface SentimentBySubreddit {
  name: string;
  avgScore: number;
  count: number;
}

export interface AnalysisResult {
  username: string;

  // Overview Stats
  totalPosts: number;
  totalComments: number;
  postKarma: number;
  commentKarma: number;
  avgPostScore: number;
  avgCommentScore: number;
  
  // Activity Analysis
  activityByHour: { hour: string; posts: number; comments: number }[];
  activityByDay: { day: string; posts: number; comments: number }[];
  activityOverTime: { date: string; posts: number; comments: number }[];
  yearlyActivity: { date: string; count: number }[];
  
  // Content Highlights
  bestComment: RedditComment | null;
  worstComment: RedditComment | null;
  mostPositiveComment: RedditComment | null;
  mostNegativeComment: RedditComment | null;
  gildedContent: (RedditPost | RedditComment)[];
  
  // Community Interaction
  topSubredditsByActivity: { name: string; value: number }[];
  topSubredditsByKarma: { name: string; karma: number }[];
  subredditStickiness: StickinessData[];
  userFlairs: { subreddit: string; text: string }[];
  
  // Post Analysis
  postTypes: { name: string; value: number }[];
  
  // Comment Analysis
  commentLengthDistribution: { name: string; count: number }[];
  
  // Sentiment Analysis
  sentimentDistribution: { name: string; value: number }[];
  sentimentBySubreddit: SentimentBySubreddit[];

  // Vocabulary Analysis
  vocabulary: {
    wordCount: number;
    uniqueWords: number;
    avgWordLength: number;
    readability: number;
    topWords: WordStat[];
  };
  
  // Awards & Trophies
  awardsReceived: RedditAward[];
  trophies: RedditTrophy[];
}
