import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import articleRoutes from './routes/articles.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['https://health-news-ai-1lb9.vercel.app'],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB (fallback to in-memory storage if not available)
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
    } else {
      console.log('Using in-memory storage (MongoDB not configured)');
    }
  } catch (error) {
    console.log('MongoDB connection failed, using in-memory storage:', error.message);
  }
};

connectDB();

// Routes
app.use('/api/articles', articleRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});