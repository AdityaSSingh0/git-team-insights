
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { Github, AlertCircle } from 'lucide-react';

const Login = () => {
  const { user, signInWithGitHub, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGitHubLogin = async () => {
    await signInWithGitHub();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4">
            <span className="text-primary-foreground font-bold text-2xl">G</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Welcome to Gitlytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Analyze and visualize your GitHub collaboration data
          </p>
        </div>

        <Card className="glass-card">
          <CardHeader className="text-center">
            <CardTitle>Sign in to get started</CardTitle>
            <CardDescription>
              Connect with GitHub to analyze your repositories and team collaboration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Setup Required:</strong> GitHub OAuth needs to be configured in your Supabase project. 
                Please check the authentication settings in your Supabase dashboard.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={handleGitHubLogin}
              disabled={loading}
              className="w-full h-12 text-lg font-medium bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-50"
            >
              <Github className="w-5 h-5 mr-3" />
              {loading ? 'Signing in...' : 'Continue with GitHub'}
            </Button>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              By signing in, you agree to our terms of service and privacy policy
            </div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-muted-foreground">
            <h3 className="font-semibold mb-2">Configuration Steps:</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to your Supabase project dashboard</li>
              <li>Navigate to Authentication → Providers</li>
              <li>Enable GitHub provider</li>
              <li>Add your GitHub OAuth app credentials</li>
              <li>Set the redirect URL to: {window.location.origin}/dashboard</li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
