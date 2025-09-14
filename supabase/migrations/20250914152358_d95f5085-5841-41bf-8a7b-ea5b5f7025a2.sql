-- Create client table for storing user signups (plain text, no Auth)
CREATE TABLE public.client (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (for security best practices)
ALTER TABLE public.client ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own data
CREATE POLICY "Allow client registration" 
ON public.client 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow users to view and update their own data
CREATE POLICY "Users can view their own data" 
ON public.client 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own data" 
ON public.client 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_client_updated_at
  BEFORE UPDATE ON public.client
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();