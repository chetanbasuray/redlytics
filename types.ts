export interface RedditAward {
  name: string;
  count: number;
  icon_url: string;
}

export interface RedditComment {
  id: string;
  subreddit: string;
  body: string;
  score: number;
  created_utc: number;
  author_flair_text?: string | null;
  all_awardings?: RedditAward[];
  permalink: string;
}

export interface RedditPost {
  id: string;
  subreddit: string;
  title: string;
  selftext: string;
  score: number;
  created_utc: number;
  author_flair_text?: string | null;
  all_awardings?: RedditAward[];
}

export interface RedditData {
  comments: RedditComment[];
  posts: RedditPost[];
}

export interface AnalysisResult {
  totalPosts: number;
  totalComments: number;
  totalKarma: number;
  totalPostKarma: number;
  totalCommentKarma: number;
  accountAgeDays: number;
  avgCommentKarma: number;
  avgPostKarma: number;
  activityByHour: { hour: string; posts: number; comments: number }[];
  activityByDay: { day: string; posts: number; comments: number }[];
  topSubreddits: { name: string; count: number }[];
  topWords: { text: string; value: number }[];
  username: string;
  mostActiveHour: string;
  leastActiveHour: string;
  topLanguages: { name: string; flag: string; count: number; }[];
  userFlairs: { text: string; subreddit: string }[];
  activityOverTime: { date: string; posts: number; comments: number }[];
  scoreOverTime: { date: string; avgPostScore: number; avgCommentScore: number }[];
  karmaBySubreddit: { name: string; karma: number }[];
  commentLengthDistribution: { name: string; count: number }[];
  bestComment: RedditComment | null;
  worstComment: RedditComment | null;
  totalAwards: number;
  awards: { name: string; count: number; icon_url: string }[];
}