import React, { useState } from 'react';
import { useArticles } from '../hooks/useArticles';
import { ArticleCard } from './ArticleCard';
import { ArticleModal } from './ArticleModal';
import { FeedSkeleton } from './ui/SkeletonLoader';
import { ErrorBanner } from './ui/ErrorBanner';
import { Pagination } from './ui/Pagination';
import { PullToRefresh } from './ui/PullToRefresh';

export const ArticleFeed = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const {
    articles,
    totalPages,
    currentPage,
    loadingState,
    isRefreshing,
    refreshArticles,
    retryFetch,
    goToPage
  } = useArticles();

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  return (
    <PullToRefresh onRefresh={refreshArticles} isRefreshing={isRefreshing}>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Latest Health News
          </h2>
          <p className="text-gray-600">
            Curated health articles with AI-powered summaries and simplified explanations
          </p>
        </div>

        {loadingState.error && (
          <ErrorBanner
            message={loadingState.error}
            onRetry={retryFetch}
            className="mb-6"
          />
        )}

        {loadingState.isLoading ? (
          <FeedSkeleton />
        ) : (
          <>
            <div className="space-y-6">
              {articles.map((article) => (
                <ArticleCard
                  key={article._id}
                  article={article}
                  onArticleClick={handleArticleClick}
                />
              ))}
            </div>

            {articles.length === 0 && !loadingState.error && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No articles found</p>
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              disabled={loadingState.isLoading}
            />
          </>
        )}

        <ArticleModal
          article={selectedArticle}
          isOpen={!!selectedArticle}
          onClose={handleCloseModal}
        />
      </main>
    </PullToRefresh>
  );
};