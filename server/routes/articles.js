import express from 'express';
import Article from '../models/Article.js';
import aiService from '../services/aiService.js';
import mockArticles from '../data/mockArticles.js';
import e from 'express';

const router = express.Router();

// In-memory storage fallback
let inMemoryArticles = [...mockArticles];

// Helper function to use MongoDB or in-memory storage
const useDatabase = () => {
  return process.env.MONGODB_URI && require('mongoose').connection.readyState === 1;
};

// GET /api/articles - Get paginated articles
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let articles, total;

    if (useDatabase()) {
      articles = await Article.find()
        .sort({ datePublished: -1 })
        .skip(skip)
        .limit(limit);
      total = await Article.countDocuments();
    } else {
      // Use in-memory storage
      const sortedArticles = inMemoryArticles.sort((a, b) => 
        new Date(b.datePublished) - new Date(a.datePublished)
      );
      articles = sortedArticles.slice(skip, skip + limit);
      total = inMemoryArticles.length;
    }

    res.json({
      data: articles,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// POST /api/articles/:id/summarize - Generate AI summary
router.post('/:id/summarize', async (req, res) => {
  try {
    const { id } = req.params;
    let article;

    if (useDatabase()) {
      article = await Article.findById(id);
    } else {
      article = inMemoryArticles.find(a => a._id === id);
    }

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Generate AI summary
    const { summary, takeaways } = await aiService.generateSummary(
      article.content, 
      article.title
    );

    console.log("Summary:", summary, "Takeaways:", takeaways);

    // Update article
    if (useDatabase()) {
      article.summary = summary;
      article.takeaways = takeaways;
      await article.save();
    } else {
      const index = inMemoryArticles.findIndex(a => a._id === id);
      if (index !== -1) {
        inMemoryArticles[index] = { ...article, summary, takeaways };
      }
    }

    res.json({ summary, takeaways });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// POST /api/articles/:id/simplify - Generate simplified article
router.post('/:id/simplify', async (req, res) => {
  try {
    const { id } = req.params;
    let article;

    if (useDatabase()) {
      article = await Article.findById(id);
    } else {
      article = inMemoryArticles.find(a => a._id === id);
    }

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Generate simplified version
    const simplifiedArticle = await aiService.generateSimplifiedArticle(
      article.content,
      article.title
    );

    // Update article
    if (useDatabase()) {
      article.simplifiedArticle = simplifiedArticle;
      await article.save();
    } else {
      const index = inMemoryArticles.findIndex(a => a._id === id);
      if (index !== -1) {
        inMemoryArticles[index] = { ...article, simplifiedArticle };
      }
    }

    res.json({ simplifiedArticle });
  } catch (error) {
    console.error('Error simplifying article:', error);
    res.status(500).json({ error: 'Failed to simplify article' });
  }
});

// POST /api/articles/refresh - Refresh articles (simulate new content)
router.post('/refresh', async (req, res) => {
  try {
    // Simulate getting fresh articles
    const refreshedArticles = mockArticles.map(article => ({
      ...article,
      datePublished: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      summary: undefined, // Clear AI-generated content to force regeneration
      takeaways: undefined,
      simplifiedArticle: undefined
    }));

    if (useDatabase()) {
      // In a real app, you'd fetch new articles from RSS feeds or APIs
      await Article.deleteMany({});
      await Article.insertMany(refreshedArticles);
    } else {
      inMemoryArticles = [...refreshedArticles];
    }

    res.json({ message: 'Articles refreshed successfully' });
  } catch (error) {
    console.error('Error refreshing articles:', error);
    res.status(500).json({ error: 'Failed to refresh articles' });
  }
});

export default router;