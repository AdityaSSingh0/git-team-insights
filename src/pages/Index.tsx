
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">G</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Gitlytics
            </span>
          </div>
          <Link to="/login">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Analyze & Visualize Your{' '}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              GitHub Collaboration
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get deep insights into your team's development patterns, track contributor activity, 
            and optimize your workflow with beautiful data visualizations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/login">
              <Button size="lg" className="text-lg px-8 py-6">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path 
                    fillRule="evenodd" 
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
                Connect with GitHub
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Analytics for Developer Teams
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your GitHub data into actionable insights with our comprehensive analytics platform
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <span className="text-2xl">📊</span>
              </div>
              <CardTitle>Contributor Insights</CardTitle>
              <CardDescription>
                Track individual and team contributions, commit patterns, and activity trends over time
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <span className="text-2xl">🔄</span>
              </div>
              <CardTitle>Pull Request Analytics</CardTitle>
              <CardDescription>
                Analyze PR frequency, review times, and merge patterns to optimize your development workflow
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <span className="text-2xl">🐛</span>
              </div>
              <CardTitle>Issue Management</CardTitle>
              <CardDescription>
                Monitor issue resolution times, track bug patterns, and improve your support processes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <span className="text-2xl">📈</span>
              </div>
              <CardTitle>Real-time Dashboards</CardTitle>
              <CardDescription>
                Beautiful, interactive charts and graphs that update in real-time with your latest data
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                <span className="text-2xl">🔒</span>
              </div>
              <CardTitle>Secure Integration</CardTitle>
              <CardDescription>
                OAuth-based authentication ensures your data stays secure while providing seamless access
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                <span className="text-2xl">⚡</span>
              </div>
              <CardTitle>Performance Optimized</CardTitle>
              <CardDescription>
                Asynchronous data processing and intelligent caching for lightning-fast analytics
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-12 text-center text-white animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to optimize your development workflow?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who use Gitlytics to gain insights into their team collaboration and improve their development processes.
          </p>
          <Link to="/login">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Start Analyzing Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>&copy; 2024 Gitlytics. Built with ❤️ for developer teams.</p>
      </footer>
    </div>
  );
};

export default Index;
