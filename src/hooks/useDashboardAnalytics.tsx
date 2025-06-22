
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useGitHubRepositories } from '@/hooks/useGitHubRepositories';
import { GitHubApiService } from '@/services/githubApi';

export const useDashboardAnalytics = () => {
  const { session } = useAuth();
  const { data: repositories } = useGitHubRepositories();

  return useQuery({
    queryKey: ['dashboard-analytics', session?.user?.id],
    queryFn: async () => {
      if (!session?.provider_token || !repositories) {
        throw new Error('No GitHub access token or repositories');
      }

      const githubApi = new GitHubApiService(session.provider_token);
      const username = session.user?.user_metadata?.user_name;
      
      if (!username) {
        throw new Error('No GitHub username found');
      }

      console.log('Fetching dashboard analytics...');

      // Get recent activity from top repositories
      const topRepos = repositories.slice(0, 5);
      const repoStats = await Promise.all(
        topRepos.map(async (repo) => {
          try {
            const commits = await githubApi.getRepositoryCommits(username, repo.name, 1, 20);
            const pullRequests = await githubApi.getRepositoryPullRequests(username, repo.name);
            return {
              repo: repo.name,
              commits: commits.length,
              pullRequests: pullRequests.length,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
            };
          } catch (error) {
            console.error(`Error fetching stats for ${repo.name}:`, error);
            return {
              repo: repo.name,
              commits: 0,
              pullRequests: 0,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
            };
          }
        })
      );

      // Calculate aggregated stats
      const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);
      const totalCommits = repoStats.reduce((sum, stats) => sum + stats.commits, 0);
      const totalPRs = repoStats.reduce((sum, stats) => sum + stats.pullRequests, 0);

      // Repository activity chart data
      const repoActivityData = repoStats.map(stats => ({
        name: stats.repo,
        commits: stats.commits,
        pullRequests: stats.pullRequests,
        stars: stats.stars,
      }));

      // Language distribution
      const languageStats = repositories.reduce((acc: any, repo) => {
        if (repo.language) {
          acc[repo.language] = (acc[repo.language] || 0) + 1;
        }
        return acc;
      }, {});

      const languageData = Object.entries(languageStats)
        .map(([language, count]) => ({
          name: language,
          value: count as number,
          color: getLanguageColor(language),
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

      // Repository type distribution
      const publicRepos = repositories.filter(repo => !repo.private).length;
      const privateRepos = repositories.filter(repo => repo.private).length;

      const repoTypeData = [
        { name: 'Public', value: publicRepos, color: '#82ca9d' },
        { name: 'Private', value: privateRepos, color: '#8884d8' },
      ];

      return {
        metrics: {
          totalRepositories: repositories.length,
          totalStars,
          totalForks,
          totalCommits,
          totalPRs,
          publicRepos,
          privateRepos,
        },
        repoActivityData,
        languageData,
        repoTypeData,
        topRepositories: repoStats,
      };
    },
    enabled: !!session?.provider_token && !!repositories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
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
    Vue: '#4fc08d',
    React: '#61dafb',
    PHP: '#777bb4',
    Ruby: '#cc342d',
    Swift: '#fa7343',
    Kotlin: '#7f52ff',
  };
  return colors[language] || '#8884d8';
}
