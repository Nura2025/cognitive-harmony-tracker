
import React from 'react';

interface AppLogoProps {
  className?: string;
}

const AppLogo = ({ className = "" }: AppLogoProps) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="w-16 h-16 bg-[#5EF38C]/20 rounded-xl flex items-center justify-center mb-4">
        <svg 
          className="w-10 h-10 text-[#5EF38C]" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 15C8.55 15 9 14.55 9 14C9 13.45 8.55 13 8 13C7.45 13 7 13.45 7 14C7 14.55 7.45 15 8 15Z"
            fill="currentColor"
          />
          <path
            d="M12 15C12.55 15 13 14.55 13 14C13 13.45 12.55 13 12 13C11.45 13 11 13.45 11 14C11 14.55 11.45 15 12 15Z"
            fill="currentColor"
          />
          <path
            d="M16 15C16.55 15 17 14.55 17 14C17 13.45 16.55 13 16 13C15.45 13 15 13.45 15 14C15 14.55 15.45 15 16 15Z"
            fill="currentColor"
          />
          <path
            d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM5 19V5H19V19H5Z"
            fill="currentColor"
          />
          <path
            d="M12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6C10 7.10457 10.8954 8 12 8Z"
            fill="currentColor"
          />
          <path 
            d="M8 10H16M8 18H16"
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold mb-1 text-[#5EF38C] pixel-font">NURA Games</h1>
      <p className="text-gray-300 text-sm">Cognitive assessment platform</p>
    </div>
  );
};

export default AppLogo;
