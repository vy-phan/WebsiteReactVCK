import React from 'react';

const CodeLoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm z-50">
      {/* Main centered container */}
      <div className="flex flex-col items-center justify-center p-8">
        {/* Code window styling */}
        <div className="w-96 bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
          {/* Window header */}
          <div className="flex items-center px-4 py-2 bg-gray-700">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          {/* Code animation container */}
          <div className="p-6 font-mono text-sm">
            {/* Animated code lines */}
            <div className="flex items-center mb-3 animate-pulse">
              <span className="text-purple-400">import</span>
              <span className="text-green-400 ml-2">&#123; loading &#125;</span>
              <span className="text-purple-400 ml-2">from</span>
              <span className="text-yellow-400 ml-2">'@modules';</span>
            </div>
            
            <div className="flex items-center mb-3 animate-pulse delay-100">
              <span className="text-purple-400">async</span>
              <span className="text-blue-400 ml-2">function</span>
              <span className="text-yellow-400 ml-2">initializeApp()</span>
              <span className="text-white ml-2">&#123;</span>
            </div>
            
            {/* Animated spinner */}
            <div className="flex justify-center my-6">
              <div className="relative w-24 h-24">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                <div className="absolute top-3 left-3 w-18 h-18 border-4 border-green-500 rounded-full animate-spin border-t-transparent animation-delay-150"></div>
                <div className="absolute top-6 left-6 w-12 h-12 border-4 border-purple-500 rounded-full animate-spin border-t-transparent animation-delay-300"></div>
              </div>
            </div>
            
            {/* Loading progress bar */}
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
              <div className="bg-blue-500 h-2.5 rounded-full animate-loading-progress"></div>
            </div>
            
            {/* Animated status messages */}
            <div className="text-xs text-gray-400 mb-2 animate-pulse delay-200">
               Initializing modules...
            </div>
            <div className="text-xs text-gray-400 mb-2 animate-pulse delay-300">
               Loading components...
            </div>
            <div className="text-xs text-gray-400 animate-pulse delay-400">
               Starting application
              <span className="inline-block animate-bounce">.</span>
              <span className="inline-block animate-bounce delay-100">.</span>
              <span className="inline-block animate-bounce delay-200">.</span>
            </div>
          </div>
        </div>
        
        {/* Loading text below */}
        <div className="mt-6 text-xl font-mono text-blue-400">
          <span className="animate-pulse">System Loading</span>
        </div>
      </div>
    </div>
  );
};

// Add these styles to your global CSS or Tailwind config
const style = `
  @keyframes loading-progress {
    0% { width: 0%; }
    50% { width: 70%; }
    75% { width: 85%; }
    90% { width: 95%; }
    100% { width: 100%; }
  }
  
  .animate-loading-progress {
    animation: loading-progress 2.5s ease-in-out infinite;
  }
  
  .animation-delay-150 {
    animation-delay: 150ms;
  }
  
  .animation-delay-300 {
    animation-delay: 300ms;
  }
  
  .delay-100 {
    animation-delay: 100ms;
  }
  
  .delay-200 {
    animation-delay: 200ms;
  }
  
  .delay-300 {
    animation-delay: 300ms;
  }
  
  .delay-400 {
    animation-delay: 400ms;
  }
`;

export default CodeLoadingSpinner;