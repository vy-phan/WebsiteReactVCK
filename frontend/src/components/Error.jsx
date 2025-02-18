import React from 'react';
import { XCircle, AlertCircle, RefreshCcw } from 'lucide-react';

const Error = ({
  show = false,
  message = "Đã có lỗi xảy ra",
  type = "error", // "error" hoặc "warning"
  size = "default",
  onRetry,
  className = ""
}) => {
  if (!show) return null;

  const sizeClasses = {
    small: "text-sm h-4 w-4",
    default: "text-base h-6 w-6",
    large: "text-lg h-8 w-8"
  };

  const typeClasses = {
    error: "bg-red-50 text-red-600 border-red-200",
    warning: "bg-yellow-50 text-yellow-600 border-yellow-200"
  };

  const Icon = type === "error" ? XCircle : AlertCircle;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50">
      <div className={`
        absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        rounded-lg shadow-2xl p-6 border-2
        flex flex-col items-center justify-center gap-4
        min-w-[250px] animate-in fade-in duration-300
        ${typeClasses[type]}
        ${className}
      `}>
        <Icon 
          className={`
            animate-bounce-slow
            ${sizeClasses[size]}
          `}
        />
        <span className={`
          font-medium text-center
          ${sizeClasses[size]}
        `}>
          {message}
        </span>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className={`
              mt-2 flex items-center gap-2 px-4 py-2 rounded-md
              bg-white border-2 border-current
              hover:opacity-80 transition-opacity
              ${type === 'error' ? 'text-red-600' : 'text-yellow-600'}
            `}
          >
            <RefreshCcw className="h-4 w-4" />
            Thử lại
          </button>
        )}
      </div>
    </div>
  );
};

export default Error;