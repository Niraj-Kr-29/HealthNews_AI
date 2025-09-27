import React, { useState, useEffect } from 'react';
import { X, Sparkles, RefreshCw } from 'lucide-react';
import { useArticleAI } from '../hooks/useArticleAI';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { ErrorBanner } from './ui/ErrorBanner';

export const ArticleModal = ({ article, isOpen, onClose }) => {
  const [view, setView] = useState('original');
  const { simplifyState, generateSimplifiedArticle, retrySimplify } = useArticleAI();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSimplify = async () => {
    try {
      await generateSimplifiedArticle(article._id);
      setView('simplified');
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen || !article) return null;

  const currentSimplified = simplifyState.simplifiedArticle || article.simplifiedArticle;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="relative inline-block w-full max-w-6xl my-8 text-left align-middle bg-white shadow-xl rounded-2xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex-1 mr-4">
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                {article.title}
              </h2>
              <div className="mt-2 text-sm text-gray-500">
                <span className="text-emerald-600 font-medium">{article.source}</span>
                <span className="mx-2">•</span>
                <span>{new Date(article.datePublished).toLocaleDateString()}</span>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* View Controls */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setView('original')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  view === 'original'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Original
              </button>
              
              {currentSimplified && (
                <>
                  <button
                    onClick={() => setView('simplified')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      view === 'simplified'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Simplified
                  </button>
                  
                  <button
                    onClick={() => setView('split')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      view === 'split'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Side by Side
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {currentSimplified && (
                <button
                  onClick={handleSimplify}
                  disabled={simplifyState.isLoading}
                  className="inline-flex items-center space-x-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  {simplifyState.isLoading ? (
                    <LoadingSpinner size="sm" className="text-blue-600" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span>Regenerate</span>
                </button>
              )}

              {!currentSimplified && (
                <button
                  onClick={handleSimplify}
                  disabled={simplifyState.isLoading}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {simplifyState.isLoading ? (
                    <LoadingSpinner size="sm" className="text-white" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>
                    {simplifyState.isLoading ? 'Simplifying...' : 'Simplify Article'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[70vh] overflow-y-auto">
            {simplifyState.error && (
              <div className="p-6">
                <ErrorBanner
                  message={simplifyState.error}
                  onRetry={() => retrySimplify(article._id)}
                />
              </div>
            )}

            <div className="p-6">
              {view === 'original' && (
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {article.content}
                  </div>
                </div>
              )}

              {view === 'simplified' && currentSimplified && (
                <div className="prose prose-lg max-w-none">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">AI Simplified Version</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      This version uses simpler language and explanations to make the content more accessible.
                    </p>
                  </div>
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {currentSimplified}
                  </div>
                </div>
              )}

              {view === 'split' && currentSimplified && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                      <span>Original Article</span>
                    </h3>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
                        {article.content}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span>Simplified Version</span>
                    </h3>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
                        {currentSimplified}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};