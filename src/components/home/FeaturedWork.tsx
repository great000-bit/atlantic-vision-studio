import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { useSectionContent, getContentValue } from "@/hooks/useSectionContent";
import tourismMediaVideo from "@/assets/tourism-media.mp4";
import eventCoverageVideo from "@/assets/event-coverage.mp4";
import documentaryVideo from "@/assets/documentary.mp4";
import podcastVideo from "@/assets/podcast.mp4";

// Video mapping by category
const categoryVideoMap: Record<string, string> = {
  "Tourism Media": tourismMediaVideo,
  "Event Coverage": eventCoverageVideo,
  "Documentary": documentaryVideo,
  "Podcast": podcastVideo,
};

// Default featured projects
const defaultProjects = [
  { id: 1, title: "Coastal Luxury Resort", category: "Tourism Media", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80" },
  { id: 2, title: "Tech Summit 2024", category: "Event Coverage", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80" },
  { id: 3, title: "Artisan Coffee Brand", category: "Commercial", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80" },
  { id: 4, title: "Mountain Documentary", category: "Documentary", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" },
  { id: 5, title: "Fashion Week Editorial", category: "Photography", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" },
  { id: 6, title: "Podcast Studio Session", category: "Podcast", image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80" },
];

export const FeaturedWork = () => {
  const { data: section } = useSectionContent('home', 'featured-work');
  const content = section?.content;

  // Dynamic content with fallbacks
  const label = getContentValue(content, 'label', 'Portfolio');
  const title = getContentValue(content, 'heading', 'Our Work Speaks For Us');
  const subtitle = getContentValue(content, 'subheading', 'A curated selection of our best photography, videography, and documentary work.');
  const projects = getContentValue(content, 'projects', defaultProjects) as typeof defaultProjects;

  return (
    <section className="section-padding bg-card relative">
      <div className="container mx-auto px-6 lg:px-8">
        <SectionHeading label={label} title={title} subtitle={subtitle} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const videoSrc = categoryVideoMap[project.category];
            return (
              <motion.div key={project.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className={`group relative overflow-hidden rounded-lg ${index === 0 || index === 3 ? "md:row-span-2" : ""}`}>
                <Link to={`/portfolio/${project.id}`} className="block">
                  <div className={`relative ${index === 0 || index === 3 ? "aspect-[3/4]" : "aspect-video"}`}>
                    {videoSrc ? (
                      <video src={videoSrc} autoPlay loop muted playsInline preload="auto" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="text-primary text-xs font-medium uppercase tracking-wider">{project.category}</span>
                      <h3 className="font-heading text-xl font-semibold text-foreground mt-2 group-hover:text-primary transition-colors">{project.title}</h3>
                    </div>
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center"><ArrowUpRight size={18} className="text-primary-foreground" /></div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
          <Link to="/portfolio" className="btn-gold inline-flex items-center gap-2 text-sm uppercase tracking-wider">View Full Portfolio<ArrowUpRight size={16} /></Link>
        </motion.div>
      </div>
    </section>
  );
};
