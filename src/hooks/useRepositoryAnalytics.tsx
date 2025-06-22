
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { GitHubApiService } from '@/services/githubApi';

export const useRepositoryAnalytics = (repositoryName: string) => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['repository-analytics', repositoryName, session?.user?.id],
    queryFn: async () => {
      if (!session?.provider_token || !repositoryName) {
        throw new Error('No GitHub access token or repository name');
      }

      const githubApi = new GitHubApiService(session.provider_token);
      const username = session.user?.user_metadata?.user_name;
      
      if (!username) {
        throw new Error('No GitHub username found');
      }

      console.log(`Fetching analytics for ${username}/${repositoryName}`);
      
      const stats = await githubApi.getRepositoryStats(username, repositoryName);
      
      // Process commits for timeline
      const commitTimeline = stats.commits.reduce((acc: any[], commit) => {
        const date = new Date(commit.commit.author.date).toISOString().split('T')[0];
        const existing = acc.find(item => item.date === date);
        
        if (existing) {
          existing.commits += 1;
        } else {
          acc.push({ date, commits: 1 });
        }
        
        return acc;
      }, []).slice(0, 30).reverse();

      // Process contributors
      const contributorData = stats.contributors.slice(0, 10).map(contributor => ({
        name: contributor.login,
        commits: contributor.contributions,
        avatar: contributor.avatar_url,
      }));

      // Process PR activity
      const prData = stats.pullRequests.reduce((acc: any[], pr) => {
        const week = new Date(pr.created_at).toISOString().split('T')[0];
        const existing = acc.find(item => item.week === week);
        
        if (existing) {
          existing.opened += 1;
          if (pr.merged_at) existing.merged += 1;
          if (pr.state === 'closed' && !pr.merged_at) existing.closed += 1;
        } else {
          acc.push({
            week,
            opened: 1,
            merged: pr.merged_at ? 1 : 0,
            closed: (pr.state === 'closed' && !pr.merged_at) ? 1 : 0,
          });
        }
        
        return acc;
      }, []).slice(0, 12);

      // Process issue status
      const openIssues = stats.issues.filter(issue => issue.state === 'open').length;
      const closedIssues = stats.issues.filter(issue => issue.state === 'closed').length;
      const totalIssues = stats.issues.length;

      const issueStatusData = [
        { name: 'Open', value: openIssues, color: '#ff7300' },
        { name: 'Closed', value: closedIssues, color: '#82ca9d' },
      ];

      // Calculate metrics
      const totalCommits = stats.commits.length;
      const activeContributors = stats.contributors.length;
      const openPRs = stats.pullRequests.filter(pr => pr.state === 'open').length;
      const totalPRs = stats.pullRequests.length;

      return {
        commitTimeline,
        contributorData,
        prData,
        issueStatusData,
        metrics: {
          totalCommits,
          activeContributors,
          totalPRs,
          openPRs,
          totalIssues,
          openIssues,
          closedIssues,
        },
        rawData: stats,
      };
    },
    enabled: !!session?.provider_token && !!repositoryName,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
