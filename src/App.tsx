import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SkipToContent } from "@/components/SkipToContent";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";
import { Suspense, lazy } from "react";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Creators = lazy(() => import("./pages/Creators"));
const Studios = lazy(() => import("./pages/Studios"));
const Events = lazy(() => import("./pages/Events"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminPages = lazy(() => import("./pages/admin/AdminPages"));
const AdminSections = lazy(() => import("./pages/admin/AdminSections"));
const AdminImages = lazy(() => import("./pages/admin/AdminImages"));
const AdminPortfolio = lazy(() => import("./pages/admin/AdminPortfolio"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminRecycleBin = lazy(() => import("./pages/admin/AdminRecycleBin"));
const AdminHome = lazy(() => import("./pages/admin/AdminHome"));
const AdminAbout = lazy(() => import("./pages/admin/AdminAbout"));
const AdminServices = lazy(() => import("./pages/admin/AdminServices"));
const AdminCreators = lazy(() => import("./pages/admin/AdminCreators"));
const AdminStudios = lazy(() => import("./pages/admin/AdminStudios"));
const AdminEvents = lazy(() => import("./pages/admin/AdminEvents"));
const AdminContact = lazy(() => import("./pages/admin/AdminContact"));

// Animated page loader
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminAuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SkipToContent />
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/:id" element={<Portfolio />} />
                <Route path="/creators" element={<Creators />} />
                <Route path="/studios" element={<Studios />} />
                <Route path="/events" element={<Events />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<Blog />} />
                <Route path="/privacy" element={<Privacy />} />
                
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
                <Route path="/admin/home" element={<ProtectedAdminRoute><AdminHome /></ProtectedAdminRoute>} />
                <Route path="/admin/about" element={<ProtectedAdminRoute><AdminAbout /></ProtectedAdminRoute>} />
                <Route path="/admin/services" element={<ProtectedAdminRoute><AdminServices /></ProtectedAdminRoute>} />
                <Route path="/admin/creators" element={<ProtectedAdminRoute><AdminCreators /></ProtectedAdminRoute>} />
                <Route path="/admin/studios" element={<ProtectedAdminRoute><AdminStudios /></ProtectedAdminRoute>} />
                <Route path="/admin/events" element={<ProtectedAdminRoute><AdminEvents /></ProtectedAdminRoute>} />
                <Route path="/admin/contact" element={<ProtectedAdminRoute><AdminContact /></ProtectedAdminRoute>} />
                <Route path="/admin/pages" element={<ProtectedAdminRoute><AdminPages /></ProtectedAdminRoute>} />
                <Route path="/admin/sections" element={<ProtectedAdminRoute><AdminSections /></ProtectedAdminRoute>} />
                <Route path="/admin/sections/:pageId" element={<ProtectedAdminRoute><AdminSections /></ProtectedAdminRoute>} />
                <Route path="/admin/images" element={<ProtectedAdminRoute><AdminImages /></ProtectedAdminRoute>} />
                <Route path="/admin/portfolio" element={<ProtectedAdminRoute><AdminPortfolio /></ProtectedAdminRoute>} />
                <Route path="/admin/blog" element={<ProtectedAdminRoute><AdminBlog /></ProtectedAdminRoute>} />
                <Route path="/admin/recycle-bin" element={<ProtectedAdminRoute><AdminRecycleBin /></ProtectedAdminRoute>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AdminAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
