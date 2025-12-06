import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  X,
  ChevronDown,
  GripVertical,
  Image as ImageIcon,
  Type,
  Link as LinkIcon,
  Palette,
  Video,
  Save,
  Eye,
  Clock,
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

interface SectionContent {
  heading?: string;
  subheading?: string;
  body?: string;
  buttonText?: string;
  buttonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  videoUrl?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  items?: Array<{
    title?: string;
    description?: string;
    icon?: string;
    imageUrl?: string;
  }>;
  [key: string]: any;
}

interface Section {
  id: string;
  page_id: string;
  name: string;
  sort_order: number;
  content: SectionContent;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

type FieldType = 'text' | 'textarea' | 'url' | 'image' | 'video' | 'color' | 'items';

interface ContentField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
}

const SECTION_TEMPLATES: Record<string, ContentField[]> = {
  hero: [
    { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Main headline' },
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'Supporting text' },
    { key: 'body', label: 'Body Text', type: 'textarea', placeholder: 'Additional description' },
    { key: 'buttonText', label: 'Primary Button Text', type: 'text', placeholder: 'Get Started' },
    { key: 'buttonUrl', label: 'Primary Button URL', type: 'url', placeholder: '/contact' },
    { key: 'secondaryButtonText', label: 'Secondary Button Text', type: 'text', placeholder: 'Learn More' },
    { key: 'secondaryButtonUrl', label: 'Secondary Button URL', type: 'url', placeholder: '/about' },
    { key: 'backgroundImage', label: 'Background Image', type: 'image', placeholder: 'https://...' },
    { key: 'videoUrl', label: 'Background Video', type: 'video', placeholder: 'https://...' },
  ],
  about: [
    { key: 'heading', label: 'Heading', type: 'text', placeholder: 'About Us' },
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'Our Story' },
    { key: 'body', label: 'Body Text', type: 'textarea', placeholder: 'Tell your story...' },
    { key: 'imageUrl', label: 'Image', type: 'image', placeholder: 'https://...' },
    { key: 'imageAlt', label: 'Image Alt Text', type: 'text', placeholder: 'Image description' },
  ],
  services: [
    { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Our Services' },
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'What we offer' },
    { key: 'body', label: 'Introduction', type: 'textarea', placeholder: 'Brief intro...' },
  ],
  cta: [
    { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Ready to get started?' },
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'Contact us today' },
    { key: 'buttonText', label: 'Button Text', type: 'text', placeholder: 'Contact Us' },
    { key: 'buttonUrl', label: 'Button URL', type: 'url', placeholder: '/contact' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color', placeholder: '#000000' },
  ],
  gallery: [
    { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Our Work' },
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'Featured projects' },
  ],
  testimonials: [
    { key: 'heading', label: 'Heading', type: 'text', placeholder: 'What Clients Say' },
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'Testimonials' },
  ],
  contact: [
    { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Get in Touch' },
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'We\'d love to hear from you' },
    { key: 'body', label: 'Body Text', type: 'textarea', placeholder: 'Contact information...' },
    { key: 'buttonText', label: 'Submit Button Text', type: 'text', placeholder: 'Send Message' },
  ],
  features: [
    { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Why Choose Us' },
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'Our advantages' },
    { key: 'body', label: 'Introduction', type: 'textarea', placeholder: 'Brief intro...' },
  ],
  default: [
    { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Section Title' },
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'Section subtitle' },
    { key: 'body', label: 'Body Text', type: 'textarea', placeholder: 'Section content...' },
    { key: 'imageUrl', label: 'Image URL', type: 'image', placeholder: 'https://...' },
    { key: 'buttonText', label: 'Button Text', type: 'text', placeholder: 'Click here' },
    { key: 'buttonUrl', label: 'Button URL', type: 'url', placeholder: '/page' },
  ],
};

const getFieldIcon = (type: FieldType) => {
  switch (type) {
    case 'text': return <Type size={14} />;
    case 'textarea': return <Type size={14} />;
    case 'url': return <LinkIcon size={14} />;
    case 'image': return <ImageIcon size={14} />;
    case 'video': return <Video size={14} />;
    case 'color': return <Palette size={14} />;
    default: return <Type size={14} />;
  }
};

