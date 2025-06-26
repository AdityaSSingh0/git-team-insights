
-- First, let's ensure we have the proper trigger function for handling GitHub OAuth users
-- This function will automatically create a profile when a user signs up via GitHub OAuth

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    github_username, 
    github_name, 
    github_avatar_url,
    github_access_token
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'user_name',
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url',
    NEW.raw_user_meta_data ->> 'provider_token'
  )
  ON CONFLICT (id) DO UPDATE SET
    github_username = EXCLUDED.github_username,
    github_name = EXCLUDED.github_name,
    github_avatar_url = EXCLUDED.github_avatar_url,
    github_access_token = EXCLUDED.github_access_token,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also create a trigger for updates (when OAuth tokens refresh)
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
