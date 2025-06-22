
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import GitHubRepositoryCard from '@/components/GitHubRepositoryCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useGitHubRepositories } from '@/hooks/useGitHubRepositories';
import { Loader2, RefreshCw, Search, Filter, SortAsc } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

const Repositories = () => {
  const { data: repositories, isLoading, error, refetch } = useGitHubRepositories();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [filterBy, setFilterBy] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRepositories = repositories
    ?.filter(repo => {
      const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           repo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           repo.language?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'public' && !repo.private) ||
                           (filterBy === 'private' && repo.private) ||
                           (filterBy === 'starred' && repo.stargazers_count > 0) ||
                           (filterBy === 'forked' && repo.forks_count > 0);
      
      return matchesSearch && matchesFilter;
    })
    ?.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stars':
          return b.stargazers_count - a.stargazers_count;
        case 'forks':
          return b.forks_count - a.forks_count;
        case 'updated':
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    }) || [];

  // Pagination logic
  const totalPages = Math.ceil(filteredRepositories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRepositories = filteredRepositories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to first page when filters change
  const handleFilterChange = (newFilter: string) => {
    setFilterBy(newFilter);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

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
                  Manage and analyze your GitHub repositories ({filteredRepositories.length} found)
                </p>
              </div>
              <Button onClick={() => refetch()} variant="outline" disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Enhanced Filters and Search */}
          <div className="bg-white rounded-lg border p-6 animate-slide-up">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search repositories by name, description, or language..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Controls */}
              <div className="flex gap-2">
                <div className="flex items-center space-x-2">
                  <SortAsc className="w-4 h-4 text-muted-foreground" />
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="updated">Last updated</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="stars">Most stars</SelectItem>
                      <SelectItem value="forks">Most forks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <Select value={filterBy} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="starred">Starred</SelectItem>
                      <SelectItem value="forked">Forked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Active filters indicator */}
            {(searchQuery || filterBy !== 'all' || sortBy !== 'updated') && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchQuery && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSearchChange('')}
                  >
                    Search: "{searchQuery}" ×
                  </Button>
                )}
                {filterBy !== 'all' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleFilterChange('all')}
                  >
                    Filter: {filterBy} ×
                  </Button>
                )}
                {sortBy !== 'updated' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSortChange('updated')}
                  >
                    Sort: {sortBy} ×
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading repositories...</span>
            </div>
          )}

          {/* Repository Grid */}
          {!isLoading && paginatedRepositories.length > 0 && (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-slide-up">
                {paginatedRepositories.map((repository) => (
                  <GitHubRepositoryCard key={repository.id} repository={repository} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNum)}
                              isActive={currentPage === pageNum}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!isLoading && paginatedRepositories.length === 0 && repositories && repositories.length > 0 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="text-6xl text-muted-foreground mb-4">🔍</div>
              <h3 className="text-lg font-medium text-muted-foreground">No repositories found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your search or filter criteria
              </p>
              <Button 
                onClick={() => {
                  handleSearchChange('');
                  handleFilterChange('all');
                  handleSortChange('updated');
                }}
                className="mt-4"
                variant="outline"
              >
                Clear all filters
              </Button>
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
