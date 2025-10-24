import React, { useState, useCallback } from 'react';
import { fetchRedditData } from './services/redditService';
import { analyzeData } from './utils/dataProcessor';
import type { AnalysisResult } from './types';
import UserInput from './components/UserInput';
import Dashboard from './components/Dashboard';
import Loader from './components/Loader';
import LogoIcon from './components/LogoIcon';

function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');

  const handleAnalyze = useCallback(async (user: string) => {
    if (!user) {
      setError("Please enter a username.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setUsername(user);

    try {
      const redditData = await fetchRedditData(user);
      if (redditData.posts.length === 0 && redditData.comments.length === 0) {
          setError(`User "u/${user}" found, but they have no recent public posts or comments to analyze.`);
          setIsLoading(false);
          return;
      }
      const results = analyzeData(redditData, user);
      setAnalysisResult(results);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);
  

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="flex items-center justify-center sm:justify-start mb-6">
          <LogoIcon className="h-8 w-8 mr-2 text-sky-500" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Redlytics
          </h1>
        </header>
        <p className="text-center sm:text-left text-gray-400 mb-8">
          Enter a Reddit username to generate a detailed analysis of their recent public activity (up to 1000 posts and 1000 comments).
        </p>

        <section className="mb-10">
          <UserInput onAnalyze={handleAnalyze} isLoading={isLoading} />
        </section>

        <section>
          {isLoading && <Loader />}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {analysisResult && <Dashboard result={analysisResult} />}
        </section>
      </main>
      <footer className="text-center text-gray-500 mt-16 py-8 border-t border-gray-800 text-sm">
          <div className="max-w-xl mx-auto">
            <p className="font-bold text-gray-300 text-base mb-2">Redlytics</p>
            <p className="mb-4">
              An analytics tool for exploring public Reddit user data. Not affiliated with Reddit Inc.
            </p>
            <div className="flex justify-center items-center gap-4 text-xs sm:text-sm">
                <a href="https://www.buymeacoffee.com/donatetochetan" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline transition-colors">
                    Support the Project
                </a>
                <span className="text-gray-600">|</span>
                <a href="https://www.reddit.com/dev/api/" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline transition-colors">
                    Reddit API Docs
                </a>
            </div>
          </div>
      </footer>
    </div>
  );
}

export default App;