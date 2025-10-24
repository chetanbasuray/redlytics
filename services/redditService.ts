import type { RedditData, RedditPost, RedditComment, RedditTrophy } from '../types';

const BASE_URL = 'https://www.reddit.com';
const PROXY_URL = 'https://corsproxy.io/?';

// --- Caching Logic ---
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const apiCache = new Map<string, { timestamp: number; data: RedditData }>();


async function fetchFromReddit(url: string) {
    const jsonUrl = url.endsWith('.json') ? url : `${url}.json`;
    
    const separator = jsonUrl.includes('?') ? '&' : '?';
    const redditApiUrl = `${jsonUrl}${separator}raw_json=1`;

    const finalUrl = `${PROXY_URL}${redditApiUrl}`;

    const response = await fetch(finalUrl);

    if (!response.ok) {
        try {
            const errorData = await response.json();
            if (errorData.reason === 'private' || errorData.reason === 'banned' || errorData.reason === 'suspended' ) {
                 throw new Error('User not found, or their profile is private or banned.');
            }
            if (errorData.message) {
               throw new Error(`Reddit API error: ${errorData.message}`);
            }
        } catch (e) {
            // Parsing error, fall back to status-based message.
        }

        if (response.status === 404 || response.status === 403) {
            throw new Error('User not found or their profile is private.');
        }
        throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
    }

    const responseText = await response.text();
    try {
        const data = JSON.parse(responseText);
         if (data.error) {
            throw new Error(`Reddit API error: ${data.message || data.error}`);
        }
        return data;
    } catch (error) {
        console.error("Failed to parse JSON response from Reddit. This may be a temporary API issue or malformed content in a post/comment.");
        console.error("Response snippet:", responseText.substring(0, 1000) + '...');
        if (error instanceof Error) {
            throw new Error(`Malformed data from Reddit: ${error.message}`);
        }
        throw new Error('Received malformed data from Reddit. Please try again later.');
    }
}


async function fetchAllPages(username: string, type: 'comments' | 'submitted') {
    let after: string | null = null;
    const allItems: any[] = [];
    const maxPages = 10; 

    for (let i = 0; i < maxPages; i++) {
        let url = `${BASE_URL}/user/${username}/${type}.json?limit=100`;
        if (after) {
            url += `&after=${after}`;
        }
        
        try {
            const data = await fetchFromReddit(url);
            
            if (!data?.data?.children?.length) {
                break; // No more items
            }

            allItems.push(...data.data.children);
            after = data.data.after;

            if (!after) {
                break; // Reached the last page
            }
        } catch (error) {
            console.error(`Error fetching page ${i + 1} for ${type}:`, error);
            if (error instanceof Error && (error.message.includes('User not found') || error.message.includes('private'))) {
                throw error;
            }
            break;
        }
    }
    return allItems;
}

export async function fetchRedditData(username: string): Promise<RedditData> {
    const lowerCaseUsername = username.toLowerCase();
    const cachedEntry = apiCache.get(lowerCaseUsername);
    const now = Date.now();

    if (cachedEntry && (now - cachedEntry.timestamp < CACHE_DURATION_MS)) {
        console.log(`Serving cached data for u/${username}`);
        return cachedEntry.data;
    }

    try {
        const userAboutUrl = `${BASE_URL}/user/${username}/about`;
        const trophiesUrl = `${BASE_URL}/user/${username}/trophies`;

        // Fetch user data, comments, posts, and trophies concurrently
        const [aboutData, trophiesData, commentsData, postsData] = await Promise.all([
            fetchFromReddit(userAboutUrl),
            fetchFromReddit(trophiesUrl),
            fetchAllPages(username, 'comments'),
            fetchAllPages(username, 'submitted')
        ]);
        
        const comments: Omit<RedditComment, 'sentiment'>[] = commentsData
            .filter(c => c.kind === 't1' && c.data)
            .map((c: any) => ({
                id: c.data.id,
                subreddit: c.data.subreddit,
                body: c.data.body || '',
                score: c.data.score,
                created_utc: c.data.created_utc,
                author_flair_text: c.data.author_flair_text,
                all_awardings: c.data.all_awardings || [],
                permalink: c.data.permalink,
            }));

        const posts: RedditPost[] = postsData
            .filter(p => p.kind === 't3' && p.data)
            .map((p: any) => ({
                id: p.data.id,
                subreddit: p.data.subreddit,
                title: p.data.title || '',
                selftext: p.data.selftext || '',
                score: p.data.score,
                created_utc: p.data.created_utc,
                author_flair_text: p.data.author_flair_text,
                all_awardings: p.data.all_awardings || [],
                is_self: p.data.is_self,
                is_video: p.data.is_video,
                post_hint: p.data.post_hint,
            }));
            
        const trophies: RedditTrophy[] = (trophiesData?.data?.trophies || [])
            .filter((t: any) => t.kind === 't6' && t.data)
            .map((t: any) => ({
                name: t.data.name,
                icon_url: t.data.icon_70,
                description: t.data.description,
            }));

        const result: RedditData = { comments, posts, trophies };
        
        apiCache.set(lowerCaseUsername, { timestamp: now, data: result });
        console.log(`Fetched and cached new data for u/${username}`);

        return result;
    } catch (error) {
        console.error("Error fetching Reddit data:", error);
        if (error instanceof Error) {
            if (error.message.includes('User not found') || error.message.includes('private')) {
                throw new Error(`User "u/${username}" was not found or is private.`);
            }
             if (error.message.includes('Failed to fetch')) {
                throw new Error('Network error. Please check your connection and try again.');
            }
             if (error.message.includes('Malformed data')) {
                 throw new Error(`Failed to analyze "u/${username}" due to malformed data from Reddit. This can be a temporary issue.`);
            }
            throw new Error(`Failed to fetch data for "u/${username}". Reddit might be temporarily unavailable.`);
        }
        throw new Error(`An unknown error occurred while fetching data for "u/${username}".`);
    }
}