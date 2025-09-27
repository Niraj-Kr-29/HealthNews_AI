const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://health-news-ai-backend-7unk.vercel.app/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getArticles(page = 1, limit = 10) {
    return this.request(`/articles?page=${page}&limit=${limit}`);
  }

  async generateSummary(articleId) {
    return this.request(`/articles/${articleId}/summarize`, {
      method: 'POST',
    });
  }

  async generateSimplifiedArticle(articleId) {
    return this.request(`/articles/${articleId}/simplify`, {
      method: 'POST',
    });
  }

  async refreshArticles() {
    return this.request('/articles/refresh', {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();