import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  RotateCcw,
  Trash2,
  Loader2,
  Search,
  FileText,
  Layers,
  Image,
  FolderKanban,
  BookOpen,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DeletedItem {
  id: string;
  type: 'page' | 'section' | 'image' | 'portfolio' | 'blog';
  title: string;
  deletedAt: string;
}

const typeIcons = {
  page: FileText,
  section: Layers,
  image: Image,
  portfolio: FolderKanban,
  blog: BookOpen,
};

const typeLabels = {
  page: 'Page',
  section: 'Section',
  image: 'Image',
  portfolio: 'Portfolio Item',
  blog: 'Blog Post',
};

const AdminRecycleBin = () => {
  const [items, setItems] = useState<DeletedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchDeletedItems = async () => {
    try {
      const [pages, sections, images, portfolio, blog] = await Promise.all([
        supabase.from('pages').select('id, title, updated_at').eq('is_deleted', true),
        supabase.from('sections').select('id, name, updated_at').eq('is_deleted', true),
        supabase.from('image_assets').select('id, alt_text, file_path, updated_at').eq('is_deleted', true),
        supabase.from('portfolio_items').select('id, title, updated_at').eq('is_deleted', true),
        supabase.from('blog_posts').select('id, title, updated_at').eq('is_deleted', true),
      ]);

      const allItems: DeletedItem[] = [
        ...(pages.data || []).map((item) => ({
          id: item.id,
          type: 'page' as const,
          title: item.title,
          deletedAt: item.updated_at,
        })),
        ...(sections.data || []).map((item) => ({
          id: item.id,
          type: 'section' as const,
          title: item.name,
          deletedAt: item.updated_at,
        })),
        ...(images.data || []).map((item) => ({
          id: item.id,
          type: 'image' as const,
          title: item.alt_text || item.file_path.split('/').pop() || 'Image',
          deletedAt: item.updated_at,
        })),
        ...(portfolio.data || []).map((item) => ({
          id: item.id,
          type: 'portfolio' as const,
          title: item.title,
          deletedAt: item.updated_at,
        })),
        ...(blog.data || []).map((item) => ({
          id: item.id,
          type: 'blog' as const,
          title: item.title,
          deletedAt: item.updated_at,
        })),
      ];

      // Sort by deletion date
      allItems.sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime());
      setItems(allItems);
    } catch (error) {
      console.error('Error fetching deleted items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load deleted items.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedItems();
  }, []);

  const getTableName = (type: DeletedItem['type']) => {
    switch (type) {
      case 'page': return 'pages';
      case 'section': return 'sections';
      case 'image': return 'image_assets';
      case 'portfolio': return 'portfolio_items';
      case 'blog': return 'blog_posts';
    }
  };

  const handleRestore = async (item: DeletedItem) => {
    setProcessingIds((prev) => new Set(prev).add(item.id));

    try {
      const tableName = getTableName(item.type);
      const { error } = await supabase
        .from(tableName)
        .update({ is_deleted: false })
        .eq('id', item.id);

      if (error) throw error;
      toast({ title: 'Restored', description: `${typeLabels[item.type]} restored successfully.` });
      fetchDeletedItems();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to restore item.',
        variant: 'destructive',
      });
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const handlePermanentDelete = async (item: DeletedItem) => {
    if (!confirm(`Are you sure you want to permanently delete "${item.title}"? This cannot be undone.`)) return;

    setProcessingIds((prev) => new Set(prev).add(item.id));

    try {
      const tableName = getTableName(item.type);
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', item.id);

      if (error) throw error;
      toast({ title: 'Deleted', description: 'Item permanently deleted.' });
      fetchDeletedItems();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete item.',
        variant: 'destructive',
      });
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    typeLabels[item.type].toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            Recycle Bin
          </h1>
          <p className="text-muted-foreground">
            Restore or permanently delete removed content.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search deleted items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>

        {/* Items List */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Trash2 size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Recycle bin is empty.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredItems.map((item) => {
                const Icon = typeIcons[item.type];
                const isProcessing = processingIds.has(item.id);

                return (
                  <motion.div
                    key={`${item.type}-${item.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-foreground truncate">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {typeLabels[item.type]} • Deleted {new Date(item.deletedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestore(item)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <>
                              <RotateCcw size={14} className="mr-1" />
                              Restore
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePermanentDelete(item)}
                          disabled={isProcessing}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Info */}
        {items.length > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            Items in the recycle bin can be restored or permanently deleted.
          </p>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRecycleBin;
