import { GoogleGenAI, Type, Modality } from '@google/genai';
import type { RedditData, AIAnalysisResult } from '../types';

export const config = {
  runtime: 'edge',
};

// Helper to create a concise text corpus from Reddit data
const createCorpus = (redditData: RedditData): string => {
    const { comments, posts } = redditData;
    return [
        ...comments.slice(0, 150).map(c => `Comment in r/${c.subreddit} (score: ${c.score}): ${c.body}`),
        ...posts.slice(0, 75).map(p => `Post in r/${p.subreddit} (score: ${p.score}): ${p.title}. ${p.selftext}`)
    ].join('\n\n---\n\n');
};


export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Allow': 'POST', 'Content-Type': 'application/json' },
    });
  }

  try {
    const { redditData } = await req.json();

    if (!redditData) {
      return new Response(JSON.stringify({ error: 'redditData is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      console.error("Neither GEMINI_API_KEY nor API_KEY is set on the server.");
      return new Response(JSON.stringify({ error: 'AI API key is not configured on the server.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const ai = new GoogleGenAI({ apiKey });
    const corpus = createCorpus(redditData as RedditData);

    // --- Step 1: Generate Textual Analysis ---
    const analysisResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze the following Reddit user data. Based ONLY on the provided text, generate a comprehensive analysis as a single JSON object.

        Here is the user's recent activity:
        ${corpus}
        `,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    personaSummary: {
                        type: Type.STRING,
                        description: "A 2-3 sentence narrative summary of the user's personality, communication style, and archetype (e.g., 'Helpful Expert', 'Witty Jokester')."
                    },
                    activitySummary: {
                        type: Type.STRING,
                        description: "A 1-2 sentence summary of the user's activity patterns. Mention posting times, frequency, or any notable habits."
                    },
                    sentimentSummary: {
                        type: Type.STRING,
                        description: "A 1-2 sentence summary of the user's overall sentiment and tone. Is it generally positive, negative, neutral, or something more nuanced?"
                    },
                    communitySummary: {
                        type: Type.STRING,
                        description: "A 1-2 sentence summary of the user's role in their top communities. Are they a core member, a casual observer, an expert?"
                    },
                    topThemes: {
                        type: Type.ARRAY,
                        description: "An array of the top 5 most prominent and recurring themes or topics in the user's content.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                theme: { type: Type.STRING, description: "A short title for the theme (e.g., 'PC Gaming')." },
                                emoji: { type: Type.STRING, description: "A single, relevant emoji for the theme." },
                                description: { type: Type.STRING, description: "A one-sentence explanation of the user's engagement with this theme." }
                            },
                            required: ["theme", "emoji", "description"]
                        }
                    },
                    avatarPrompt: {
                        type: Type.STRING,
                        description: "A creative, detailed DALL-E or Midjourney style prompt for an image that visually represents the user's persona and interests. Should be abstract and symbolic. Example: 'A philosopher-programmer contemplating a glowing syntax tree under a starlit sky, digital art, vibrant colors, thoughtful mood.'"
                    }
                },
                required: ["personaSummary", "activitySummary", "sentimentSummary", "communitySummary", "topThemes", "avatarPrompt"]
            }
        }
    });
    
    const analysisResult = JSON.parse(analysisResponse.text.trim());

    // --- Step 2: Generate Avatar Image ---
    let avatarImage = '';
    try {
        const imageResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: analysisResult.avatarPrompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const firstPart = imageResponse.candidates?.[0]?.content?.parts?.[0];
        if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
            avatarImage = firstPart.inlineData.data;
        }
    } catch (imageError: any) {
        console.error("Avatar image generation failed, returning analysis without it.", imageError);
        // If the error is a rate limit error, send a special signal to the frontend
        if (imageError?.status === 429) {
            avatarImage = 'RATE_LIMITED';
        }
        // Otherwise, we proceed with an empty string for a generic failure
    }

    const finalResult: AIAnalysisResult = { ...analysisResult, avatarImage };

    return new Response(JSON.stringify(finalResult), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in Gemini proxy:", error);
    let message = 'An unknown error occurred while generating AI analysis.';
    if (error instanceof Error) {
        message = error.message;
    }
    return new Response(JSON.stringify({ error: 'Failed to generate AI analysis', details: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}