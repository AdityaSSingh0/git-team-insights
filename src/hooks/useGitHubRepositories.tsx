
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

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

  return useQuery({
    queryKey: ['github-repositories', session?.user?.id],
    queryFn: async (): Promise<GitHubRepository[]> => {
      if (!session?.provider_token) {
        throw new Error('No GitHub access token available');
      }

      const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
        headers: {
          'Authorization': `token ${session.provider_token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }

      return response.json();
    },
    enabled: !!session?.provider_token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
