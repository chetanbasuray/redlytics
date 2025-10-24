import React from 'react';

interface WordCloudProps {
  title: string;
  words: { text: string; value: number }[];
}

// Simple hash for deterministic "randomness"
const getDeterministicRotation = (text: string) => {
    let hash = 0;
    if (text.length === 0) return hash;
    for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    // Only apply rotation to about 2/3 of words to avoid looking too chaotic
    if (Math.abs(hash % 3) > 0) {
        return (hash % 15) - 7.5; // -7.5 to 7.5 degrees
    }
    return 0;
};


const WordCloud: React.FC<WordCloudProps> = ({ title, words }) => {
  if (words.length === 0) {
    return (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col items-center justify-center h-full min-h-[300px]">
            <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
            <p className="text-gray-400">Not enough data to generate word cloud.</p>
        </div>
    );
  }

  const minSize = 14; // min font size in px
  const maxSize = 52; // max font size in px

  const values = words.map(w => w.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  
  // Use a sqrt scale for more visual contrast
  const getFontSize = (value: number) => {
    if (maxValue === minValue) return minSize;
    const ratio = (value - minValue) / (maxValue - minValue);
    const size = minSize + Math.sqrt(ratio) * (maxSize - minSize);
    return Math.round(size);
  };
  
  // Create a color hierarchy for better readability
  const getColor = (value: number, rank: number) => {
      if (rank < 3) return 'text-sky-400'; // Top 3 words
      if (rank < 8) return 'text-sky-300'; // Next 5
      const ratio = (value - minValue) / (maxValue - minValue);
      if (ratio > 0.5) return 'text-gray-200';
      return 'text-gray-300'; // Formerly gray-400, increased contrast
  }

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 h-full min-h-[300px]">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        {words.map((word, index) => (
          <span
            key={word.text}
            style={{
              fontSize: `${getFontSize(word.value)}px`,
              transform: `rotate(${getDeterministicRotation(word.text)}deg)`,
              lineHeight: '1',
              display: 'inline-block'
            }}
            className={`font-bold transition-all duration-300 hover:scale-110 hover:!text-white hover:!rotate-0 cursor-default ${getColor(word.value, index)}`}
            title={`Used ${word.value} times`}
          >
            {word.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WordCloud;