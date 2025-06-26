export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
  author?: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  user: {
    login: string;
    avatar_url: string;
  };
  additions: number;
  deletions: number;
  changed_files: number;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: Array<{
    name: string;
    color: string;
  }>;
}

export interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  contributions: number;
}

export class GitHubApiService {
  private token: string;
  private baseUrl = 'https://api.github.com';

  constructor(token: string) {
    this.token = token;
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    console.log(`Making GitHub API request to: ${endpoint}`);
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GitHub API error for ${endpoint}:`, response.status, errorText);
      
      if (response.status === 401) {
        throw new Error('GitHub authentication failed. Please sign in again.');
      } else if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Please try again later.');
      } else if (response.status === 404) {
        throw new Error('Repository not found or you do not have access to it.');
      }
      
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`GitHub API response for ${endpoint}:`, data);
    return data;
  }

  async getRepositoryCommits(owner: string, repo: string, page = 1, perPage = 100): Promise<GitHubCommit[]> {
    return this.makeRequest<GitHubCommit[]>(`/repos/${owner}/${repo}/commits?page=${page}&per_page=${perPage}`);
  }

  async getRepositoryPullRequests(owner: string, repo: string, state: 'all' | 'open' | 'closed' = 'all'): Promise<GitHubPullRequest[]> {
    return this.makeRequest<GitHubPullRequest[]>(`/repos/${owner}/${repo}/pulls?state=${state}&per_page=100`);
  }

  async getRepositoryIssues(owner: string, repo: string, state: 'all' | 'open' | 'closed' = 'all'): Promise<GitHubIssue[]> {
    return this.makeRequest<GitHubIssue[]>(`/repos/${owner}/${repo}/issues?state=${state}&per_page=100`);
  }

  async getRepositoryContributors(owner: string, repo: string): Promise<GitHubContributor[]> {
    return this.makeRequest<GitHubContributor[]>(`/repos/${owner}/${repo}/contributors?per_page=100`);
  }

  async getCommitDetails(owner: string, repo: string, sha: string): Promise<GitHubCommit> {
    return this.makeRequest<GitHubCommit>(`/repos/${owner}/${repo}/commits/${sha}`);
  }

  async getRepositoryStats(owner: string, repo: string) {
    const [commits, pullRequests, issues, contributors] = await Promise.all([
      this.getRepositoryCommits(owner, repo, 1, 50),
      this.getRepositoryPullRequests(owner, repo),
      this.getRepositoryIssues(owner, repo),
      this.getRepositoryContributors(owner, repo),
    ]);

    return {
      commits,
      pullRequests,
      issues,
      contributors,
    };
  }
}
