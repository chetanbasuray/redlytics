// This is a Vercel Edge Function that acts as a CORS proxy for the Reddit API.
// It will be deployed automatically when you push to Vercel.

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new Response('Missing `url` query parameter.', { status: 400 });
  }

  try {
    // Make a request to the Reddit API from the edge function.
    // This is a server-to-server request, so no CORS issues here.
    const response = await fetch(targetUrl, {
      headers: {
        // A specific User-Agent is good practice for Reddit's API.
        'User-Agent': 'web:redlytics:v1.0 (by /u/chetann)',
      },
    });

    // Create a new response, streaming the body from the Reddit response.
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers, // Pass through original headers
    });

    // Crucially, add the CORS headers to the new response.
    // This is what allows the browser to access the data.
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return newResponse;

  } catch (error) {
    console.error('Proxy error:', error);
    return new Response('Error fetching from the Reddit API via proxy.', { status: 500 });
  }
}
