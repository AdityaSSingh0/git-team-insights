
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import ChartContainer from '@/components/ChartContainer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useRepositoryAnalytics } from '@/hooks/useRepositoryAnalytics';
import { Loader2, RefreshCw, ExternalLink, GitCommit, GitPullRequest, AlertCircle, Users } from 'lucide-react';

const RepositoryDetail = () => {
  const { name } = useParams<{ name: string }>();
  const { data: analytics, isLoading, error, refetch } = useRepositoryAnalytics(name || '');

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-6xl text-red-500 mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-red-600">Failed to load repository analytics</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
            <Button onClick={() => refetch()} className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading repository analytics...</span>
          </div>
        </main>
      </div>
    );
  }

  const repositoryData = analytics?.rawData?.commits?.[0];
  const repoUrl = `https://github.com/${repositoryData?.commit?.author?.name || 'unknown'}/${name}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{name}</h1>
                <p className="text-muted-foreground mt-2">
                  Detailed analytics and collaboration insights
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Active</Badge>
                <Badge variant="outline">Repository</Badge>
                <Button variant="outline" asChild>
                  <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on GitHub
                  </a>
                </Button>
                <Button onClick={() => refetch()} variant="outline" disabled={isLoading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Repository Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
            <StatCard
              title="Total Commits"
              value={analytics?.metrics?.totalCommits?.toString() || "0"}
              description="Recent commit activity"
              trend={{ value: 0, isPositive: true }}
              icon={GitCommit}
            />
            <StatCard
              title="Contributors"
              value={analytics?.metrics?.activeContributors?.toString() || "0"}
              description="Active contributors"
              trend={{ value: 0, isPositive: true }}
              icon={Users}
            />
            <StatCard
              title="Pull Requests"
              value={analytics?.metrics?.totalPRs?.toString() || "0"}
              description={`${analytics?.metrics?.openPRs || 0} currently open`}
              trend={{ value: 0, isPositive: true }}
              icon={GitPullRequest}
            />
            <StatCard
              title="Issues"
              value={analytics?.metrics?.totalIssues?.toString() || "0"}
              description={`${analytics?.metrics?.openIssues || 0} currently open`}
              trend={{ value: 0, isPositive: true }}
              icon={AlertCircle}
            />
          </div>

          {/* Main Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Contributor Activity */}
            <ChartContainer 
              title="Top Contributors" 
              description="Most active contributors by commits"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics?.contributorData || []} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip />
                  <Bar dataKey="commits" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Issue Status */}
            <ChartContainer 
              title="Issue Status Distribution" 
              description="Current state of repository issues"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics?.issueStatusData || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(analytics?.issueStatusData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Issues']} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Timeline Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Commit Timeline */}
            <ChartContainer 
              title="Commit Activity Timeline" 
              description="Daily commit frequency over time"
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics?.commitTimeline || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value) => [value, 'Commits']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="commits" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* PR Activity */}
            <ChartContainer 
              title="Pull Request Activity" 
              description="PR statistics over time"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics?.prData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="week"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="opened" 
                    stroke="#8884d8" 
                    strokeWidth={3}
                    name="Opened"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="merged" 
                    stroke="#82ca9d" 
                    strokeWidth={3}
                    name="Merged"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="closed" 
                    stroke="#ff7300" 
                    strokeWidth={3}
                    name="Closed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Recent Activity Summary */}
          {analytics?.rawData && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity Summary</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {analytics.rawData.commits.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Recent Commits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {analytics.rawData.pullRequests.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Pull Requests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {analytics.rawData.contributors.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Contributors</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RepositoryDetail;
