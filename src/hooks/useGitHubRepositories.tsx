
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

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
  owner: {
    login: string;
    avatar_url: string;
  };
}

export const useGitHubRepositories = () => {
  const { session } = useAuth();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['github-repositories', session?.user?.id],
    queryFn: async (): Promise<GitHubRepository[]> => {
      if (!session?.provider_token) {
        throw new Error('No GitHub access token available');
      }

      console.log('Fetching repositories...');

      const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
        headers: {
          'Authorization': `token ${session.provider_token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('GitHub API error:', response.status, errorText);
        
        if (response.status === 401) {
          throw new Error('GitHub authentication failed. Please sign in again.');
        } else if (response.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Please try again later.');
        }
        
        throw new Error(`Failed to fetch repositories: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched repositories:', data.length);
      return data;
    },
    enabled: !!session?.provider_token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle errors using useEffect instead of onError
  useEffect(() => {
    if (query.error) {
      console.error('Repository fetch error:', query.error);
      toast({
        title: "Error fetching repositories",
        description: query.error.message,
        variant: "destructive",
      });
    }
  }, [query.error, toast]);

  return query;
};