const AdminSections = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pages, setPages] = useState<Page[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(searchParams.get('page'));
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    content: SectionContent;
  }>({
    name: '',
    content: {},
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
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
      setSections((data || []) as Section[]);
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
        content: section.content || {},
      });
    } else {
      setEditingSection(null);
      setFormData({ name: '', content: {} });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSection(null);
    setFormData({ name: '', content: {} });
    setShowPreview(false);
  };

  const handleSave = async () => {
    if (!formData.name || !selectedPageId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in the section name.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      if (editingSection) {
        const { error } = await supabase
          .from('sections')
          .update({ 
            name: formData.name, 
            content: formData.content,
            updated_at: new Date().toISOString(),
          })
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
            content: formData.content,
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

  const handleReorder = useCallback(async (newOrder: Section[]) => {
    setSections(newOrder);
    
    // Update sort_order in database
    try {
      const updates = newOrder.map((section, index) => ({
        id: section.id,
        sort_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from('sections')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update section order.',
        variant: 'destructive',
      });
      fetchSections();
    }
  }, []);

  const updateContentField = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [key]: value,
      },
    }));
  };

  const getTemplateFields = (sectionName: string): ContentField[] => {
    const normalizedName = sectionName.toLowerCase().trim();
    for (const [template, fields] of Object.entries(SECTION_TEMPLATES)) {
      if (normalizedName.includes(template)) {
        return fields;
      }
    }
    return SECTION_TEMPLATES.default;
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
              Section Editor
            </h1>
            <p className="text-muted-foreground">
              Full control over all page sections with visual editing.
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

        {/* Sections List with Drag & Drop */}
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
              <Button
                onClick={() => handleOpenModal()}
                className="mt-4"
                variant="outline"
              >
                <Plus size={16} className="mr-2" />
                Create First Section
              </Button>
            </div>
          ) : (
            <Reorder.Group
              axis="y"
              values={filteredSections}
              onReorder={handleReorder}
              className="divide-y divide-border"
            >
              {filteredSections.map((section) => (
                <Reorder.Item
                  key={section.id}
                  value={section}
                  className="p-4 hover:bg-muted/30 transition-colors cursor-grab active:cursor-grabbing"
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={() => setIsDragging(false)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground">
                        <GripVertical size={18} />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{section.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-sm text-muted-foreground">
                            {Object.keys(section.content || {}).length} content fields
                          </p>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(section.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(section);
                        }}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(section);
                        }}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-muted rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </div>

        {/* Enhanced Edit Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-card border border-border rounded-xl w-full max-w-4xl my-8"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-foreground">
                      {editingSection ? 'Edit Section' : 'New Section'}
                    </h2>
                    {selectedPage && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Page: {selectedPage.title}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      <Eye size={16} className="mr-2" />
                      {showPreview ? 'Hide Preview' : 'Preview'}
                    </Button>
                    <button
                      onClick={handleCloseModal}
                      className="p-2 text-muted-foreground hover:text-foreground"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className={`grid ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'} divide-x divide-border`}>
                  {/* Form Section */}
                  <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-6">
                      {/* Section Name */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Section Name *
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., hero, about, services, cta"
                          className="bg-background"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Template fields will auto-load based on section name
                        </p>
                      </div>

                      {/* Dynamic Content Fields */}
                      {formData.name && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">
                            Content Fields
                          </h3>
                          {getTemplateFields(formData.name).map((field) => (
                            <div key={field.key}>
                              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                                {getFieldIcon(field.type)}
                                {field.label}
                              </label>
                              {field.type === 'textarea' ? (
                                <Textarea
                                  value={formData.content[field.key] || ''}
                                  onChange={(e) => updateContentField(field.key, e.target.value)}
                                  placeholder={field.placeholder}
                                  className="bg-background min-h-[100px]"
                                />
                              ) : field.type === 'color' ? (
                                <div className="flex gap-2">
                                  <Input
                                    type="color"
                                    value={formData.content[field.key] || '#000000'}
                                    onChange={(e) => updateContentField(field.key, e.target.value)}
                                    className="w-12 h-10 p-1 bg-background"
                                  />
                                  <Input
                                    value={formData.content[field.key] || ''}
                                    onChange={(e) => updateContentField(field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                    className="bg-background flex-1"
                                  />
                                </div>
                              ) : (
                                <Input
                                  value={formData.content[field.key] || ''}
                                  onChange={(e) => updateContentField(field.key, e.target.value)}
                                  placeholder={field.placeholder}
                                  className="bg-background"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Raw JSON Editor (Advanced) */}
                      <details className="group">
                        <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground">
                          Advanced: Raw JSON Editor
                        </summary>
                        <div className="mt-3">
                          <Textarea
                            value={JSON.stringify(formData.content, null, 2)}
                            onChange={(e) => {
                              try {
                                const parsed = JSON.parse(e.target.value);
                                setFormData(prev => ({ ...prev, content: parsed }));
                              } catch {
                                // Invalid JSON, ignore
                              }
                            }}
                            className="bg-background font-mono text-xs min-h-[150px]"
                          />
                        </div>
                      </details>
                    </div>
                  </div>

                  {/* Preview Section */}
                  {showPreview && (
                    <div className="p-6 bg-background/50 max-h-[70vh] overflow-y-auto">
                      <h3 className="text-sm font-medium text-muted-foreground mb-4">Live Preview</h3>
                      <div className="bg-background border border-border rounded-lg p-6">
                        {formData.content.backgroundImage && (
                          <div className="mb-4 aspect-video rounded-lg overflow-hidden bg-muted">
                            <img
                              src={formData.content.backgroundImage}
                              alt="Background"
                              className="w-full h-full object-cover"
                              onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                          </div>
                        )}
                        {formData.content.heading && (
                          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                            {formData.content.heading}
                          </h2>
                        )}
                        {formData.content.subheading && (
                          <h3 className="text-lg text-muted-foreground mb-3">
                            {formData.content.subheading}
                          </h3>
                        )}
                        {formData.content.body && (
                          <p className="text-muted-foreground mb-4">
                            {formData.content.body}
                          </p>
                        )}
                        {formData.content.imageUrl && (
                          <div className="mb-4 aspect-video rounded-lg overflow-hidden bg-muted">
                            <img
                              src={formData.content.imageUrl}
                              alt={formData.content.imageAlt || 'Image'}
                              className="w-full h-full object-cover"
                              onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                          </div>
                        )}
                        <div className="flex gap-3">
                          {formData.content.buttonText && (
                            <span className="btn-gold text-sm">
                              {formData.content.buttonText}
                            </span>
                          )}
                          {formData.content.secondaryButtonText && (
                            <span className="btn-outline-gold text-sm">
                              {formData.content.secondaryButtonText}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
                  <div className="text-xs text-muted-foreground">
                    {editingSection && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        Last updated: {new Date(editingSection.updated_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
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
                        <>
                          <Save size={16} className="mr-2" />
                          {editingSection ? 'Update Section' : 'Create Section'}
                        </>
                      )}
                    </Button>
                  </div>
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