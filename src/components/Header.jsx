import React from 'react';
import { Activity, Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-8 h-8" />
              <h1 className="text-2xl font-bold">HealthNews AI</h1>
            </div>
            <div className="hidden sm:flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered</span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm opacity-90">
              Curating health news with AI
            </p>
            <p className="text-xs opacity-75">
              Stay informed, stay healthy
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};