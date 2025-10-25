import React, { useState, useMemo } from 'react';
import type { AnalysisResult, WordStat } from '../types';
import WordExplorerModal from './WordExplorerModal';
// FIX: Imported the StatCard component, which was being used without being imported.
import StatCard from './StatCard';

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
             <h3 className="text-lg font-semibold text-white mb-4">Lexical Analysis</h3>
            <p className="text-gray-400 text-center py-10">Not enough comment data to analyze vocabulary.</p>
        </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Lexical Analysis</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Words" value={wordCount.toLocaleString()} />
        <StatCard title="Unique Words" value={uniqueWords.toLocaleString()} />
        <StatCard title="Avg. Word Length" value={avgWordLength.toFixed(2)} />
       
        <div className="bg-gray-800/50 px-3 py-4 rounded-lg shadow-inner text-center border border-gray-700">
            <p className="text-xs text-gray-400 uppercase tracking-wider flex items-center justify-center">
                Readability
                <span className="group relative">
                    <InfoIcon />
                    <span className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform w-60 rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                        Based on the Flesch-Kincaid formula, this estimates the US grade level required to understand the text.
                    </span>
                </span>
            </p>
            <p className={`text-lg font-bold ${readabilityInfo.color}`}>{readabilityInfo.label}</p>
            <p className="text-xs text-gray-500">{readabilityInfo.description}</p>
        </div>
      </div>

      <div className="bg-gray-900/50 p-4 rounded-lg">
         <h4 className="font-semibold text-white mb-4 text-center">Most Significant Words</h4>
         <p className="text-xs text-center text-gray-500 mb-4 -mt-3">(Sized by frequency, colored by sentiment. Click to explore.)</p>
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