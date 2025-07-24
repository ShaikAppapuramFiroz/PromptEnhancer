import React from 'react';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UserProfileProps {
  user: any;
}

export function UserProfile({ user }: UserProfileProps) {
  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-80 glass-card border-0 shadow-glow-primary">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.photoURL} alt="Profile" />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg font-semibold">
              {getInitials(user?.email || 'U')}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-xl">
          {user?.displayName || user?.email?.split('@')[0] || 'User'}
        </CardTitle>
        <Badge variant="secondary" className="w-fit mx-auto">
          <Shield className="h-3 w-3 mr-1" />
          Verified User
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-gradient-card rounded-lg">
          <Mail className="h-4 w-4 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Email</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-gradient-card rounded-lg">
          <User className="h-4 w-4 text-secondary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">User ID</p>
            <p className="text-xs text-muted-foreground truncate">{user?.uid}</p>
          </div>
        </div>
        
        {user?.metadata?.creationTime && (
          <div className="flex items-center space-x-3 p-3 bg-gradient-card rounded-lg">
            <Calendar className="h-4 w-4 text-accent" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Member Since</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(user.metadata.creationTime)}
              </p>
            </div>
          </div>
        )}
        
        <div className="pt-2 border-t border-border/50">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary">Pro</div>
              <div className="text-xs text-muted-foreground">Plan</div>
            </div>
            <div>
              <div className="text-lg font-bold text-secondary">∞</div>
              <div className="text-xs text-muted-foreground">Enhancements</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}