import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Pencil,
  Trash2,
  Loader2,
  Search,
  X,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImageAsset {
  id: string;
  section_id: string | null;
  file_path: string;
  alt_text: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

const AdminImages = () => {
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageAsset | null>(null);
  const [altText, setAltText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('image_assets')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: 'Error',
        description: 'Failed to load images.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('cms-uploads')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from('cms-uploads')
          .getPublicUrl(filePath);

        const { error: insertError } = await supabase
          .from('image_assets')
          .insert({
            file_path: publicUrl.publicUrl,
            alt_text: file.name.replace(/\.[^/.]+$/, ''),
          });

        if (insertError) throw insertError;
      }

      toast({ title: 'Success', description: 'Images uploaded successfully.' });
      fetchImages();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload images.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleOpenModal = (image: ImageAsset) => {
    setEditingImage(image);
    setAltText(image.alt_text || '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingImage(null);
    setAltText('');
  };

  const handleSave = async () => {
    if (!editingImage) return;

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('image_assets')
        .update({ alt_text: altText })
        .eq('id', editingImage.id);

      if (error) throw error;
      toast({ title: 'Success', description: 'Image updated successfully.' });
      handleCloseModal();
      fetchImages();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update image.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (image: ImageAsset) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const { error } = await supabase
        .from('image_assets')
        .update({ is_deleted: true })
        .eq('id', image.id);

      if (error) throw error;
      toast({ title: 'Deleted', description: 'Image moved to recycle bin.' });
      fetchImages();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete image.',
        variant: 'destructive',
      });
    }
  };

  const filteredImages = images.filter((image) =>
    image.alt_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    image.file_path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              Images
            </h1>
            <p className="text-muted-foreground">
              Manage your image assets and media files.
            </p>
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="btn-gold"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} className="mr-2" />
                  Upload Images
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>

        {/* Images Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <ImageIcon size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No images found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredImages.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative bg-card border border-border rounded-xl overflow-hidden"
              >
                <div className="aspect-square">
                  <img
                    src={image.file_path}
                    alt={image.alt_text || 'Image'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleOpenModal(image)}
                    className="p-2 bg-card rounded-lg text-foreground hover:bg-muted transition-colors"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <a
                    href={image.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-card rounded-lg text-foreground hover:bg-muted transition-colors"
                    title="View"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <button
                    onClick={() => handleDelete(image)}
                    className="p-2 bg-card rounded-lg text-destructive hover:bg-muted transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="p-2">
                  <p className="text-xs text-muted-foreground truncate">
                    {image.alt_text || 'No alt text'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && editingImage && (
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
                className="bg-card border border-border rounded-xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-xl font-semibold text-foreground">
                    Edit Image
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={editingImage.file_path}
                      alt={editingImage.alt_text || 'Image'}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Alt Text
                    </label>
                    <Input
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Describe the image..."
                      className="bg-background"
                    />
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

export default AdminImages;
