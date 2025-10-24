import React, { useState, useMemo } from 'react';
import type { AnalysisResult, WordStat } from '../types';
import WordExplorerModal from './WordExplorerModal';

interface VocabularyAnalysisProps {
  data: AnalysisResult['vocabulary'];
}

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const VocabularyAnalysis: React.FC<VocabularyAnalysisProps> = ({ data }) => {
  const [selectedWord, setSelectedWord] = useState<WordStat | null>(null);

  const { wordCount, uniqueWords, avgWordLength, readability, topWords } = data;

  const handleWordClick = (word: WordStat) => {
    setSelectedWord(word);
  };

  const handleCloseModal = () => {
    setSelectedWord(null);
  };

  const getReadabilityInfo = (gradeLevel: number) => {
    const grade = Math.round(gradeLevel);
    if (gradeLevel <= 5) {
        return { label: 'Very Easy to Read', description: `~ Grade ${grade}`, color: 'text-green-400' };
    }
    if (gradeLevel <= 8) {
        return { label: 'Easy to Read', description: `~ Grade ${grade}`, color: 'text-sky-400' };
    }
    if (gradeLevel <= 12) {
        return { label: 'Standard', description: `~ Grade ${grade}`, color: 'text-yellow-400' };
    }
    if (gradeLevel <= 16) {
        return { label: 'Fairly Difficult', description: 'College Level', color: 'text-orange-400' };
    }
    return { label: 'Very Difficult', description: 'Post-graduate Level', color: 'text-red-400' };
  };

  const readabilityInfo = getReadabilityInfo(readability);


  const wordCloudData = useMemo(() => {
    if (!topWords || topWords.length === 0) return [];
    
    const maxFreq = Math.max(...topWords.map(w => w.value), 1);
    const minFreq = Math.min(...topWords.map(w => w.value), 1);
    
    const freqRange = maxFreq - minFreq === 0 ? 1 : maxFreq - minFreq;

    return topWords.map(word => {
        const scale = (word.value - minFreq) / freqRange;
        const fontSize = 12 + (scale * 24); 
        
        let color = 'text-sky-300'; // Neutral
        if (word.sentiment > 0.1) color = 'text-green-400';
        if (word.sentiment < -0.1) color = 'text-red-400';

        return { ...word, fontSize, color };
    }).sort(() => Math.random() - 0.5); 
  }, [topWords]);

  if (!topWords || topWords.length === 0) {
    return (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-white tracking-tight">Vocabulary Analysis</h3>
                <p className="text-gray-400 mt-1">An overview of the user's lexicon based on their comments.</p>
            </div>
            <p className="text-gray-400 text-center py-10">Not enough comment data to analyze vocabulary.</p>
        </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white tracking-tight">Vocabulary Analysis</h3>
        <p className="text-gray-400 mt-1">An overview of the user's lexicon based on their comments.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_2fr] gap-4 mb-8">
        <div className="bg-gray-800 px-3 py-4 rounded-lg shadow-lg text-center border border-gray-700">
            <p className="text-xs text-gray-400 uppercase tracking-wider truncate">Total Words</p>
            <p className="text-xl font-bold text-white truncate">{wordCount.toLocaleString()}</p>
        </div>
         <div className="bg-gray-800 px-3 py-4 rounded-lg shadow-lg text-center border border-gray-700">
            <p className="text-xs text-gray-400 uppercase tracking-wider truncate">Unique Words</p>
            <p className="text-xl font-bold text-white truncate">{uniqueWords.toLocaleString()}</p>
        </div>
         <div className="bg-gray-800 px-3 py-4 rounded-lg shadow-lg text-center border border-gray-700">
            <p className="text-xs text-gray-400 uppercase tracking-wider truncate">Avg. Word Length</p>
            <p className="text-xl font-bold text-white truncate">{avgWordLength.toFixed(2)}</p>
        </div>
        <div className="bg-gray-800 px-3 py-4 rounded-lg shadow-lg text-center border border-gray-700">
            <p className="text-xs text-gray-400 uppercase tracking-wider flex items-center justify-center">
                Text Readability
                <span className="group relative">
                    <InfoIcon />
                    <span className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform w-60 rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                        Based on the Flesch-Kincaid formula, this score estimates the US grade level required to understand the text.
                    </span>
                </span>
            </p>
            <p className={`text-xl font-bold ${readabilityInfo.color}`}>{readabilityInfo.label}</p>
            <p className="text-xs text-gray-500">{readabilityInfo.description}</p>
        </div>
      </div>

      <div className="bg-gray-900/50 p-4 rounded-lg">
         <h4 className="text-lg font-semibold text-white mb-4 text-center">Most Significant Words</h4>
         <p className="text-xs text-center text-gray-500 mb-4 -mt-3">(Sized by frequency, colored by sentiment. Click a word to explore.)</p>
         <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 min-h-[200px]">
            {wordCloudData.map(word => (
                <button
                    key={word.text}
                    onClick={() => handleWordClick(word)}
                    className={`font-bold transition-transform hover:scale-110 ${word.color} hover:!text-yellow-300`}
                    style={{ fontSize: `${word.fontSize}px`, lineHeight: 1.2 }}
                    title={`Frequency: ${word.value}`}
                >
                    {word.text}
                </button>
            ))}
         </div>
      </div>
      
      {selectedWord && (
        <WordExplorerModal word={selectedWord} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default VocabularyAnalysis;