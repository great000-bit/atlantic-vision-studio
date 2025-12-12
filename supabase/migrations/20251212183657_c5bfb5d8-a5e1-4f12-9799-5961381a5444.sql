-- Create creator_applications table to store submissions
CREATE TABLE public.creator_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT NOT NULL,
  portfolio_link TEXT,
  experience TEXT NOT NULL,
  file_urls TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.creator_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for public form submissions)
CREATE POLICY "Anyone can submit applications"
ON public.creator_applications
FOR INSERT
WITH CHECK (true);

-- Only admins can view/manage applications
CREATE POLICY "Admins can manage applications"
ON public.creator_applications
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_creator_applications_updated_at
BEFORE UPDATE ON public.creator_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for creator uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('creator-uploads', 'creator-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for creator uploads
CREATE POLICY "Anyone can upload creator files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'creator-uploads');

CREATE POLICY "Anyone can view creator files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'creator-uploads');

CREATE POLICY "Admins can manage creator files"
ON storage.objects
FOR ALL
USING (bucket_id = 'creator-uploads' AND has_role(auth.uid(), 'admin'::app_role));