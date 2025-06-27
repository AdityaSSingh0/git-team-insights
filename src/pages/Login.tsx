
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { Github, AlertCircle, ExternalLink, CheckCircle } from 'lucide-react';

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

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
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
      <div className="w-full max-w-2xl space-y-8">
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
                <strong>Setup Required:</strong> Complete the GitHub OAuth setup below before signing in.
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

        <Card className="p-6">
          <div className="text-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Github className="h-4 w-4" />
              GitHub OAuth Setup Instructions
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Step 1: Create GitHub OAuth App</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-2">
                  <li>
                    Go to{' '}
                    <button 
                      onClick={() => handleExternalLink('https://github.com/settings/developers')}
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      GitHub Developer Settings <ExternalLink className="h-3 w-3" />
                    </button>
                  </li>
                  <li>Click "New OAuth App"</li>
                  <li>Fill in the application details:
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li><strong>Application name:</strong> Gitlytics</li>
                      <li><strong>Homepage URL:</strong> {window.location.origin}</li>
                      <li><strong>Authorization callback URL:</strong> https://nlnhpqkgyigztumogcge.supabase.co/auth/v1/callback</li>
                    </ul>
                  </li>
                  <li>Click "Register application"</li>
                  <li>Copy the <strong>Client ID</strong> and generate a <strong>Client Secret</strong></li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Step 2: Configure Supabase</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-2">
                  <li>
                    Go to{' '}
                    <button 
                      onClick={() => handleExternalLink('https://supabase.com/dashboard/project/nlnhpqkgyigztumogcge/auth/providers')}
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      Supabase Auth Providers <ExternalLink className="h-3 w-3" />
                    </button>
                  </li>
                  <li>Find and enable the GitHub provider</li>
                  <li>Enter your GitHub OAuth app credentials:
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li>Paste the <strong>Client ID</strong></li>
                      <li>Paste the <strong>Client Secret</strong></li>
                    </ul>
                  </li>
                  <li>Set the redirect URL to: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{window.location.origin}/dashboard</code></li>
                  <li>Click "Save"</li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Step 3: Configure URL Settings</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-2">
                  <li>
                    Go to{' '}
                    <button 
                      onClick={() => handleExternalLink('https://supabase.com/dashboard/project/nlnhpqkgyigztumogcge/auth/url-configuration')}
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      Supabase URL Configuration <ExternalLink className="h-3 w-3" />
                    </button>
                  </li>
                  <li>Set the <strong>Site URL</strong> to: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{window.location.origin}</code></li>
                  <li>Add <strong>Redirect URLs</strong>:
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{window.location.origin}/dashboard</code></li>
                      <li><code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{window.location.origin}/**</code></li>
                    </ul>
                  </li>
                  <li>Click "Save"</li>
                </ol>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>After completing setup:</strong> Refresh this page and try signing in with GitHub!
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
