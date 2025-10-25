import type { RedditData, RedditPost, RedditComment, RedditTrophy } from '../types';

interface ProxyConfig {
    name: string;
    baseUrl: string;
    requiresEncoding: boolean;
}

// A list of proxy services to try in order.
const PROXIES: ProxyConfig[] = [
    { name: 'CORSProxy.io', baseUrl: 'https://corsproxy.io/?', requiresEncoding: false },
    { name: 'AllOrigins', baseUrl: 'https://api.allorigins.win/raw?url=', requiresEncoding: true },
    { name: 'Self-Hosted Proxy', baseUrl: '/api/reddit-proxy?url=', requiresEncoding: true }
];

// --- Caching Logic ---
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const apiCache = new Map<string, { timestamp: number; data: RedditData }>();

/**
 * A custom error class to indicate that the operation can be retried.
 */
export class RetryableError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RetryableError';
    }
}

async function fetchFromReddit(url: string) {
    const jsonUrl = url.endsWith('.json') ? url : `${url}.json`;
    const separator = jsonUrl.includes('?') ? '&' : '?';
    const redditApiUrl = `${jsonUrl}${separator}raw_json=1`;

    let lastError: Error | null = null;

    for (const proxy of PROXIES) {
        const targetUrl = proxy.requiresEncoding ? encodeURIComponent(redditApiUrl) : redditApiUrl;
        const requestUrl = `${proxy.baseUrl}${targetUrl}`;
        
        try {
            const response = await fetch(requestUrl);

            if (!response.ok) {
                const status = response.status;
                let errorToStore: Error;

                if (status === 404) {
                    errorToStore = new Error('REDDIT_ERROR_404');
                } else if (status === 403) {
                     try {
                        const errorData = await response.json();
                        if (['private', 'banned', 'suspended'].includes(errorData.reason)) {
                            errorToStore = new Error('REDDIT_ERROR_PRIVATE');
                        } else {
                           errorToStore = new Error('REDDIT_ERROR_SERVER_BLOCK');
                        }
                    } catch (e) {
                         errorToStore = new Error('REDDIT_ERROR_SERVER_BLOCK');
                    }
                } else {
                    errorToStore = new Error(`PROXY_ERROR:${status}`);
                }
                
                lastError = errorToStore;
                continue; // Try the next proxy
            }

            // --- Success Case ---
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                lastError = new Error('MALFORMED_DATA: Content-Type is not JSON.');
                continue;
            }

            const responseText = await response.text();
            try {
                return JSON.parse(responseText); // Success! Return the data.
            } catch (error) {
                lastError = new Error(error instanceof Error ? `MALFORMED_JSON:${error.message}` : 'MALFORMED_JSON: Unknown parsing error.');
                continue; // Try next proxy
            }

        } catch (error) {
            console.warn(`Proxy failed for ${proxy.name}:`, error);
            lastError = new Error(error instanceof Error ? error.message : 'A network error occurred.');
            continue; // Try next proxy
        }
    }

    // If the loop completes, all proxies have failed. Throw the last captured error.
    if (lastError) {
        throw lastError;
    }

    throw new Error('All data fetch attempts failed. Please check your network connection.');
}


async function fetchAllPages(username: string, type: 'comments' | 'submitted') {
    let after: string | null = null;
    const allItems: any[] = [];
    const maxPages = 10; 
    const baseUrl = `https://www.reddit.com/user/${username}/${type}`;

    for (let i = 0; i < maxPages; i++) {
        let url = `${baseUrl}.json?limit=100`;
        if (after) {
            url += `&after=${after}`;
        }
        
        // This is the first request for this user. If it fails with a 404, the user doesn't exist.
        if (i === 0) {
            const data = await fetchFromReddit(url);
            if (!data?.data?.children?.length) break;
            allItems.push(...data.data.children);
            after = data.data.after;
            if (!after) break;
        } else {
            // Subsequent requests might fail for other reasons (e.g., rate limiting),
            // but we don't want to throw a "user not found" error.
            try {
                const data = await fetchFromReddit(url);
                if (!data?.data?.children?.length) break;
                allItems.push(...data.data.children);
                after = data.data.after;
                if (!after) break;
            } catch (error) {
                console.warn(`Stopping pagination for ${type} after page ${i} due to an error.`, error);
                break; // Stop paginating on any error after the first page.
            }
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
        const trophiesUrl = `https://www.reddit.com/user/${username}/trophies`;

        const [trophiesData, commentsData, postsData] = await Promise.all([
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
        console.error("Detailed error in fetchRedditData:", error);

        if (error instanceof Error) {
            // Retryable, user-friendly errors
            if (error.message.startsWith('PROXY_ERROR')) {
                const status = error.message.split(':')[1];
                throw new RetryableError(`The analysis service is temporarily unavailable (Error: ${status}). This may be a regional issue with the proxy.`);
            }
            if (error.message === 'REDDIT_ERROR_SERVER_BLOCK') {
                throw new RetryableError(`Reddit's servers are temporarily blocking analysis requests. This is common on shared networks and usually resolves on its own. Please try again in a few minutes.`);
            }
            if (error.message.startsWith('MALFORMED_DATA')) {
                 throw new RetryableError(`Failed to analyze "u/${username}" due to malformed data from Reddit. This can be a temporary issue.`);
            }
            if (error.message.toLowerCase().includes('failed to fetch') || error.message.toLowerCase().includes('a network error occurred')) {
                 throw new RetryableError('Network error: Could not connect to the analysis service. Please check your connection and any ad-blockers.');
            }

            // Non-retryable, definitive errors
            if (error.message === 'REDDIT_ERROR_404') {
                throw new Error(`User "u/${username}" was not found on Reddit.`);
            }
            if (error.message === 'REDDIT_ERROR_PRIVATE') {
                throw new Error(`The profile for "u/${username}" is private, suspended, or banned.`);
            }
            
            // Fallback for any other error
            throw new Error(error.message);
        }
        
        throw new Error(`An unknown error occurred while fetching data for "u/${username}".`);
    }
}