import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  X,
  ChevronDown,
  GripVertical,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Page {
  id: string;
  title: string;
  slug: string;
}

interface Section {
  id: string;
  page_id: string;
  name: string;
  sort_order: number;
  content: any;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

const AdminSections = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pages, setPages] = useState<Page[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(searchParams.get('page'));
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    content: '{}',
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('id, title, slug')
        .eq('is_deleted', false)
        .order('title');

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };

  const fetchSections = async () => {
    if (!selectedPageId) {
      setSections([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('page_id', selectedPageId)
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
    fetchPages();
  }, []);

  useEffect(() => {
    if (selectedPageId) {
      setSearchParams({ page: selectedPageId });
    } else {
      setSearchParams({});
    }
    fetchSections();
  }, [selectedPageId]);

  const handleOpenModal = (section?: Section) => {
    if (section) {
      setEditingSection(section);
      setFormData({
        name: section.name,
        content: JSON.stringify(section.content, null, 2),
      });
    } else {
      setEditingSection(null);
      setFormData({ name: '', content: '{}' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSection(null);
    setFormData({ name: '', content: '{}' });
  };

  const handleSave = async () => {
    if (!formData.name || !selectedPageId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(formData.content);
    } catch {
      toast({
        title: 'Validation Error',
        description: 'Content must be valid JSON.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      if (editingSection) {
        const { error } = await supabase
          .from('sections')
          .update({ name: formData.name, content: parsedContent })
          .eq('id', editingSection.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Section updated successfully.' });
      } else {
        const maxOrder = sections.length > 0 ? Math.max(...sections.map(s => s.sort_order)) + 1 : 0;
        const { error } = await supabase
          .from('sections')
          .insert({
            page_id: selectedPageId,
            name: formData.name,
            content: parsedContent,
            sort_order: maxOrder,
          });

        if (error) throw error;
        toast({ title: 'Success', description: 'Section created successfully.' });
      }

      handleCloseModal();
      fetchSections();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save section.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (section: Section) => {
    if (!confirm(`Are you sure you want to delete "${section.name}"?`)) return;

    try {
      const { error } = await supabase
        .from('sections')
        .update({ is_deleted: true })
        .eq('id', section.id);

      if (error) throw error;
      toast({ title: 'Deleted', description: 'Section moved to recycle bin.' });
      fetchSections();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete section.',
        variant: 'destructive',
      });
    }
  };

  const filteredSections = sections.filter((section) =>
    section.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedPage = pages.find(p => p.id === selectedPageId);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              Sections
            </h1>
            <p className="text-muted-foreground">
              Manage content sections for each page.
            </p>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            className="btn-gold"
            disabled={!selectedPageId}
          >
            <Plus size={18} className="mr-2" />
            New Section
          </Button>
        </div>

        {/* Page Selector */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-xs">
            <select
              value={selectedPageId || ''}
              onChange={(e) => setSelectedPageId(e.target.value || null)}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-foreground appearance-none cursor-pointer focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Select a page...</option>
              {pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.title}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
          {selectedPageId && (
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card"
              />
            </div>
          )}
        </div>

        {/* Sections List */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {!selectedPageId ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Select a page to view its sections.</p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filteredSections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No sections found for this page.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredSections.map((section) => (
                <div
                  key={section.id}
                  className="p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground cursor-grab">
                        <GripVertical size={18} />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{section.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {Object.keys(section.content).length} content fields
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(section)}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(section)}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-muted rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-xl font-semibold text-foreground">
                    {editingSection ? 'Edit Section' : 'New Section'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Section Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., hero, features, cta"
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Content (JSON) *
                    </label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder='{"heading": "Welcome", "subheading": "...", "body": "..."}'
                      className="bg-background font-mono text-sm min-h-[200px]"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter content as JSON. Common fields: heading, subheading, body, buttonText, etc.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving} className="btn-gold">
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default AdminSections;
