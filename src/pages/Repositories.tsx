
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import RepositoryCard from '@/components/RepositoryCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data
const mockUser = {
  name: "John Doe",
  avatar_url: "https://github.com/github.png",
  login: "johndoe"
};

const mockRepositories = [
  {
    id: 1,
    name: "awesome-react-app",
    description: "A modern React application with TypeScript and Tailwind CSS",
    language: "TypeScript",
    stars: 145,
    forks: 23,
    updated_at: "2024-01-15T10:30:00Z",
    private: false
  },
  {
    id: 2,
    name: "python-data-analysis",
    description: "Data analysis tools and scripts for processing large datasets",
    language: "Python",
    stars: 89,
    forks: 12,
    updated_at: "2024-01-12T14:20:00Z",
    private: false
  },
  {
    id: 3,
    name: "mobile-app-backend",
    description: "RESTful API backend for mobile applications",
    language: "Node.js",
    stars: 67,
    forks: 8,
    updated_at: "2024-01-10T09:15:00Z",
    private: true
  },
  {
    id: 4,
    name: "machine-learning-models",
    description: "Collection of machine learning models and experiments",
    language: "Python",
    stars: 234,
    forks: 45,
    updated_at: "2024-01-08T16:45:00Z",
    private: false
  },
  {
    id: 5,
    name: "design-system",
    description: "Comprehensive design system with reusable components",
    language: "TypeScript",
    stars: 178,
    forks: 34,
    updated_at: "2024-01-05T11:30:00Z",
    private: false
  },
  {
    id: 6,
    name: "devops-scripts",
    description: "Automation scripts for CI/CD and infrastructure management",
    language: "Shell",
    stars: 92,
    forks: 15,
    updated_at: "2024-01-03T13:20:00Z",
    private: true
  }
];

const Repositories = () => {
  const [user] = useState(mockUser);
  const [repositories] = useState(mockRepositories);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [filterBy, setFilterBy] = useState('all');

  const handleLogout = () => {
    console.log('Logging out...');
    window.location.href = '/login';
  };

  const filteredRepositories = repositories
    .filter(repo => {
      const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           repo.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'public' && !repo.private) ||
                           (filterBy === 'private' && repo.private);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stars':
          return b.stars - a.stars;
        case 'updated':
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold">Your Repositories</h1>
            <p className="text-muted-foreground mt-2">
              Manage and analyze your GitHub repositories
            </p>
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

          {/* Repository Grid */}
          {filteredRepositories.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
              {filteredRepositories.map((repository) => (
                <RepositoryCard key={repository.id} repository={repository} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 animate-fade-in">
              <div className="text-6xl text-muted-foreground mb-4">🔍</div>
              <h3 className="text-lg font-medium text-muted-foreground">No repositories found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Repositories;
