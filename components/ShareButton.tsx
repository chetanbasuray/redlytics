import React, { useState } from 'react';

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);


interface ShareButtonProps {
  username: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ username }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    // Construct the URL without any extra slashes at the end of the origin
    const shareUrl = `${window.location.origin}${window.location.pathname}?user=${encodeURIComponent(username)}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500); // Reset after 2.5 seconds
    } catch (err) {
      console.error('Failed to copy shareable URL: ', err);
      // Optional: Add user feedback for copy failure
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${
        isCopied
          ? 'bg-green-600 text-white focus:ring-green-500'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-sky-500'
      }`}
    >
      {isCopied ? <CheckIcon /> : <ShareIcon />}
      {isCopied ? 'Copied!' : 'Share Profile'}
    </button>
  );
};

export default ShareButton;