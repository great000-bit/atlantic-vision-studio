import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Layers,
  Image,
  FolderKanban,
  BookOpen,
  Trash2,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  pages: number;
  sections: number;
  images: number;
  portfolioItems: number;
  blogPosts: number;
  deletedItems: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    pages: 0,
    sections: 0,
    images: 0,
    portfolioItems: 0,
    blogPosts: 0,
    deletedItems: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pages, sections, images, portfolio, blog, deletedPages, deletedSections, deletedImages, deletedPortfolio, deletedBlog] = await Promise.all([
          supabase.from('pages').select('id', { count: 'exact', head: true }).eq('is_deleted', false),
          supabase.from('sections').select('id', { count: 'exact', head: true }).eq('is_deleted', false),
          supabase.from('image_assets').select('id', { count: 'exact', head: true }).eq('is_deleted', false),
          supabase.from('portfolio_items').select('id', { count: 'exact', head: true }).eq('is_deleted', false),
          supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('is_deleted', false),
          supabase.from('pages').select('id', { count: 'exact', head: true }).eq('is_deleted', true),
          supabase.from('sections').select('id', { count: 'exact', head: true }).eq('is_deleted', true),
          supabase.from('image_assets').select('id', { count: 'exact', head: true }).eq('is_deleted', true),
          supabase.from('portfolio_items').select('id', { count: 'exact', head: true }).eq('is_deleted', true),
          supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('is_deleted', true),
        ]);

        setStats({
          pages: pages.count || 0,
          sections: sections.count || 0,
          images: images.count || 0,
          portfolioItems: portfolio.count || 0,
          blogPosts: blog.count || 0,
          deletedItems: (deletedPages.count || 0) + (deletedSections.count || 0) + (deletedImages.count || 0) + (deletedPortfolio.count || 0) + (deletedBlog.count || 0),
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { name: 'Pages', count: stats.pages, icon: FileText, path: '/admin/pages', color: 'text-blue-400' },
    { name: 'Sections', count: stats.sections, icon: Layers, path: '/admin/sections', color: 'text-green-400' },
    { name: 'Images', count: stats.images, icon: Image, path: '/admin/images', color: 'text-purple-400' },
    { name: 'Portfolio', count: stats.portfolioItems, icon: FolderKanban, path: '/admin/portfolio', color: 'text-orange-400' },
    { name: 'Blog Posts', count: stats.blogPosts, icon: BookOpen, path: '/admin/blog', color: 'text-pink-400' },
    { name: 'Recycle Bin', count: stats.deletedItems, icon: Trash2, path: '/admin/recycle-bin', color: 'text-red-400' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your content.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                to={stat.path}
                className="block bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <ArrowUpRight
                    size={20}
                    className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-1">{stat.name}</p>
                  <p className="font-heading text-3xl font-bold text-foreground">
                    {isLoading ? '...' : stat.count}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/pages"
              className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <FileText size={20} className="text-primary" />
              <span className="text-sm font-medium">Manage Pages</span>
            </Link>
            <Link
              to="/admin/portfolio"
              className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <FolderKanban size={20} className="text-primary" />
              <span className="text-sm font-medium">Add Portfolio Item</span>
            </Link>
            <Link
              to="/admin/blog"
              className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <BookOpen size={20} className="text-primary" />
              <span className="text-sm font-medium">Write Blog Post</span>
            </Link>
            <Link
              to="/admin/images"
              className="flex items-center gap-3 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <Image size={20} className="text-primary" />
              <span className="text-sm font-medium">Upload Images</span>
            </Link>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground mb-1">
                Getting Started
              </h3>
              <p className="text-muted-foreground text-sm">
                Use the sidebar to navigate between different content areas. Create pages and sections to manage your website content, then add images and portfolio items to showcase your work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
