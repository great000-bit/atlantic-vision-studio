import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pencil,
  Trash2,
  Loader2,
  Search,
  X,
  Star,
  Upload,
  Video,
  Image as ImageIcon,
  Type,
  Eye,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';

interface SectionContent {
  heading?: string;
  subheading?: string;
  body?: string;
  buttonText?: string;
  buttonUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  [key: string]: any;
}

interface Section {
  id: string;
  name: string;
  content: SectionContent;
  sort_order: number;
  updated_at: string;
}

interface PageSectionCardsProps {
  pageSlug: string;
  pageTitle: string;
  pageDescription: string;
  sections: Section[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const PageSectionCards = ({
  pageSlug,
  pageTitle,
  pageDescription,
  sections,
  isLoading,
  onRefresh,
}: PageSectionCardsProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [formData, setFormData] = useState<SectionContent>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const filteredSections = sections.filter(
    (section) =>
      section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content?.heading?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (section: Section) => {
    setEditingSection(section);
    setFormData({ ...section.content });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSection(null);
    setFormData({});
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string = 'imageUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image (JPEG, PNG, GIF, WebP)',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 10MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingImage(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${pageSlug}-${editingSection?.name}-${Date.now()}.${fileExt}`;
      const filePath = `sections/${fileName}`;

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const { error: uploadError } = await supabase.storage
        .from('cms-uploads')
        .upload(filePath, file, { upsert: true });

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('cms-uploads')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, [fieldKey]: publicUrl }));
      setUploadProgress(100);

      toast({
        title: 'Image uploaded',
        description: 'Image has been uploaded successfully.',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (!validVideoTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a video (MP4, WebM, MOV, AVI)',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload a video smaller than 100MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingVideo(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${pageSlug}-${editingSection?.name}-video-${Date.now()}.${fileExt}`;
      const filePath = `sections/videos/${fileName}`;

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 5, 90));
      }, 200);

      const { error: uploadError } = await supabase.storage
        .from('cms-uploads')
        .upload(filePath, file, { upsert: true });

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('cms-uploads')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, videoUrl: publicUrl }));
      setUploadProgress(100);

      toast({
        title: 'Video uploaded',
        description: 'Video has been uploaded successfully.',
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload video. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingVideo(false);
      setUploadProgress(0);
    }
  };

  const handleSave = async () => {
    if (!editingSection) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('sections')
        .update({
          content: formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingSection.id);

      if (error) throw error;

      toast({
        title: 'Section updated',
        description: 'Changes have been saved successfully.',
      });

      handleCloseModal();
      onRefresh();
    } catch (error) {
      console.error('Error saving section:', error);
      toast({
        title: 'Error',
        description: 'Failed to save changes.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getSectionThumbnail = (section: Section) => {
    if (section.content?.imageUrl) return section.content.imageUrl;
    if (section.content?.backgroundImage) return section.content.backgroundImage;
    if (section.content?.videoUrl) return null; // Will show video icon
    return null;
  };

  const formatSectionName = (name: string) => {
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">{pageTitle}</h1>
          <p className="text-muted-foreground mt-1">{pageDescription}</p>
        </div>
        <Button onClick={() => window.open(`/${pageSlug === 'home' ? '' : pageSlug}`, '_blank')} variant="outline">
          <Eye size={16} className="mr-2" />
          View Live Page
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Search sections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Section Cards */}
      {filteredSections.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No sections found for this page.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-colors group"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-muted relative overflow-hidden">
                {getSectionThumbnail(section) ? (
                  <img
                    src={getSectionThumbnail(section)!}
                    alt={section.name}
                    className="w-full h-full object-cover"
                  />
                ) : section.content?.videoUrl ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <Video className="w-12 h-12 text-primary" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                    <Type className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                
                {/* Section Type Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded">
                    {formatSectionName(section.name)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-medium text-foreground truncate">
                  {section.content?.heading || formatSectionName(section.name)}
                </h3>
                {section.content?.subheading && (
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {section.content.subheading}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Updated: {new Date(section.updated_at).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenModal(section)}
                    className="flex-1"
                  >
                    <Pencil size={14} className="mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && editingSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Edit {formatSectionName(editingSection.name)}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {pageTitle} • {formatSectionName(editingSection.name)} Section
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleCloseModal}>
                  <X size={18} />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                {/* Text Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Label (Small Text Above Heading)
                    </label>
                    <Input
                      value={formData.label || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
                      placeholder="e.g., Our Services, About Us"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Heading
                      </label>
                      <Input
                        value={formData.heading || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, heading: e.target.value }))}
                        placeholder="Section heading"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Heading Highlight (Gold Text)
                      </label>
                      <Input
                        value={formData.headingHighlight || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, headingHighlight: e.target.value }))}
                        placeholder="Highlighted part"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subheading
                    </label>
                    <Input
                      value={formData.subheading || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, subheading: e.target.value }))}
                      placeholder="Section subheading"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Body Text
                    </label>
                    <Textarea
                      value={formData.body || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, body: e.target.value }))}
                      placeholder="Section body content"
                      rows={4}
                    />
                  </div>
                </div>

                {/* CTA Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Button Text
                    </label>
                    <Input
                      value={formData.buttonText || formData.ctaText || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, buttonText: e.target.value, ctaText: e.target.value }))}
                      placeholder="Button label"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Button URL
                    </label>
                    <Input
                      value={formData.buttonUrl || formData.ctaUrl || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, buttonUrl: e.target.value, ctaUrl: e.target.value }))}
                      placeholder="/contact"
                    />
                  </div>
                </div>

                {/* Features List (if present in content) */}
                {(formData.features || (Array.isArray(formData.items) && typeof formData.items[0] === 'string')) && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Features / Items (one per line)
                    </label>
                    <Textarea
                      value={
                        Array.isArray(formData.features) 
                          ? formData.features.join('\n') 
                          : Array.isArray(formData.items) && typeof formData.items[0] === 'string'
                            ? formData.items.join('\n')
                            : ''
                      }
                      onChange={(e) => {
                        const items = e.target.value.split('\n').filter(Boolean);
                        if (formData.features) {
                          setFormData((prev) => ({ ...prev, features: items }));
                        } else {
                          setFormData((prev) => ({ ...prev, items }));
                        }
                      }}
                      placeholder="Enter one feature per line"
                      rows={4}
                    />
                  </div>
                )}

                {/* Benefits Editor (Why Choose Us section) */}
                {Array.isArray(formData.benefits) && (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-foreground">
                      Benefits / Features
                    </label>
                    {formData.benefits.map((benefit: { icon: string; title: string; description: string }, idx: number) => (
                      <div key={idx} className="p-4 bg-muted/50 rounded-lg space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            value={benefit.title}
                            onChange={(e) => {
                              const newBenefits = [...formData.benefits];
                              newBenefits[idx] = { ...newBenefits[idx], title: e.target.value };
                              setFormData((prev) => ({ ...prev, benefits: newBenefits }));
                            }}
                            placeholder="Title"
                          />
                          <Input
                            value={benefit.icon}
                            onChange={(e) => {
                              const newBenefits = [...formData.benefits];
                              newBenefits[idx] = { ...newBenefits[idx], icon: e.target.value };
                              setFormData((prev) => ({ ...prev, benefits: newBenefits }));
                            }}
                            placeholder="Icon (Users, Award, Shield, Zap, Clock, Check)"
                          />
                        </div>
                        <Textarea
                          value={benefit.description}
                          onChange={(e) => {
                            const newBenefits = [...formData.benefits];
                            newBenefits[idx] = { ...newBenefits[idx], description: e.target.value };
                            setFormData((prev) => ({ ...prev, benefits: newBenefits }));
                          }}
                          placeholder="Description"
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Why Choose Us Images Editor */}
                {Array.isArray(formData.images) && (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-foreground">
                      Section Images
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {formData.images.map((imageUrl: string, idx: number) => (
                        <div key={idx} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                            {imageUrl ? (
                              <img src={imageUrl} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id={`section-image-${idx}`}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              
                              const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                              if (!validTypes.includes(file.type)) {
                                toast({ title: 'Invalid file', description: 'Please upload an image', variant: 'destructive' });
                                return;
                              }
                              
                              try {
                                const fileExt = file.name.split('.').pop();
                                const fileName = `section-image-${idx}-${Date.now()}.${fileExt}`;
                                const filePath = `sections/images/${fileName}`;
                                
                                const { error } = await supabase.storage.from('cms-uploads').upload(filePath, file, { upsert: true });
                                if (error) throw error;
                                
                                const { data: { publicUrl } } = supabase.storage.from('cms-uploads').getPublicUrl(filePath);
                                
                                const newImages = [...formData.images];
                                newImages[idx] = publicUrl;
                                setFormData((prev) => ({ ...prev, images: newImages }));
                                
                                toast({ title: 'Image uploaded', description: `Updated image ${idx + 1}` });
                              } catch (err) {
                                toast({ title: 'Upload failed', description: 'Please try again', variant: 'destructive' });
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => document.getElementById(`section-image-${idx}`)?.click()}
                          >
                            <Upload size={14} className="mr-1" />
                            Replace
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects Editor (Featured Work / Portfolio section) */}
                {Array.isArray(formData.projects) && (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-foreground">
                      Portfolio Projects
                    </label>
                    {formData.projects.map((project: { id: number; title: string; category: string; image: string }, idx: number) => (
                      <div key={idx} className="p-4 bg-muted/50 rounded-lg space-y-3">
                        <div className="flex items-center gap-4">
                          <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            {project.image ? (
                              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <Input
                              value={project.title}
                              onChange={(e) => {
                                const newProjects = [...formData.projects];
                                newProjects[idx] = { ...newProjects[idx], title: e.target.value };
                                setFormData((prev) => ({ ...prev, projects: newProjects }));
                              }}
                              placeholder="Project Title"
                              className="h-9"
                            />
                            <Input
                              value={project.category}
                              onChange={(e) => {
                                const newProjects = [...formData.projects];
                                newProjects[idx] = { ...newProjects[idx], category: e.target.value };
                                setFormData((prev) => ({ ...prev, projects: newProjects }));
                              }}
                              placeholder="Category (Tourism Media, Event Coverage, etc.)"
                              className="h-9"
                            />
                          </div>
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id={`project-image-${idx}`}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              
                              const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                              if (!validTypes.includes(file.type)) {
                                toast({ title: 'Invalid file', description: 'Please upload an image', variant: 'destructive' });
                                return;
                              }
                              
                              try {
                                const fileExt = file.name.split('.').pop();
                                const fileName = `project-${idx}-${Date.now()}.${fileExt}`;
                                const filePath = `sections/projects/${fileName}`;
                                
                                const { error } = await supabase.storage.from('cms-uploads').upload(filePath, file, { upsert: true });
                                if (error) throw error;
                                
                                const { data: { publicUrl } } = supabase.storage.from('cms-uploads').getPublicUrl(filePath);
                                
                                const newProjects = [...formData.projects];
                                newProjects[idx] = { ...newProjects[idx], image: publicUrl };
                                setFormData((prev) => ({ ...prev, projects: newProjects }));
                                
                                toast({ title: 'Image uploaded', description: `Updated ${project.title} thumbnail` });
                              } catch (err) {
                                toast({ title: 'Upload failed', description: 'Please try again', variant: 'destructive' });
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`project-image-${idx}`)?.click()}
                          >
                            <Upload size={14} className="mr-2" />
                            {project.image ? 'Change Thumbnail' : 'Upload Thumbnail'}
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newProjects = [...(formData.projects || []), { id: Date.now(), title: '', category: '', image: '' }];
                        setFormData((prev) => ({ ...prev, projects: newProjects }));
                      }}
                    >
                      <Plus size={14} className="mr-2" />
                      Add Project
                    </Button>
                  </div>
                )}

                {/* Team Members Editor */}
                {Array.isArray(formData.members) && (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-foreground">
                      Team Members
                    </label>
                    {formData.members.map((member: { name: string; role: string; image: string }, idx: number) => (
                      <div key={idx} className="p-4 bg-muted/50 rounded-lg space-y-3">
                        <div className="flex items-center gap-4">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            {member.image ? (
                              <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <Input
                              value={member.name}
                              onChange={(e) => {
                                const newMembers = [...formData.members];
                                newMembers[idx] = { ...newMembers[idx], name: e.target.value };
                                setFormData((prev) => ({ ...prev, members: newMembers }));
                              }}
                              placeholder="Name"
                              className="h-9"
                            />
                            <Input
                              value={member.role}
                              onChange={(e) => {
                                const newMembers = [...formData.members];
                                newMembers[idx] = { ...newMembers[idx], role: e.target.value };
                                setFormData((prev) => ({ ...prev, members: newMembers }));
                              }}
                              placeholder="Role"
                              className="h-9"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              const newMembers = formData.members.filter((_: any, i: number) => i !== idx);
                              setFormData((prev) => ({ ...prev, members: newMembers }));
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id={`member-image-${idx}`}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              
                              const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                              if (!validTypes.includes(file.type)) {
                                toast({ title: 'Invalid file', description: 'Please upload an image', variant: 'destructive' });
                                return;
                              }
                              
                              try {
                                const fileExt = file.name.split('.').pop();
                                const fileName = `team-member-${idx}-${Date.now()}.${fileExt}`;
                                const filePath = `sections/team/${fileName}`;
                                
                                const { error } = await supabase.storage.from('cms-uploads').upload(filePath, file, { upsert: true });
                                if (error) throw error;
                                
                                const { data: { publicUrl } } = supabase.storage.from('cms-uploads').getPublicUrl(filePath);
                                
                                const newMembers = [...formData.members];
                                newMembers[idx] = { ...newMembers[idx], image: publicUrl };
                                setFormData((prev) => ({ ...prev, members: newMembers }));
                                
                                toast({ title: 'Image uploaded', description: `Updated ${member.name}'s photo` });
                              } catch (err) {
                                toast({ title: 'Upload failed', description: 'Please try again', variant: 'destructive' });
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`member-image-${idx}`)?.click()}
                          >
                            <Upload size={14} className="mr-2" />
                            {member.image ? 'Change Photo' : 'Upload Photo'}
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newMembers = [...(formData.members || []), { name: '', role: '', image: '' }];
                        setFormData((prev) => ({ ...prev, members: newMembers }));
                      }}
                    >
                      <Plus size={14} className="mr-2" />
                      Add Team Member
                    </Button>
                  </div>
                )}

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Section Image
                  </label>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'imageUrl')}
                  />
                  {formData.imageUrl ? (
                    <div className="relative">
                      <img
                        src={formData.imageUrl}
                        alt="Section preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute bottom-2 right-2"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={isUploadingImage}
                      >
                        {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Replace'}
                      </Button>
                    </div>
                  ) : (
                    <div
                      onClick={() => imageInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      {isUploadingImage ? (
                        <div className="space-y-2">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                          <Progress value={uploadProgress} className="w-full" />
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload image
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Video Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Section Video
                  </label>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoUpload}
                  />
                  {formData.videoUrl ? (
                    <div className="relative">
                      <video
                        src={formData.videoUrl}
                        className="w-full h-40 object-cover rounded-lg"
                        controls
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute bottom-2 right-2"
                        onClick={() => videoInputRef.current?.click()}
                        disabled={isUploadingVideo}
                      >
                        {isUploadingVideo ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Replace'}
                      </Button>
                    </div>
                  ) : (
                    <div
                      onClick={() => videoInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      {isUploadingVideo ? (
                        <div className="space-y-2">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                          <Progress value={uploadProgress} className="w-full" />
                        </div>
                      ) : (
                        <>
                          <Video className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload video (MP4, WebM)
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                <Button variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
