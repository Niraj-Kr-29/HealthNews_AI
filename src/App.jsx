import React from 'react';
import { Header } from './components/Header';
import { ArticleFeed } from './components/ArticleFeed';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <ArticleFeed />
    </div>
  );
}

export default App;