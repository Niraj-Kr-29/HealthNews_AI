import { useState, useCallback } from 'react';
import { apiService } from '../services/api';

export const useArticleAI = () => {
  const [summaryState, setSummaryState] = useState({
    isLoading: false,
    error: null,
    summary: null,
    takeaways: null
  });

  const [simplifyState, setSimplifyState] = useState({
    isLoading: false,
    error: null,
    simplifiedArticle: null
  });

  const generateSummary = useCallback(async (articleId) => {
    setSummaryState({ isLoading: true, error: null, summary: null, takeaways: null });
    
    try {
      const result = await apiService.generateSummary(articleId);
      setSummaryState({ 
        isLoading: false, 
        error: null, 
        summary: result.summary,
        takeaways: result.takeaways
      });
      return result;
    } catch (error) {
      const errorMessage = error.message || 'Failed to generate summary';
      setSummaryState({ isLoading: false, error: errorMessage, summary: null, takeaways: null });
      throw error;
    }
  }, []);

  const generateSimplifiedArticle = useCallback(async (articleId) => {
    setSimplifyState({ isLoading: true, error: null, simplifiedArticle: null });
    
    try {
      const result = await apiService.generateSimplifiedArticle(articleId);
      setSimplifyState({ 
        isLoading: false, 
        error: null, 
        simplifiedArticle: result.simplifiedArticle
      });
      return result.simplifiedArticle;
    } catch (error) {
      const errorMessage = error.message || 'Failed to simplify article';
      setSimplifyState({ isLoading: false, error: errorMessage, simplifiedArticle: null });
      throw error;
    }
  }, []);

  const retrySummary = useCallback((articleId) => {
    generateSummary(articleId);
  }, [generateSummary]);

  const retrySimplify = useCallback((articleId) => {
    generateSimplifiedArticle(articleId);
  }, [generateSimplifiedArticle]);

  return {
    summaryState,
    simplifyState,
    generateSummary,
    generateSimplifiedArticle,
    retrySummary,
    retrySimplify
  };
};