import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({
  loading = false,
  text = "Đang tải...",
  size = "default",
  className = ""
}) => {
  if (!loading) return null;

  const sizeClasses = {
    small: "text-sm h-4 w-4",
    default: "text-base h-6 w-6",
    large: "text-lg h-8 w-8"
  };

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50">
      <div className={`
        absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        bg-white rounded-lg shadow-2xl p-6
        flex items-center justify-center gap-4
        min-w-[200px] animate-in fade-in duration-300
        ${className}
      `}>
        <Loader2 
          className={`
            animate-spin text-blue-500
            ${sizeClasses[size]}
          `}
        />
        <span className={`
          font-medium text-gray-700
          animate-pulse
          ${sizeClasses[size]}
        `}>
          {text}
        </span>
      </div>
    </div>
  );
};

export default Loading;