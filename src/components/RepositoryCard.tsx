
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Repository {
  id: number;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  updated_at: string;
  private: boolean;
}

interface RepositoryCardProps {
  repository: Repository;
}

const RepositoryCard = ({ repository }: RepositoryCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="group transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {repository.name}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {repository.description || 'No description available'}
            </CardDescription>
          </div>
          {repository.private && (
            <Badge variant="secondary" className="ml-2">
              Private
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            {repository.language && (
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span>{repository.language}</span>
              </div>
            )}
            <span>⭐ {repository.stars}</span>
            <span>🍴 {repository.forks}</span>
          </div>
          <span>Updated {formatDate(repository.updated_at)}</span>
        </div>
        
        <Link to={`/repository/${repository.name}`}>
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            View Analytics
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default RepositoryCard;
