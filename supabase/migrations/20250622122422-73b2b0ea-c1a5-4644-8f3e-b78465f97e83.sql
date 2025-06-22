
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  github_username TEXT,
  github_avatar_url TEXT,
  github_name TEXT,
  github_access_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create repositories table
CREATE TABLE public.repositories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  github_id BIGINT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  description TEXT,
  language TEXT,
  stars_count INTEGER DEFAULT 0,
  forks_count INTEGER DEFAULT 0,
  private BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create commits table for analytics
CREATE TABLE public.commits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  repository_id UUID REFERENCES public.repositories(id) ON DELETE CASCADE NOT NULL,
  sha TEXT NOT NULL,
  author_name TEXT,
  author_email TEXT,
  message TEXT,
  commit_date TIMESTAMP WITH TIME ZONE,
  additions INTEGER DEFAULT 0,
  deletions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for repositories
CREATE POLICY "Users can view their own repositories" 
  ON public.repositories 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own repositories" 
  ON public.repositories 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own repositories" 
  ON public.repositories 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Create RLS policies for commits
CREATE POLICY "Users can view commits from their repositories" 
  ON public.commits 
  FOR SELECT 
  USING (
    repository_id IN (
      SELECT id FROM public.repositories WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert commits to their repositories" 
  ON public.commits 
  FOR INSERT 
  WITH CHECK (
    repository_id IN (
      SELECT id FROM public.repositories WHERE user_id = auth.uid()
    )
  );

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, github_username, github_name, github_avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'user_name',
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
