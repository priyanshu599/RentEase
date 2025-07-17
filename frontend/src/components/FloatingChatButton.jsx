// src/components/FloatingChatButton.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const FloatingChatButton = () => {
  return (
    <Link
      to="/inbox"
      className="fixed bottom-5 left-5 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/60 hover:bg-indigo-700 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      aria-label="Open Inbox"
    >
      {/* Chat Icon SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    </Link>
  );
};

export default FloatingChatButton;
