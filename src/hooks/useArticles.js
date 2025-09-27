import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export const useArticles = (initialPage = 1, limit = 10) => {
  const [articles, setArticles] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loadingState, setLoadingState] = useState({
    isLoading: true,
    error: null
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchArticles = useCallback(async (page, showLoading = true) => {
    try {
      if (showLoading) {
        setLoadingState({ isLoading: true, error: null });
      }

      const response = await apiService.getArticles(page, limit);
      
      setArticles(response.data);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
      setLoadingState({ isLoading: false, error: null });
    } catch (error) {
      setLoadingState({ 
        isLoading: false, 
        error: error.message || 'Failed to load articles'
      });
    }
  }, [limit]);

  const refreshArticles = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await apiService.refreshArticles();
      await fetchArticles(1, false);
    } catch (error) {
      setLoadingState({ 
        isLoading: false, 
        error: error.message || 'Failed to refresh articles'
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchArticles]);

  const retryFetch = useCallback(() => {
    fetchArticles(currentPage);
  }, [fetchArticles, currentPage]);

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      fetchArticles(page);
    }
  }, [fetchArticles, totalPages, currentPage]);

  useEffect(() => {
    fetchArticles(initialPage);
  }, [fetchArticles, initialPage]);

  return {
    articles,
    totalPages,
    currentPage,
    loadingState,
    isRefreshing,
    refreshArticles,
    retryFetch,
    goToPage
  };
};