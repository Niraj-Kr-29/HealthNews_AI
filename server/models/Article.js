import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  datePublished: {
    type: Date,
    required: true
  },
  imageUrl: {
    type: String
  },
  summary: {
    type: String
  },
  takeaways: [{
    type: String
  }],
  simplifiedArticle: {
    type: String
  }
}, {
  timestamps: true
});

// Index for pagination
articleSchema.index({ datePublished: -1 });

export default mongoose.model('Article', articleSchema);