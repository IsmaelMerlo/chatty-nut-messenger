
import React from 'react';
import ChatInterface from '@/components/ChatInterface';

const Index = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-4xl h-[80vh] animate-fade-in">
        <div className="text-center mb-6">
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-2">
            Minimalist Chat Experience
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Chat App</h1>
          <p className="text-muted-foreground mt-2">
            A simple real-time chat application with a beautiful design
          </p>
        </div>
        
        <ChatInterface className="h-full" />
      </div>
    </div>
  );
};

export default Index;
