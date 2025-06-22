
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, GitFork, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  private: boolean;
  html_url: string;
}

interface GitHubRepositoryCardProps {
  repository: GitHubRepository;
}

const GitHubRepositoryCard = ({ repository }: GitHubRepositoryCardProps) => {
  const languageColors: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f7df1e',
    Python: '#3776ab',
    Java: '#ed8b00',
    Go: '#00add8',
    Rust: '#dea584',
    C: '#a8b9cc',
    'C++': '#f34b7d',
    HTML: '#e34c26',
    CSS: '#1572b6',
    Shell: '#89e051',
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg">
              <Link 
                to={`/repository/${repository.name}`}
                className="hover:text-primary transition-colors"
              >
                {repository.name}
              </Link>
            </CardTitle>
            <CardDescription className="text-sm line-clamp-2">
              {repository.description || 'No description available'}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            {repository.private && (
              <Badge variant="secondary" className="text-xs">Private</Badge>
            )}
            <Button variant="ghost" size="sm" asChild>
              <a 
                href={repository.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-8 w-8 p-0"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            {repository.language && (
              <div className="flex items-center space-x-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: languageColors[repository.language] || '#8884d8' }}
                />
                <span>{repository.language}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>{repository.stargazers_count}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <GitFork className="w-4 h-4" />
              <span>{repository.forks_count}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>
              {formatDistanceToNow(new Date(repository.updated_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GitHubRepositoryCard;
