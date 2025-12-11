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
  Type,
  Link as LinkIcon,
  Palette,
  Video,
  Save,
  Eye,
  Clock,
  EyeOff,
  FileText,
  LayoutGrid,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { SectionPreview } from '@/components/admin/SectionPreview';

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
  buttonStyle?: 'primary' | 'secondary';
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  videoUrl?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  overlayOpacity?: string;
  isPublished?: boolean;
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

type FieldType = 'text' | 'textarea' | 'url' | 'image' | 'video' | 'color' | 'select' | 'number';

interface ContentField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

// Comprehensive section templates for all content types
const SECTION_TEMPLATES: Record<string, ContentField[]> = {
  hero: [
    { key: 'heading', label: 'Main Heading (Line 1)', type: 'text', placeholder: 'Cinematic Stories.' },
    { key: 'headingHighlight', label: 'Heading Highlight (Line 2)', type: 'text', placeholder: 'Impactful Visuals.' },
    { key: 'headingLine3', label: 'Heading Line 3', type: 'text', placeholder: 'Complete Media Solutions.' },
    { key: 'tagline', label: 'Tagline', type: 'text', placeholder: 'Cinematic Media. Unified Creators. National Impact.' },
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'Supporting tagline' },
    { key: 'body', label: 'Body Text', type: 'textarea', placeholder: 'Additional description' },
    { key: 'primaryButtonText', label: 'Primary CTA Text', type: 'text', placeholder: 'Explore Portfolio' },
    { key: 'primaryButtonUrl', label: 'Primary CTA URL', type: 'url', placeholder: '/portfolio' },
    { key: 'secondaryButtonText', label: 'Secondary CTA Text', type: 'text', placeholder: 'Book a Project' },
    { key: 'secondaryButtonUrl', label: 'Secondary CTA URL', type: 'url', placeholder: '/contact' },
    { key: 'backgroundImage', label: 'Background Image', type: 'image' },
    { key: 'videoUrl', label: 'Background Video (Upload)', type: 'video' },
    { key: 'overlayOpacity', label: 'Overlay Opacity (0-1)', type: 'number', placeholder: '0.7' },
  ],
  about: [
    { key: 'heading', label: 'Heading', type: 'text', placeholder: 'About Us' },
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'Our Story' },
    { key: 'body', label: 'Body Text', type: 'textarea', placeholder: 'Tell your story...' },
    { key: 'imageUrl', label: 'Featured Image', type: 'image' },
    { key: 'imageAlt', label: 'Image Alt Text', type: 'text', placeholder: 'Description for accessibility' },
    { key: 'buttonText', label: 'CTA Button Text', type: 'text', placeholder: 'Learn More' },
    { key: 'buttonUrl', label: 'CTA Button URL', type: 'url', placeholder: '/contact' },
  ],
  services: [
    { key: 'heading', label: 'Section Heading', type: 'text', placeholder: 'Our Services' },
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'What we offer' },
    { key: 'body', label: 'Introduction Text', type: 'textarea', placeholder: 'Brief intro...' },
    { key: 'backgroundImage', label: 'Background Image', type: 'image' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color', placeholder: '#000000' },
  ],
  cta: [
    { key: 'heading', label: 'CTA Heading', type: 'text', placeholder: 'Ready to get started?' },
    { key: 'subheading', label: 'CTA Subheading', type: 'text', placeholder: 'Contact us today' },
    { key: 'body', label: 'Supporting Text', type: 'textarea', placeholder: 'Additional info...' },
    { key: 'buttonText', label: 'Button Text', type: 'text', placeholder: 'Contact Us' },
    { key: 'buttonUrl', label: 'Button URL', type: 'url', placeholder: '/contact' },
    { key: 'buttonStyle', label: 'Button Style', type: 'select', options: [
      { value: 'primary', label: 'Primary (Gold)' },
      { value: 'secondary', label: 'Secondary (Outline)' },
    ]},
    { key: 'backgroundColor', label: 'Background Color', type: 'color', placeholder: '#ed5041' },
    { key: 'backgroundImage', label: 'Background Image', type: 'image' },
  ],
  gallery: [
    { key: 'heading', label: 'Gallery Heading', type: 'text', placeholder: 'Our Work' },
    { key: 'subheading', label: 'Gallery Subheading', type: 'text', placeholder: 'Featured projects' },
    { key: 'body', label: 'Introduction', type: 'textarea', placeholder: 'Browse our portfolio...' },
  ],
  testimonials: [
    { key: 'heading', label: 'Section Heading', type: 'text', placeholder: 'What Clients Say' },
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'Testimonials' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
  ],
  contact: [
    { key: 'heading', label: 'Contact Heading', type: 'text', placeholder: 'Get in Touch' },
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'We\'d love to hear from you' },
    { key: 'body', label: 'Contact Info Text', type: 'textarea', placeholder: 'Email, phone, address...' },
    { key: 'buttonText', label: 'Submit Button Text', type: 'text', placeholder: 'Send Message' },
    { key: 'backgroundImage', label: 'Background Image', type: 'image' },
  ],
  features: [
    { key: 'heading', label: 'Section Heading', type: 'text', placeholder: 'Why Choose Us' },
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'Our advantages' },
    { key: 'body', label: 'Introduction Text', type: 'textarea', placeholder: 'Brief intro...' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
  ],
  podcast: [
    { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Podcast Studio' },
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'Professional Audio' },
    { key: 'body', label: 'Description', type: 'textarea', placeholder: 'Describe the studio...' },
    { key: 'imageUrl', label: 'Featured Image', type: 'image' },
    { key: 'videoUrl', label: 'Video Tour', type: 'video' },
    { key: 'buttonText', label: 'CTA Text', type: 'text', placeholder: 'Book Studio' },
    { key: 'buttonUrl', label: 'CTA URL', type: 'url', placeholder: '/contact' },
  ],
  studio: [
    { key: 'heading', label: 'Studio Name', type: 'text', placeholder: 'Production Studio' },
    { key: 'subheading', label: 'Studio Type', type: 'text', placeholder: 'Video Production' },
    { key: 'body', label: 'Description', type: 'textarea', placeholder: 'Studio features...' },
    { key: 'imageUrl', label: 'Studio Image', type: 'image' },
    { key: 'videoUrl', label: 'Studio Tour Video', type: 'video' },
    { key: 'buttonText', label: 'Book Button Text', type: 'text', placeholder: 'Book Now' },
    { key: 'buttonUrl', label: 'Book Button URL', type: 'url' },
  ],
  team: [
    { key: 'heading', label: 'Section Heading', type: 'text', placeholder: 'Meet Our Team' },
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'The people behind the magic' },
    { key: 'body', label: 'Introduction', type: 'textarea' },
  ],
  mission: [
    { key: 'heading', label: 'Mission Heading', type: 'text', placeholder: 'Our Mission' },
    { key: 'subheading', label: 'Subheading', type: 'text' },
    { key: 'body', label: 'Mission Statement', type: 'textarea', placeholder: 'Our mission is...' },
    { key: 'imageUrl', label: 'Image', type: 'image' },
  ],
  benefits: [
    { key: 'heading', label: 'Section Heading', type: 'text', placeholder: 'Benefits' },
    { key: 'subheading', label: 'Subheading', type: 'text' },
    { key: 'body', label: 'Introduction', type: 'textarea' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
  ],
  process: [
    { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Our Process' },
    { key: 'subheading', label: 'Subheading', type: 'text' },
    { key: 'body', label: 'Description', type: 'textarea' },
  ],
  default: [
    { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Section Title' },
    { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'Section subtitle' },
    { key: 'body', label: 'Body Text', type: 'textarea', placeholder: 'Section content...' },
    { key: 'imageUrl', label: 'Image', type: 'image' },
    { key: 'imageAlt', label: 'Image Alt Text', type: 'text' },
    { key: 'videoUrl', label: 'Video', type: 'video' },
    { key: 'buttonText', label: 'Button Text', type: 'text', placeholder: 'Click here' },
    { key: 'buttonUrl', label: 'Button URL', type: 'url', placeholder: '/page' },
    { key: 'buttonStyle', label: 'Button Style', type: 'select', options: [
      { value: 'primary', label: 'Primary' },
      { value: 'secondary', label: 'Secondary' },
    ]},
    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
    { key: 'backgroundImage', label: 'Background Image', type: 'image' },
  ],
};

const getFieldIcon = (type: FieldType) => {
  switch (type) {
    case 'text': return <Type size={14} />;
    case 'textarea': return <FileText size={14} />;
    case 'url': return <LinkIcon size={14} />;
    case 'color': return <Palette size={14} />;
    case 'video': return <Video size={14} />;
    case 'select': return <LayoutGrid size={14} />;
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
    content: { isPublished: true },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
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
      
      // Auto-select first page if none selected
      if (!selectedPageId && data && data.length > 0) {
        setSelectedPageId(data[0].id);
      }
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
    setIsLoading(true);
    fetchSections();
  }, [selectedPageId]);

  const handleOpenModal = (section?: Section) => {
    if (section) {
      setEditingSection(section);
      setFormData({
        name: section.name,
        content: { isPublished: true, ...section.content },
      });
    } else {
      setEditingSection(null);
      setFormData({ name: '', content: { isPublished: true } });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSection(null);
    setFormData({ name: '', content: { isPublished: true } });
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
        toast({ title: 'Success', description: 'Section updated and published successfully.' });
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
    
    try {
      const updates = newOrder.map((section, index) => 
        supabase
          .from('sections')
          .update({ sort_order: index })
          .eq('id', section.id)
      );
      
      await Promise.all(updates);
      toast({ title: 'Order updated', description: 'Section order saved.' });
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

  const updateContentField = (key: string, value: string | boolean) => {
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

  const renderField = (field: ContentField) => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            value={formData.content[field.key] || ''}
            onChange={(e) => updateContentField(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="bg-background min-h-[100px]"
          />
        );
      
      case 'color':
        return (
          <div className="flex gap-2">
            <Input
              type="color"
              value={formData.content[field.key] || '#000000'}
              onChange={(e) => updateContentField(field.key, e.target.value)}
              className="w-14 h-10 p-1 bg-background cursor-pointer"
            />
            <Input
              value={formData.content[field.key] || ''}
              onChange={(e) => updateContentField(field.key, e.target.value)}
              placeholder={field.placeholder || '#000000'}
              className="bg-background flex-1"
            />
          </div>
        );
      
      case 'image':
        return (
          <MediaUploader
            value={formData.content[field.key] || ''}
            onChange={(url) => updateContentField(field.key, url)}
            placeholder={field.placeholder}
            mediaType="image"
            maxSizeMB={10}
            label={field.label}
          />
        );
      
      case 'video':
        return (
          <MediaUploader
            value={formData.content[field.key] || ''}
            onChange={(url) => updateContentField(field.key, url)}
            placeholder={field.placeholder}
            mediaType="video"
            maxSizeMB={50}
            label={field.label}
          />
        );
      
      case 'select':
        return (
          <select
            value={formData.content[field.key] || ''}
            onChange={(e) => updateContentField(field.key, e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
          >
            <option value="">Select...</option>
            {field.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      
      case 'number':
        return (
          <Input
            type="number"
            step="0.1"
            min="0"
            max="1"
            value={formData.content[field.key] || ''}
            onChange={(e) => updateContentField(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="bg-background"
          />
        );
      
      default:
        return (
          <Input
            value={formData.content[field.key] || ''}
            onChange={(e) => updateContentField(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="bg-background"
          />
        );
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              Full Section Editor
            </h1>
            <p className="text-muted-foreground">
              Edit all content, media, CTAs, and layouts for every page section.
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

        {/* Page Selector & Search */}
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
                  {page.title} (/{page.slug})
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

        {/* Page Info */}
        {selectedPage && (
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-medium text-foreground">{selectedPage.title}</h2>
                <p className="text-sm text-muted-foreground">/{selectedPage.slug} • {filteredSections.length} section(s)</p>
              </div>
              <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                Drag to reorder
              </span>
            </div>
          </div>
        )}

        {/* Sections List with Drag & Drop */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {!selectedPageId ? (
            <div className="text-center py-12">
              <LayoutGrid size={48} className="mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">Select a page to view and edit its sections.</p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filteredSections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No sections found for this page.</p>
              <Button onClick={() => handleOpenModal()} variant="outline">
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
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground hover:text-foreground">
                        <GripVertical size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground capitalize">{section.name}</h3>
                          {section.content?.isPublished === false && (
                            <span className="text-xs px-1.5 py-0.5 bg-yellow-500/20 text-yellow-500 rounded">
                              Draft
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-sm text-muted-foreground">
                            {Object.keys(section.content || {}).filter(k => section.content[k]).length} fields
                          </p>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(section.updated_at).toLocaleDateString()} {new Date(section.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(section);
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil size={16} className="mr-1" />
                        Edit
                      </Button>
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

        {/* Full-Featured Edit Modal */}
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
                className="bg-card border border-border rounded-xl w-full max-w-6xl my-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-foreground">
                      {editingSection ? `Edit: ${editingSection.name}` : 'Create New Section'}
                    </h2>
                    {selectedPage && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Page: {selectedPage.title} (/{selectedPage.slug})
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? <EyeOff size={16} className="mr-2" /> : <Eye size={16} className="mr-2" />}
                      {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </Button>
                    <button
                      onClick={handleCloseModal}
                      className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className={`grid ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
                  {/* Form Section */}
                  <div className="p-6 max-h-[70vh] overflow-y-auto border-r border-border">
                    <div className="space-y-6">
                      {/* Section Name */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Section Name *
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., hero, about, services, cta, gallery"
                          className="bg-background"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Template fields load automatically based on name (hero, about, services, etc.)
                        </p>
                      </div>

                      {/* Published Toggle */}
                      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-foreground">Published</label>
                          <p className="text-xs text-muted-foreground">Unpublished sections are hidden from visitors</p>
                        </div>
                        <Switch
                          checked={formData.content.isPublished !== false}
                          onCheckedChange={(checked) => updateContentField('isPublished', checked)}
                        />
                      </div>

                      {/* Dynamic Content Fields */}
                      {formData.name && (
                        <div className="space-y-5">
                          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2 flex items-center gap-2">
                            <Type size={16} />
                            Content Fields
                          </h3>
                          {getTemplateFields(formData.name).map((field) => (
                            <div key={field.key}>
                              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                                {field.type !== 'image' && getFieldIcon(field.type)}
                                {field.label}
                              </label>
                              {renderField(field)}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Raw JSON Editor (Advanced) */}
                      <details className="group border border-border rounded-lg">
                        <summary className="p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground flex items-center gap-2">
                          <FileText size={16} />
                          Advanced: Raw JSON Editor
                        </summary>
                        <div className="p-4 pt-0">
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
                            className="bg-background font-mono text-xs min-h-[200px]"
                          />
                        </div>
                      </details>
                    </div>
                  </div>

                  {/* Live Preview Section */}
                  {showPreview && (
                    <div className="p-6 bg-muted/20 max-h-[70vh] overflow-y-auto">
                      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Eye size={16} />
                        Live Preview
                      </h3>
                      <SectionPreview 
                        sectionName={formData.name || 'section'} 
                        content={formData.content} 
                      />
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
                          {editingSection ? 'Save & Publish' : 'Create Section'}
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
