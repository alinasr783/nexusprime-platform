-- Create project_messages table for communication
CREATE TABLE public.project_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  message TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('client', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for project messages
CREATE POLICY "Users can view messages for their own projects" 
ON public.project_messages 
FOR SELECT 
USING (project_id IN (
  SELECT projects.id
  FROM projects
  WHERE projects.client_id IN (
    SELECT client.id
    FROM client
    WHERE client.email = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)
  )
));

CREATE POLICY "Users can create messages for their own projects" 
ON public.project_messages 
FOR INSERT 
WITH CHECK (project_id IN (
  SELECT projects.id
  FROM projects
  WHERE projects.client_id IN (
    SELECT client.id
    FROM client
    WHERE client.email = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)
  )
));

-- Admins can create and view all messages (placeholder policy)
CREATE POLICY "Admins can manage all messages" 
ON public.project_messages 
FOR ALL 
USING (false); -- This will be updated when admin roles are implemented

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_project_messages_updated_at
BEFORE UPDATE ON public.project_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for project_messages
ALTER TABLE public.project_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_messages;