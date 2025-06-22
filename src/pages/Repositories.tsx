
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import GitHubRepositoryCard from '@/components/GitHubRepositoryCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGitHubRepositories } from '@/hooks/useGitHubRepositories';
import { Loader2, RefreshCw } from 'lucide-react';

const Repositories = () => {
  const { data: repositories, isLoading, error, refetch } = useGitHubRepositories();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [filterBy, setFilterBy] = useState('all');

  const filteredRepositories = repositories
    ?.filter(repo => {
      const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           repo.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'public' && !repo.private) ||
                           (filterBy === 'private' && repo.private);
      
      return matchesSearch && matchesFilter;
    })
    ?.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stars':
          return b.stargazers_count - a.stargazers_count;
        case 'updated':
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    }) || [];

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-6xl text-red-500 mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-red-600">Failed to load repositories</h3>
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Your Repositories</h1>
                <p className="text-muted-foreground mt-2">
                  Manage and analyze your GitHub repositories
                </p>
              </div>
              <Button onClick={() => refetch()} variant="outline" disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
            <div className="flex-1">
              <Input
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated">Last updated</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="stars">Stars</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading repositories...</span>
            </div>
          )}

          {/* Repository Grid */}
          {!isLoading && filteredRepositories.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
              {filteredRepositories.map((repository) => (
                <GitHubRepositoryCard key={repository.id} repository={repository} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredRepositories.length === 0 && repositories && repositories.length > 0 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="text-6xl text-muted-foreground mb-4">🔍</div>
              <h3 className="text-lg font-medium text-muted-foreground">No repositories found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}

          {/* No Repositories State */}
          {!isLoading && (!repositories || repositories.length === 0) && (
            <div className="text-center py-12 animate-fade-in">
              <div className="text-6xl text-muted-foreground mb-4">📁</div>
              <h3 className="text-lg font-medium text-muted-foreground">No repositories found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Create your first repository on GitHub to get started
              </p>
              <Button asChild className="mt-4">
                <a href="https://github.com/new" target="_blank" rel="noopener noreferrer">
                  Create Repository
                </a>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Repositories;
