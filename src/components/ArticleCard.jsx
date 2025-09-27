import React, { useState } from 'react';
import { Calendar, ExternalLink, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useArticleAI } from '../hooks/useArticleAI';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { ErrorBanner } from './ui/ErrorBanner';

export const ArticleCard = ({ article, onArticleClick }) => {
  const [showTakeaways, setShowTakeaways] = useState(false);
  const { summaryState, generateSummary, retrySummary } = useArticleAI();

  const handleGenerateSummary = async () => {
    try {
      await generateSummary(article._id);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const currentSummary = summaryState.summary || article.summary;
  const currentTakeaways = summaryState.takeaways || article.takeaways;

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start space-x-4 mb-4">
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt=""
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
            {article.title}
          </h2>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.datePublished)}</span>
            </div>
            <span className="text-emerald-600 font-medium">{article.source}</span>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mb-4">
        {summaryState.error && (
          <ErrorBanner
            message={summaryState.error}
            onRetry={() => retrySummary(article._id)}
            className="mb-4"
          />
        )}

        {currentSummary ? (
          <div className="space-y-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800">Summary</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{currentSummary}</p>
            </div>

            {currentTakeaways && currentTakeaways.length > 0 && (
              <div>
                <button
                  onClick={() => setShowTakeaways(!showTakeaways)}
                  className="flex items-center space-x-2 text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors duration-200"
                >
                  <span>Key Takeaways</span>
                  {showTakeaways ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showTakeaways && (
                  <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <ul className="space-y-2">
                      {currentTakeaways.map((takeaway, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleGenerateSummary}
            disabled={summaryState.isLoading}
            className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:from-emerald-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {summaryState.isLoading ? (
              <LoadingSpinner size="sm" className="text-white" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate AI Summary</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={() => onArticleClick(article)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Read Full Article</span>
        </button>

        {currentSummary && (
          <button
            onClick={handleGenerateSummary}
            disabled={summaryState.isLoading}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200 disabled:opacity-50"
          >
            {summaryState.isLoading ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" className="text-emerald-600" />
                <span>Regenerating...</span>
              </div>
            ) : (
              'Regenerate Summary'
            )}
          </button>
        )}
      </div>
    </article>
  );
};