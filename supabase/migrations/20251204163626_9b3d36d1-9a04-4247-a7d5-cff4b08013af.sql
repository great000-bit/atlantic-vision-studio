-- Create app_role enum for admin roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer');

-- Create user_roles table for role-based access
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create pages table
CREATE TABLE public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sections table
CREATE TABLE public.sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    content JSONB NOT NULL DEFAULT '{}',
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create image_assets table
CREATE TABLE public.image_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    alt_text TEXT,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolio_items table
CREATE TABLE public.portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    thumbnail_image TEXT,
    video_url TEXT,
    client TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolio_gallery_images junction table
CREATE TABLE public.portfolio_gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_item_id UUID REFERENCES public.portfolio_items(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    tags TEXT[] DEFAULT '{}',
    published_at TIMESTAMP WITH TIME ZONE,
    is_published BOOLEAN NOT NULL DEFAULT false,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_roles (only admins can manage)
CREATE POLICY "Admins can view all roles" ON public.user_roles
    FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for pages
CREATE POLICY "Anyone can view non-deleted pages" ON public.pages
    FOR SELECT USING (is_deleted = false);

CREATE POLICY "Admins can manage pages" ON public.pages
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for sections
CREATE POLICY "Anyone can view non-deleted sections" ON public.sections
    FOR SELECT USING (is_deleted = false);

CREATE POLICY "Admins can manage sections" ON public.sections
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for image_assets
CREATE POLICY "Anyone can view non-deleted images" ON public.image_assets
    FOR SELECT USING (is_deleted = false);

CREATE POLICY "Admins can manage images" ON public.image_assets
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for portfolio_items
CREATE POLICY "Anyone can view non-deleted portfolio items" ON public.portfolio_items
    FOR SELECT USING (is_deleted = false);

CREATE POLICY "Admins can manage portfolio items" ON public.portfolio_items
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for portfolio_gallery_images
CREATE POLICY "Anyone can view gallery images" ON public.portfolio_gallery_images
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage gallery images" ON public.portfolio_gallery_images
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for blog_posts
CREATE POLICY "Anyone can view published non-deleted posts" ON public.blog_posts
    FOR SELECT USING (is_deleted = false AND (is_published = true OR (SELECT public.has_role(auth.uid(), 'admin'))));

CREATE POLICY "Admins can manage blog posts" ON public.blog_posts
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON public.sections
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_image_assets_updated_at BEFORE UPDATE ON public.image_assets
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_items_updated_at BEFORE UPDATE ON public.portfolio_items
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for CMS uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('cms-uploads', 'cms-uploads', true);

-- Storage policies for cms-uploads bucket
CREATE POLICY "Anyone can view CMS uploads" ON storage.objects
    FOR SELECT USING (bucket_id = 'cms-uploads');

CREATE POLICY "Admins can upload to CMS" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'cms-uploads' AND (SELECT public.has_role(auth.uid(), 'admin')));

CREATE POLICY "Admins can update CMS uploads" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'cms-uploads' AND (SELECT public.has_role(auth.uid(), 'admin')));

CREATE POLICY "Admins can delete CMS uploads" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'cms-uploads' AND (SELECT public.has_role(auth.uid(), 'admin')));