// Fix: Replaced placeholder content with a functional API proxy.
// This file acts as a serverless function to proxy requests to the Reddit API.
// This is necessary to bypass CORS restrictions in the browser and to centralize requests.
// It's designed for deployment on platforms like Vercel or Netlify.

export const config = {
  runtime: 'edge', // Specify Vercel Edge runtime for performance
};

// Array of common user agents to rotate through
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/112.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0',
];

export default async function handler(request: Request) {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const { searchParams } = new URL(request.url);
  const redditUrl = searchParams.get('url');

  if (!redditUrl) {
    return new Response(JSON.stringify({ error: 'URL parameter is missing' }), {
      status: 400,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  }

  try {
    const parsedUrl = new URL(redditUrl);

    // Security check: Only allow requests to the reddit.com domain
    if (parsedUrl.protocol !== 'https:' || !parsedUrl.hostname.endsWith('reddit.com')) {
      return new Response(JSON.stringify({ error: 'Invalid URL. Only https://*.reddit.com URLs are allowed.' }), {
        status: 400,
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
      });
    }
    
    // Pick a random User-Agent for this request
    const randomUserAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

    // Fetch from the Reddit API with more realistic, browser-like headers
    const redditResponse = await fetch(parsedUrl.toString(), {
      headers: {
        'User-Agent': randomUserAgent,
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    // Create new headers to pass back to the client, including CORS headers
    const responseHeaders = new Headers({
      'Content-Type': redditResponse.headers.get('Content-Type') || 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    // Return a new response with the body and status from the Reddit API
    return new Response(redditResponse.body, {
      status: redditResponse.status,
      statusText: redditResponse.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('Reddit proxy error:', error);
    
    let message = 'An unknown error occurred in the proxy.';
    if (error instanceof Error) {
        message = error.message;
    }

    // Return a generic 500 error to the client
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  }
}