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
                {(formData.features || Array.isArray(formData.items)) && (
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
