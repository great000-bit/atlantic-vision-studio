import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface SectionContent {
  heading?: string;
  subheading?: string;
  body?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonStyle?: string;
  imageUrl?: string;
  imageAlt?: string;
  videoUrl?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
  label?: string;
  tagline?: string;
  items?: Array<Record<string, unknown>>;
  stats?: Array<{ value: string; label: string }>;
  images?: string[];
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  secondaryHeading?: string;
  secondaryBody?: string;
  yearsValue?: string;
  yearsLabel?: string;
  [key: string]: unknown;
}

interface Section {
  id: string;
  name: string;
  content: SectionContent;
  sort_order: number;
  is_deleted: boolean;
  updated_at: string;
}

const parseContent = (content: Json): SectionContent => {
  if (typeof content === 'object' && content !== null && !Array.isArray(content)) {
    return content as unknown as SectionContent;
  }
  return {};
};

export const useSectionContent = (pageSlug: string, sectionName: string) => {
  return useQuery({
    queryKey: ['section-content', pageSlug, sectionName],
    queryFn: async (): Promise<Section | null> => {
      try {
        const { data: page } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', pageSlug)
          .eq('is_deleted', false)
          .single();

        if (!page) return null;

        const { data: section } = await supabase
          .from('sections')
          .select('*')
          .eq('page_id', page.id)
          .eq('name', sectionName)
          .eq('is_deleted', false)
          .single();

        if (!section) return null;

        return {
          ...section,
          content: parseContent(section.content),
        } as Section;
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
};

export const usePageSections = (pageSlug: string) => {
  return useQuery({
    queryKey: ['page-sections', pageSlug],
    queryFn: async (): Promise<Section[]> => {
      try {
        const { data: page } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', pageSlug)
          .eq('is_deleted', false)
          .single();

        if (!page) return [];

        const { data: sections } = await supabase
          .from('sections')
          .select('*')
          .eq('page_id', page.id)
          .eq('is_deleted', false)
          .order('sort_order', { ascending: true });

        return (sections || []).map(s => ({
          ...s,
          content: parseContent(s.content),
        })) as Section[];
      } catch {
        return [];
      }
    },
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
};

export type { SectionContent, Section };
