import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Copy, 
  Sparkles, 
  Languages, 
  LogOut, 
  User, 
  Wand2, 
  Loader2,
  RefreshCw,
  Lightbulb,
  Brain,
  Zap
} from 'lucide-react';
import { enhancePrompt, generatePromptSuggestions } from '@/services/promptEnhancerService';
import { translateText, SUPPORTED_LANGUAGES, detectLanguage } from '@/services/translationService';

interface PromptEnhancerProps {
  user: any;
}

export default function PromptEnhancer({ user }: PromptEnhancerProps) {
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const handleEnhancePrompt = async () => {
    if (!originalPrompt.trim()) {
      toast.error('Please enter a prompt to enhance');
      return;
    }

    setIsEnhancing(true);
    
    try {
      // Detect the language of the input
      const detected = await detectLanguage(originalPrompt);
      setDetectedLanguage(detected);

      let promptToEnhance = originalPrompt;

      // If input is not in English, translate it first
      if (detected !== 'en') {
        setIsTranslating(true);
        promptToEnhance = await translateText(originalPrompt, 'en', detected);
      }

      // Enhance the prompt using Hugging Face
      const enhanced = await enhancePrompt(promptToEnhance);

      // If target language is not English, translate the result
      let finalPrompt = enhanced;
      if (selectedLanguage !== 'en') {
        finalPrompt = await translateText(enhanced, selectedLanguage, 'en');
      }

      setEnhancedPrompt(finalPrompt);
      toast.success('Prompt enhanced successfully!');
    } catch (error) {
      console.error('Enhancement error:', error);
      toast.error('Failed to enhance prompt. Please try again.');
    } finally {
      setIsEnhancing(false);
      setIsTranslating(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!enhancedPrompt) {
      toast.error('No enhanced prompt to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(enhancedPrompt);
      toast.success('Enhanced prompt copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setOriginalPrompt(suggestion);
  };

  const generateSuggestions = async () => {
    if (originalPrompt.trim()) {
      const newSuggestions = await generatePromptSuggestions(originalPrompt);
      setSuggestions(newSuggestions);
    }
  };

  useEffect(() => {
    generateSuggestions();
  }, [originalPrompt]);

  return (
    <div className="min-h-screen bg-gradient-bg p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Brain className="h-10 w-10 text-primary animate-pulse" />
              <Sparkles className="h-5 w-5 text-accent absolute -top-1 -right-1 animate-bounce" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">PromptCrafterAI</h1>
              <p className="text-muted-foreground">Intelligent Prompt Enhancement Platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="border-border/50 hover:bg-destructive/10 hover:border-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card border-0 shadow-glow-primary">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wand2 className="h-6 w-6 text-primary" />
                  <span>Prompt Input</span>
                  {detectedLanguage && (
                    <Badge variant="secondary" className="ml-auto">
                      <Languages className="h-3 w-3 mr-1" />
                      {SUPPORTED_LANGUAGES.find(lang => lang.code === detectedLanguage)?.name || detectedLanguage}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your prompt here... (e.g., 'Write a blog post about AI')"
                  value={originalPrompt}
                  onChange={(e) => setOriginalPrompt(e.target.value)}
                  className="min-h-32 bg-background/5 border-border/50 focus:border-primary transition-colors resize-none"
                  maxLength={1000}
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Languages className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Output Language:</span>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="w-40 bg-background/5 border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SUPPORTED_LANGUAGES.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {originalPrompt.length}/1000
                  </div>
                </div>

                <Button 
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing || !originalPrompt.trim()}
                  className="w-full glow-primary bg-gradient-primary hover:opacity-90 h-12"
                >
                  {isEnhancing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {isTranslating ? 'Translating & Enhancing...' : 'Enhancing...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Enhance Prompt
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Output */}
            {enhancedPrompt && (
              <Card className="glass-card border-0 shadow-glow-secondary">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-6 w-6 text-secondary" />
                      <span>Enhanced Prompt</span>
                    </div>
                    <Button 
                      onClick={handleCopyToClipboard}
                      size="sm"
                      className="bg-gradient-secondary hover:opacity-90"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-background/5 border border-border/50 rounded-lg p-4 min-h-32">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                      {enhancedPrompt}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gradient-card rounded-lg">
                    <div className="text-2xl font-bold text-primary">{originalPrompt.split(' ').length}</div>
                    <div className="text-xs text-muted-foreground">Input Words</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-card rounded-lg">
                    <div className="text-2xl font-bold text-secondary">{enhancedPrompt.split(' ').length}</div>
                    <div className="text-xs text-muted-foreground">Output Words</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Lightbulb className="h-5 w-5 text-accent" />
                    <span>Suggestions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left p-3 rounded-lg bg-gradient-card hover:bg-muted/20 transition-colors border border-border/30 hover:border-primary/50"
                    >
                      <p className="text-sm text-foreground/90">{suggestion}</p>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Features */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-lg">Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Brain className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">AI Enhancement</p>
                      <p className="text-xs text-muted-foreground">Powered by Hugging Face</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Languages className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-sm font-medium">15+ Languages</p>
                      <p className="text-xs text-muted-foreground">Google Translate API</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm font-medium">Real-time Processing</p>
                      <p className="text-xs text-muted-foreground">Instant results</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}