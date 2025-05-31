import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-50 to-amber-50 flex flex-col items-center justify-center z-50">
      {/* Logo and Brand */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
          <svg
            viewBox="0 0 24 24"
            className="w-12 h-12 text-white"
            fill="currentColor"
          >
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
            <path d="M6 14L7 17L10 18L7 19L6 22L5 19L2 18L5 17L6 14Z" />
            <path d="M18 6L19 9L22 10L19 11L18 14L17 11L14 10L17 9L18 6Z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lokly</h1>
        <p className="text-gray-600">Authentic Cultural Experiences</p>
      </div>

      {/* Loading Animation */}
      <div className="w-64 mb-8">
        <div className="bg-white rounded-full h-2 shadow-inner overflow-hidden">
          <div 
            className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-gray-500 mt-4 text-sm">
          Loading your cultural journey...
        </p>
      </div>

      {/* Animated Dots */}
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
}