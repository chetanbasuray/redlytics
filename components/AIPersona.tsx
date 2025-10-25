import React from 'react';

interface AIPersonaProps {
  summary: string;
  image: string; // base64 encoded image, or special 'RATE_LIMITED' string
}

const AIPersona: React.FC<AIPersonaProps> = ({ summary, image }) => {

  const renderAvatarContent = () => {
    if (image === 'RATE_LIMITED') {
      return (
        <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-700 flex items-center justify-center text-center p-4 shadow-lg border-4 border-gray-600">
          <div>
            <p className="text-sm font-semibold text-yellow-300 mb-1">Avatar Paused</p>
            <p className="text-xs text-gray-400">Generation is temporarily unavailable due to high demand. Please try again later.</p>
          </div>
        </div>
      );
    }

    if (image) {
      return (
        <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-700 overflow-hidden shadow-lg border-4 border-gray-600">
          <img 
            src={`data:image/png;base64,${image}`} 
            alt="AI generated user avatar"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    // Default placeholder for other failures (e.g., empty string)
    return (
      <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-700 flex items-center justify-center shadow-lg border-4 border-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  };

  return (
    <section className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {renderAvatarContent()}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-white mb-2">AI Persona Analysis</h2>
          <p className="text-gray-300 leading-relaxed">
            {summary}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AIPersona;