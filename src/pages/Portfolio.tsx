import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { ArrowUpRight, X, Loader2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import { usePortfolioItems, PortfolioItem } from "@/hooks/usePortfolioItems";
import { useSectionContent, getContentValue } from "@/hooks/useSectionContent";

// Fallback videos for items without uploaded videos
import tourismMediaVideo from "@/assets/tourism-media.mp4";
import eventCoverageVideo from "@/assets/event-coverage.mp4";
import documentaryVideo from "@/assets/documentary.mp4";
import podcastVideo from "@/assets/podcast.mp4";

const categories = [
  "All",
  "Photography",
  "Videography",
  "Documentary",
  "Commercial",
  "Events",
  "Tourism",
];

// Map category to fallback video
const getCategoryFallbackVideo = (category: string): string | null => {
  const videoMap: Record<string, string> = {
    Tourism: tourismMediaVideo,
    Events: eventCoverageVideo,
    Documentary: documentaryVideo,
    Commercial: podcastVideo,
  };
  return videoMap[category] || null;
};

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  
  // Fetch from CMS
  const { data: heroSection } = useSectionContent('portfolio', 'hero');
  const { data: portfolioItems, isLoading } = usePortfolioItems(activeCategory);

  // Hero content from CMS with fallbacks
  const heroLabel = getContentValue(heroSection?.content, 'label', 'Our Work');
  const heroHeading = getContentValue(heroSection?.content, 'heading', 'Portfolio');
  const heroBody = getContentValue(heroSection?.content, 'body', 'A curated selection of our best photography, videography, documentaries, corporate campaigns, and event coverage.');

  // Get video source for a project (CMS uploaded or category fallback)
  const getProjectVideo = (item: PortfolioItem): string | null => {
    if (item.video_url) return item.video_url;
    return getCategoryFallbackVideo(item.category);
  };

  return (
    <Layout>
      <SEO 
        title="Portfolio"
        description="Explore our curated portfolio of photography, videography, documentaries, commercials, and event coverage. See our best work for top brands and events."
        url="https://www.theatlanticcreators.com/portfolio"
        keywords="media production portfolio, video portfolio, photography portfolio, documentary work, commercial campaigns, event coverage examples"
      />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-block text-primary text-sm font-medium tracking-[0.2em] uppercase mb-4">
              {heroLabel}
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {heroHeading}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              {heroBody}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="pb-8 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding bg-background pt-8">
        <div className="container mx-auto px-6 lg:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : portfolioItems && portfolioItems.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {portfolioItems.map((project) => {
                  const videoSrc = getProjectVideo(project);
                  const hasVideo = !!videoSrc;
                  
                  return (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="group cursor-pointer"
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                        {hasVideo ? (
                          <video
                            src={videoSrc}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <img
                            src={project.thumbnail_image || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80"}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        )}
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                        
                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <span className="text-primary text-xs font-medium uppercase tracking-wider">
                            {project.category}
                          </span>
                          <h3 className="font-heading text-lg font-semibold text-foreground mt-1 group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                        </div>

                        {/* Arrow */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <ArrowUpRight size={14} className="text-primary-foreground" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl bg-card border border-border rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <X size={20} />
              </button>

              {/* Media */}
              <div className="aspect-video relative">
                {(() => {
                  const videoSrc = getProjectVideo(selectedProject);
                  if (videoSrc) {
                    return (
                      <video
                        src={videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover"
                      />
                    );
                  }
                  return (
                    <img
                      src={selectedProject.thumbnail_image || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80"}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  );
                })()}
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-primary text-sm font-medium uppercase tracking-wider">
                    {selectedProject.category}
                  </span>
                  {selectedProject.client && (
                    <>
                      <span className="text-muted-foreground text-sm">•</span>
                      <span className="text-muted-foreground text-sm">
                        Client: {selectedProject.client}
                      </span>
                    </>
                  )}
                </div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {selectedProject.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Portfolio;
