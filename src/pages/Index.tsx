import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/config/firebase';
import AuthCard from '@/components/auth/AuthCard';
import PromptEnhancer from '@/components/prompt/PromptEnhancer';
import { Loader2, Brain, Sparkles } from 'lucide-react';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-bg">
        <div className="text-center space-y-4">
          <div className="relative">
            <Brain className="h-16 w-16 text-primary animate-pulse mx-auto" />
            <Sparkles className="h-8 w-8 text-accent absolute -top-2 -right-2 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold gradient-text">PromptCrafterAI</h2>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading your AI workspace...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {user ? (
        <PromptEnhancer user={user} />
      ) : (
        <AuthCard onAuthSuccess={() => {}} />
      )}
    </div>
  );
};

export default Index;
