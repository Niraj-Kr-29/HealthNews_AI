import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorBanner = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-red-800 text-sm font-medium">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors duration-200"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};