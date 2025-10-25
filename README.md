# Redlytics - AI-Powered Reddit User Analyzer

Redlytics is a web tool that transforms a public Reddit user's recent activity into a comprehensive, AI-driven analytical suite. It goes beyond simple stats by using Google's Gemini AI to generate a deep, narrative understanding of the user's persona, interests, and community engagement.

**Live Demo:** [https://redlytics.vercel.app/](https://redlytics.vercel.app/)

## Features

- **AI Persona & Avatar Generation:** At the top of each report, the AI generates a descriptive persona summarizing the user's communication style and archetype, complete with a unique, AI-generated avatar that visually represents their profile.
- **AI Narrative Summaries:** Every major section of the dashboard is introduced with a concise, AI-written summary that turns raw data into an understandable story, covering:
  - Activity patterns and potential daily habits.
  - Overall sentiment, tone, and content focus.
  - The user's role and standing within their top communities.
- **AI Thematic Analysis:** The AI identifies and describes the top 5 recurring themes in the user's posts and comments, providing a clear picture of what they're passionate about.
- **Comprehensive Statistical Analysis:** All AI insights are backed by detailed charts and statistics, including:
  - Activity heatmaps by hour and day.
  - Karma breakdowns and top subreddit analysis.
  - Sentiment distribution and vocabulary deep-dives.
  - Highlights of best/worst/gilded content, awards, and trophies.

---

## Setup & Configuration

To enable the powerful AI analysis features, you need to provide a Google Gemini API key. The rest of the statistical analysis will work without it, but the AI-generated content will be missing.

### 1. Get a Gemini API Key

Getting a key is free and straightforward.

1. **Go to Google AI Studio:** Visit [**https://aistudio.google.com/**](https://aistudio.google.com/). You'll need to sign in with your Google account.
2. **Get API key:** Click on the **"Get API key"** button (usually on the bottom left).
3. **Create API Key:** In the menu that appears, click **"Create API key in new project"**.
4. **Copy the Key:** A long string of letters and numbers will be generated. Copy this key to your clipboard.
5. **Payment for API Key:** Most AI stuff will work with the free version, however the avatar generaion needs a paid API access.

### 2. Configure the API Key

How you configure the key depends on where you are running the application. The application will look for the environment variable named `GEMINI_API_KEY` first, and will also fall back to `API_KEY` if the first is not found. We recommend using the more specific name.

#### For Local Development

The project includes a template file named `.env.local.example`.

1. **Create a new file:** Create a file in the project's root directory named `.env.local`.
2. **Add your key:** Open the new `.env.local` file and paste the API key you copied from Google AI Studio.

    ```env
    # Recommended name for the API key
    GEMINI_API_KEY="PASTE_YOUR_GEMINI_API_KEY_HERE"
    ```

3. **Run the app:** Your local development server will now automatically load this key.

#### For Deployment (Vercel, Netlify, etc.)

You should **never** commit your `.env.local` file to Git. Instead, you must set the API key in your hosting provider's dashboard.

1. Go to your project's settings on Vercel (or your chosen platform).
2. Find the **"Environment Variables"** or **"Secrets"** section.
3. Create a new variable with the **Name** `GEMINI_API_KEY`.
4. For the **Value**, paste the key you got from Google AI Studio.
5. Save and redeploy your project. The deployed application will now have secure access to the key.

---

## Privacy

- **No Data Storage:** Redlytics does not store, save, or log any user data. All analysis is done on-the-fly and is discarded when you leave the page.
- **Open Source:** The project is fully open source. You are encouraged to inspect the code and contribute.
