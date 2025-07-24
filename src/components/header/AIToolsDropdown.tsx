import React from 'react';
import { ExternalLink, Bot, Cpu, Code, Database, Zap, MessageCircle, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AI_TOOLS = [
  {
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    icon: MessageCircle,
    description: 'Conversational AI Assistant',
    category: 'Chat AI'
  },
  {
    name: 'DeepSeek',
    url: 'https://chat.deepseek.com',
    icon: Bot,
    description: 'Advanced AI Reasoning',
    category: 'Chat AI'
  },
  {
    name: 'Claude',
    url: 'https://claude.ai',
    icon: Cpu,
    description: 'AI Assistant by Anthropic',
    category: 'Chat AI'
  },
  {
    name: 'Lovable',
    url: 'https://lovable.dev',
    icon: Code,
    description: 'AI-Powered Development',
    category: 'Development'
  },
  {
    name: 'Vercel',
    url: 'https://vercel.com',
    icon: Zap,
    description: 'Frontend Cloud Platform',
    category: 'Development'
  },
  {
    name: 'Firebase',
    url: 'https://firebase.google.com',
    icon: Database,
    description: 'Backend as a Service',
    category: 'Development'
  },
  {
    name: 'Supabase',
    url: 'https://supabase.com',
    icon: Database,
    description: 'Open Source Firebase',
    category: 'Development'
  },
  {
    name: 'Replicate',
    url: 'https://replicate.com',
    icon: Cloud,
    description: 'Run AI Models in the Cloud',
    category: 'AI Platform'
  }
];

export function AIToolsDropdown() {
  const handleToolClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const groupedTools = AI_TOOLS.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof AI_TOOLS>);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="border-border/50 hover:bg-accent/10">
          <Bot className="h-4 w-4 mr-2" />
          AI Tools
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-background/95 backdrop-blur-sm border-border/50" align="end">
        <DropdownMenuLabel className="text-foreground">AI Tools & Platforms</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {Object.entries(groupedTools).map(([category, tools]) => (
          <div key={category}>
            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider px-2 py-1">
              {category}
            </DropdownMenuLabel>
            {tools.map((tool) => (
              <DropdownMenuItem
                key={tool.name}
                onClick={() => handleToolClick(tool.url)}
                className="cursor-pointer hover:bg-accent/20 focus:bg-accent/20"
              >
                <div className="flex items-center space-x-3 w-full">
                  <tool.icon className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{tool.name}</div>
                    <div className="text-xs text-muted-foreground">{tool.description}</div>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}