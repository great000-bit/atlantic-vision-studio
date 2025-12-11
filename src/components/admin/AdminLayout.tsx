import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Layers,
  Image,
  FolderKanban,
  BookOpen,
  Trash2,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import logo from '@/assets/logo.png';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: ReactNode;
}

import {
  Home,
  Info,
  Briefcase,
  Users,
  Building2,
  Calendar,
  Mail,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Homepage', path: '/admin/home', icon: Home },
  { name: 'About', path: '/admin/about', icon: Info },
  { name: 'Services', path: '/admin/services', icon: Briefcase },
  { name: 'Portfolio', path: '/admin/portfolio', icon: FolderKanban },
  { name: 'Creators', path: '/admin/creators', icon: Users },
  { name: 'Studios', path: '/admin/studios', icon: Building2 },
  { name: 'Events', path: '/admin/events', icon: Calendar },
  { name: 'Contact', path: '/admin/contact', icon: Mail },
  { name: 'Blog', path: '/admin/blog', icon: BookOpen },
  { name: 'All Sections', path: '/admin/sections', icon: Layers },
  { name: 'Images', path: '/admin/images', icon: Image },
  { name: 'Pages', path: '/admin/pages', icon: FileText },
  { name: 'Recycle Bin', path: '/admin/recycle-bin', icon: Trash2 },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link to="/admin" className="flex items-center gap-3">
              <img src={logo} alt="Atlantic Creators" className="h-8 w-8 object-contain" />
              <span className="font-logo text-lg text-foreground">Admin Panel</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon size={18} />
                {item.name}
                {isActive(item.path) && (
                  <ChevronRight size={16} className="ml-auto" />
                )}
              </Link>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-border">
            <div className="mb-3 px-4">
              <p className="text-xs text-muted-foreground">Logged in as</p>
              <p className="text-sm text-foreground truncate">{user?.email}</p>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleSignOut}
            >
              <LogOut size={16} />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-4 lg:hidden">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground"
            >
              <Menu size={24} />
            </button>
            <Link to="/admin" className="flex items-center gap-2">
              <img src={logo} alt="Atlantic Creators" className="h-6 w-6 object-contain" />
              <span className="font-logo text-sm">Admin</span>
            </Link>
            <div className="w-10" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
