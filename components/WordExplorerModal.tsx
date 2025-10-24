import React from 'react';
import type { WordStat } from '../types';

interface WordExplorerModalProps {
    word: WordStat;
    onClose: () => void;
}

const WordExplorerModal: React.FC<WordExplorerModalProps> = ({ word, onClose }) => {
    
    const getSentimentLabel = (sentiment: number) => {
        if (sentiment > 0.1) return <span className="font-bold text-green-400">Positive</span>;
        if (sentiment < -0.1) return <span className="font-bold text-red-400">Negative</span>;
        return <span className="font-bold text-sky-400">Neutral</span>;
    };

    const highlightWord = (text: string, wordToHighlight: string) => {
        const parts = text.split(new RegExp(`(${wordToHighlight})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === wordToHighlight.toLowerCase() ? (
                        <strong key={i} className="text-yellow-300 bg-yellow-800/50 px-1 rounded">{part}</strong>
                    ) : (
                        part
                    )
                )}
            </span>
        );
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-fade-in"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">
                        Word Explorer: <span className="text-sky-400">"{word.text}"</span>
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">&times;</button>
                </header>
                
                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                        <div className="bg-gray-900/50 p-3 rounded-md">
                            <div className="text-sm text-gray-400">Frequency</div>
                            <div className="text-2xl font-bold text-white">{word.value.toLocaleString()} times</div>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded-md">
                            <div className="text-sm text-gray-400">Average Sentiment</div>
                            <div className="text-2xl">{getSentimentLabel(word.sentiment)}</div>
                        </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-3">Context Examples</h3>
                    <ul className="space-y-4 text-sm">
                        {word.context.map((snippet, i) => (
                            <li key={i} className="bg-gray-900/50 p-3 rounded-md border-l-4 border-gray-700">
                                <blockquote className="text-gray-300 italic">
                                    "...{highlightWord(snippet, word.text)}..."
                                </blockquote>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default WordExplorerModal;