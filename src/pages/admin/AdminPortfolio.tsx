import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  X,
  Star,
  Upload,
  Video,
  Image as ImageIcon,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string | null;
  thumbnail_image: string | null;
  video_url: string | null;
  client: string | null;
  is_featured: boolean;
  is_deleted: boolean;
  sort_order: number;
  created_at: string;
}

const categories = [
  'Photography',
  'Videography',
  'Documentary',
  'Commercial',
  'Events',
  'Tourism',
  'Podcast',
];

const AdminPortfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    thumbnail_image: '',
    video_url: '',
    client: '',
    is_featured: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('is_deleted', false)
        .order('sort_order');

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load portfolio items.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenModal = (item?: PortfolioItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        category: item.category,
        description: item.description || '',
        thumbnail_image: item.thumbnail_image || '',
        video_url: item.video_url || '',
        client: item.client || '',
        is_featured: item.is_featured,
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        category: '',
        description: '',
        thumbnail_image: '',
        video_url: '',
        client: '',
        is_featured: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      title: '',
      category: '',
      description: '',
      thumbnail_image: '',
      video_url: '',
      client: '',
      is_featured: false,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image (JPEG, PNG, GIF, WebP)',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingImage(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `portfolio/images/${fileName}`;

      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const { error: uploadError } = await supabase.storage
        .from('cms-uploads')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from('cms-uploads')
        .getPublicUrl(filePath);

      setUploadProgress(100);
      setFormData({ ...formData, thumbnail_image: publicUrl.publicUrl });
      toast({ title: 'Success', description: 'Image uploaded successfully!' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload image.',
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

    // Validate file type
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (!validVideoTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a video (MP4, WebM, MOV, AVI)',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Maximum video size is 100MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingVideo(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `portfolio/videos/${fileName}`;

      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 5, 90));
      }, 200);

      const { error: uploadError } = await supabase.storage
        .from('cms-uploads')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from('cms-uploads')
        .getPublicUrl(filePath);

      setUploadProgress(100);
      setFormData({ ...formData, video_url: publicUrl.publicUrl });
      toast({ title: 'Success', description: 'Video uploaded successfully!' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload video.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingVideo(false);
      setUploadProgress(0);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.category) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      const data = {
        title: formData.title,
        category: formData.category,
        description: formData.description || null,
        thumbnail_image: formData.thumbnail_image || null,
        video_url: formData.video_url || null,
        client: formData.client || null,
        is_featured: formData.is_featured,
      };

      if (editingItem) {
        const { error } = await supabase
          .from('portfolio_items')
          .update(data)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Portfolio item updated.' });
      } else {
        const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order)) + 1 : 0;
        const { error } = await supabase
          .from('portfolio_items')
          .insert({ ...data, sort_order: maxOrder });

        if (error) throw error;
        toast({ title: 'Success', description: 'Portfolio item created.' });
      }

      handleCloseModal();
      fetchItems();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save portfolio item.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: PortfolioItem) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;

    try {
      const { error } = await supabase
        .from('portfolio_items')
        .update({ is_deleted: true })
        .eq('id', item.id);

      if (error) throw error;
      toast({ title: 'Deleted', description: 'Item moved to recycle bin.' });
      fetchItems();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete item.',
        variant: 'destructive',
      });
    }
  };

  const toggleFeatured = async (item: PortfolioItem) => {
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .update({ is_featured: !item.is_featured })
        .eq('id', item.id);

      if (error) throw error;
      fetchItems();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update item.',
        variant: 'destructive',
      });
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              Portfolio
            </h1>
            <p className="text-muted-foreground">
              Manage your portfolio items and showcase your work.
            </p>
          </div>
          <Button onClick={() => handleOpenModal()} className="btn-gold">
            <Plus size={18} className="mr-2" />
            New Item
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search portfolio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <p className="text-muted-foreground">No portfolio items found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl overflow-hidden group"
              >
                <div className="aspect-video relative">
                  {item.thumbnail_image ? (
                    <img
                      src={item.thumbnail_image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                  {item.is_featured && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-primary rounded text-xs font-medium text-primary-foreground flex items-center gap-1">
                      <Star size={12} />
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-medium text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                  </div>
                  {item.client && (
                    <p className="text-xs text-muted-foreground mb-3">Client: {item.client}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFeatured(item)}
                      className={`p-2 rounded-lg transition-colors ${
                        item.is_featured
                          ? 'bg-primary/20 text-primary'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                      title={item.is_featured ? 'Remove from featured' : 'Mark as featured'}
                    >
                      <Star size={16} />
                    </button>
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-muted rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

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
                    {editingItem ? 'Edit Portfolio Item' : 'New Portfolio Item'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Title *
                      </label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Project title"
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                      >
                        <option value="">Select category...</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Description
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of the project..."
                      className="bg-background"
                    />
                  </div>

                  {/* Thumbnail Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      <ImageIcon size={14} className="inline mr-1" />
                      Thumbnail Image
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={formData.thumbnail_image}
                          onChange={(e) => setFormData({ ...formData, thumbnail_image: e.target.value })}
                          placeholder="Image URL or upload from device..."
                          className="bg-background flex-1"
                        />
                        <input
                          type="file"
                          ref={imageInputRef}
                          onChange={handleImageUpload}
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => imageInputRef.current?.click()}
                          disabled={isUploadingImage}
                        >
                          {isUploadingImage ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        </Button>
                      </div>
                      {isUploadingImage && (
                        <Progress value={uploadProgress} className="h-2" />
                      )}
                      {formData.thumbnail_image && (
                        <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-border">
                          <img src={formData.thumbnail_image} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, thumbnail_image: '' })}
                            className="absolute top-1 right-1 p-1 bg-background/80 rounded-full hover:bg-destructive hover:text-white"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Video Upload - FROM DEVICE */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      <Video size={14} className="inline mr-1" />
                      Project Video (Upload from Device)
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={formData.video_url}
                          onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                          placeholder="Video URL or upload MP4/WebM from device..."
                          className="bg-background flex-1"
                        />
                        <input
                          type="file"
                          ref={videoInputRef}
                          onChange={handleVideoUpload}
                          accept="video/mp4,video/webm,video/quicktime"
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => videoInputRef.current?.click()}
                          disabled={isUploadingVideo}
                          className="gap-1"
                        >
                          {isUploadingVideo ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <>
                              <Video size={14} />
                              <Upload size={14} />
                            </>
                          )}
                        </Button>
                      </div>
                      {isUploadingVideo && (
                        <div className="space-y-1">
                          <Progress value={uploadProgress} className="h-2" />
                          <p className="text-xs text-muted-foreground">Uploading video... {uploadProgress}%</p>
                        </div>
                      )}
                      {formData.video_url && (
                        <div className="relative rounded-lg overflow-hidden border border-border">
                          <video 
                            src={formData.video_url} 
                            className="w-full h-32 object-cover"
                            muted
                            playsInline
                          />
                          <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-background/80 rounded text-xs text-foreground">
                            Video Preview
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, video_url: '' })}
                            className="absolute top-1 right-1 p-1 bg-background/80 rounded-full hover:bg-destructive hover:text-white"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Supported: MP4, WebM, MOV (max 100MB). Videos will autoplay muted on the frontend.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Client
                    </label>
                    <Input
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      placeholder="Client name..."
                      className="bg-background"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="is_featured" className="text-sm text-foreground">
                      Mark as featured
                    </label>
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

export default AdminPortfolio;
