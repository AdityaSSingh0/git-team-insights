
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import ChartContainer from '@/components/ChartContainer';
import RepositoryCard from '@/components/RepositoryCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics';
import { useGitHubRepositories } from '@/hooks/useGitHubRepositories';
import { Loader2, RefreshCw, Search, TrendingUp, GitBranch, Star, Users } from 'lucide-react';
import { useState } from 'react';

const Dashboard = () => {
  const { data: repositories, isLoading: reposLoading, refetch: refetchRepos } = useGitHubRepositories();
  const { data: analytics, isLoading: analyticsLoading, refetch: refetchAnalytics } = useDashboardAnalytics();
  const [searchTerm, setSearchTerm] = useState('');

  const isLoading = reposLoading || analyticsLoading;

  const filteredRepositories = repositories?.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 6) || [];

  const handleRefresh = () => {
    refetchRepos();
    refetchAnalytics();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading dashboard analytics...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  Your GitHub analytics and collaboration insights
                </p>
              </div>
              <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
            <StatCard
              title="Total Repositories"
              value={analytics?.metrics.totalRepositories.toString() || "0"}
              description={`${analytics?.metrics.publicRepos || 0} public, ${analytics?.metrics.privateRepos || 0} private`}
              trend={{ value: 0, isPositive: true }}
              icon={GitBranch}
            />
            <StatCard
              title="Total Stars"
              value={analytics?.metrics.totalStars.toString() || "0"}
              description="Across all repositories"
              trend={{ value: 0, isPositive: true }}
              icon={Star}
            />
            <StatCard
              title="Recent Commits"
              value={analytics?.metrics.totalCommits.toString() || "0"}
              description="Last 20 commits per repo"
              trend={{ value: 0, isPositive: true }}
              icon={TrendingUp}
            />
            <StatCard
              title="Pull Requests"
              value={analytics?.metrics.totalPRs.toString() || "0"}
              description="Total across repositories"
              trend={{ value: 0, isPositive: true }}
              icon={Users}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Repository Activity */}
            <ChartContainer 
              title="Repository Activity" 
              description="Commits and pull requests by repository"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics?.repoActivityData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="commits" fill="hsl(var(--primary))" name="Commits" />
                  <Bar dataKey="pullRequests" fill="#82ca9d" name="Pull Requests" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Language Distribution */}
            <ChartContainer 
              title="Language Distribution" 
              description="Programming languages across repositories"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics?.languageData || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(analytics?.languageData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Repository Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Recent Repositories</h2>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search repositories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>

            {filteredRepositories.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
                {filteredRepositories.map((repository) => (
                  <RepositoryCard 
                    key={repository.id} 
                    repository={{
                      id: repository.id,
                      name: repository.name,
                      description: repository.description || '',
                      language: repository.language || 'Unknown',
                      stars: repository.stargazers_count,
                      forks: repository.forks_count,
                      updated_at: repository.updated_at,
                      private: repository.private,
                    }} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 animate-fade-in">
                <div className="text-6xl text-muted-foreground mb-4">🔍</div>
                <h3 className="text-lg font-medium text-muted-foreground">No repositories found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchTerm ? 'Try adjusting your search term' : 'Create your first repository to get started'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
