import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { PageSectionCards } from '@/components/admin/PageSectionCards';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminAbout = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSections = async () => {
    try {
      const { data: page } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', 'about')
        .eq('is_deleted', false)
        .single();

      if (!page) return;

      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('page_id', page.id)
        .eq('is_deleted', false)
        .order('sort_order');

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast({
        title: 'Error',
        description: 'Failed to load sections.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  return (
    <AdminLayout>
      <PageSectionCards
        pageSlug="about"
        pageTitle="About Page"
        pageDescription="Manage your about page sections and content."
        sections={sections}
        isLoading={isLoading}
        onRefresh={fetchSections}
      />
    </AdminLayout>
  );
};

export default AdminAbout;
