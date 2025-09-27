import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyBpUCiznWe5hYfmvGEEvRJ7OAEDuUjozdQ');

class AIService {
  constructor() {
    this.apiKey = 'AIzaSyBpUCiznWe5hYfmvGEEvRJ7OAEDuUjozdQ';
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  async generateSummary(articleContent, title) {
    console.log("Generating summary for:", title);
    const prompt = `Please analyze this health news article and provide:

1. A TL;DR summary (maximum 2 lines)
2. Exactly 3 key takeaways as bullet points

Article Title: ${title}
Article Content: ${articleContent}

Format your response exactly like this:
Summary: [Your 2-line summary here]
Key Takeaways:
- [Takeaway 1]
- [Takeaway 2]
- [Takeaway 3]`;

    try {
      if (!this.apiKey || this.apiKey === '') {
        // Fallback to mock AI response
        return this.generateMockSummary(title, articleContent);
      }
      const model = genAI.getGenerativeModel({model : "gemini-2.5-flash"})

      const response = await model.generateContent([prompt])

      const generatedText = response.response.candidates[0].content.parts[0].text;

      return this.parseSummaryResponse(generatedText);
    } catch (error) {
      console.error('AI Service Error:', error.message);
      // Fallback to mock response
      return this.generateMockSummary(title, articleContent);
    }
  }

  async generateSimplifiedArticle(articleContent, title) {
    const prompt = `Please rewrite this health news article in a simpler, more accessible tone. Use:
- Simple, everyday language
- Shorter sentences
- Clear explanations of medical terms
- A friendly, conversational tone
- Keep all important information but make it easier to understand

Article Title: ${title}
Article Content: ${articleContent}

Format the response in a way that there exists no special characters or any formatting like bold or italics.

Please provide the simplified version:`;

    try {
      if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
        return this.generateMockSimplified(articleContent);
      }

      const model = genAI.getGenerativeModel({model : "gemini-2.5-flash"})

      const response = await model.generateContent([prompt])


      return response.response.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('AI Service Error:', error.message);
      return this.generateMockSimplified(articleContent);
    }
  }

  parseSummaryResponse(text) {
    const lines = text.split('\n').filter(line => line.trim());
    
    let summary = '';
    const takeaways = [];
    
    let inTakeaways = false;
    
    for (const line of lines) {
      if (line.startsWith('Summary:')) {
        summary = line.replace('Summary:', '').trim();
      } else if (line.includes('Key Takeaways:')) {
        inTakeaways = true;
      } else if (inTakeaways && line.startsWith('-')) {
        takeaways.push(line.replace('-', '').trim());
      }
    }
    
    return { summary, takeaways };
  }

  generateMockSummary(title, content) {
    // Simulate AI processing delay
    return new Promise(resolve => {
      setTimeout(() => {
        const sentences = content.split('.').filter(s => s.trim().length > 0);
        const summary = sentences.slice(0, 2).join('.') + '.';
        
        const takeaways = [
          'New research shows promising results for health improvement',
          'Study findings could impact current treatment approaches',
          'Further research needed to confirm long-term effects'
        ];
        
        resolve({ summary, takeaways });
      }, 1500);
    });
  }

  generateMockSimplified(content) {
    return new Promise(resolve => {
      setTimeout(() => {
        const simplified = content
          .replace(/However,/g, 'But')
          .replace(/Furthermore,/g, 'Also,')
          .replace(/conducted/g, 'done')
          .replace(/demonstrated/g, 'showed')
          .replace(/individuals/g, 'people')
          .replace(/approximately/g, 'about');
        
        resolve(`Here's a simpler version:\n\n${simplified}\n\nThis research helps us understand health better. If you have questions, talk to your doctor.`);
      }, 2000);
    });
  }
}

export default new AIService();