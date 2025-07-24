import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Sparkles, Brain, Zap } from 'lucide-react';

interface AuthCardProps {
  onAuthSuccess: () => void;
}

export default function AuthCard({ onAuthSuccess }: AuthCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast.success('Welcome back to PromptCrafterAI!');
      onAuthSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      toast.success('Account created successfully! Welcome to PromptCrafterAI!');
      onAuthSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="relative">
              <Brain className="h-12 w-12 text-primary animate-pulse" />
              <Sparkles className="h-6 w-6 text-accent absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text">PromptCrafterAI</h1>
          <p className="text-muted-foreground text-lg">
            Enhance your prompts with AI-powered intelligence and multilingual support
          </p>
          <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Zap className="h-4 w-4 text-accent" />
              <span>AI Enhancement</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span>Multilingual</span>
            </div>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="glass-card border-0 shadow-glow-primary">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">Get Started</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one to start crafting amazing prompts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/20">
                <TabsTrigger value="signin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-background/5 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="bg-background/5 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full glow-primary bg-gradient-primary hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-background/5 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="bg-background/5 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="bg-background/5 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full glow-primary bg-gradient-primary hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="text-center p-4 rounded-lg bg-gradient-card backdrop-blur-sm border border-border/30">
            <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-sm">AI Enhancement</h3>
            <p className="text-xs text-muted-foreground">Intelligent prompt optimization</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-card backdrop-blur-sm border border-border/30">
            <Sparkles className="h-8 w-8 text-secondary mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Multilingual</h3>
            <p className="text-xs text-muted-foreground">15+ language support</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-card backdrop-blur-sm border border-border/30">
            <Zap className="h-8 w-8 text-accent mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Real-time</h3>
            <p className="text-xs text-muted-foreground">Instant enhancement</p>
          </div>
        </div>
      </div>
    </div>
  );
}