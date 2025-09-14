-- Add phone number to client table
ALTER TABLE public.client ADD COLUMN IF NOT EXISTS phone TEXT;

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.client(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  goal TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'review', 'completed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  project_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for projects
CREATE POLICY "Users can view their own projects"
ON public.projects
FOR SELECT
USING (client_id IN (SELECT id FROM public.client WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));

CREATE POLICY "Users can create their own projects"
ON public.projects
FOR INSERT
WITH CHECK (client_id IN (SELECT id FROM public.client WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));

CREATE POLICY "Users can update their own projects"
ON public.projects
FOR UPDATE
USING (client_id IN (SELECT id FROM public.client WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));

CREATE POLICY "Users can delete their own projects"
ON public.projects
FOR DELETE
USING (client_id IN (SELECT id FROM public.client WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));

-- Create trigger for projects updated_at
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();