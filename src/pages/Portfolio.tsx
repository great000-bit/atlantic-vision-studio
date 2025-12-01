import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Play, ArrowUpRight, X } from "lucide-react";
import { SEO } from "@/components/SEO";

const categories = [
  "All",
  "Photography",
  "Videography",
  "Documentary",
  "Commercial",
  "Events",
  "Tourism",
];

const projects = [
  {
    id: 1,
    title: "Coastal Luxury Resort",
    category: "Tourism",
    description: "A cinematic showcase of the Pacific Shores Resort, capturing the essence of luxury coastal living through stunning aerial and ground footage.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    isVideo: true,
    client: "Pacific Shores Resort",
  },
  {
    id: 2,
    title: "Tech Summit 2024",
    category: "Events",
    description: "Complete media coverage of the annual Tech Summit, including keynote captures, panel discussions, and attendee interviews.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    isVideo: false,
    client: "TechCorp International",
  },
  {
    id: 3,
    title: "Artisan Coffee Brand",
    category: "Commercial",
    description: "A warm, intimate commercial campaign highlighting the craft and passion behind artisanal coffee production.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    isVideo: true,
    client: "Roast & Brew Co.",
  },
  {
    id: 4,
    title: "Mountain Documentary",
    category: "Documentary",
    description: "A feature-length documentary exploring the lives of mountain communities and their relationship with the changing landscape.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    isVideo: true,
    client: "Nature First Foundation",
  },
  {
    id: 5,
    title: "Fashion Week Editorial",
    category: "Photography",
    description: "Exclusive backstage and runway photography from Fashion Week, capturing the energy and artistry of haute couture.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    isVideo: false,
    client: "Vogue Magazine",
  },
  {
    id: 6,
    title: "Podcast Studio Session",
    category: "Commercial",
    description: "Multi-camera video podcast production with professional lighting and audio for a leading business podcast.",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80",
    isVideo: false,
    client: "Business Insights Podcast",
  },
  {
    id: 7,
    title: "Island Paradise Campaign",
    category: "Tourism",
    description: "A vibrant tourism campaign showcasing tropical island adventures, from snorkeling to sunset cruises.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    isVideo: true,
    client: "Island Tourism Board",
  },
  {
    id: 8,
    title: "Startup Launch Event",
    category: "Events",
    description: "Dynamic event coverage for a major tech startup launch, including product demos and investor presentations.",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
    isVideo: true,
    client: "NovaTech Innovations",
  },
  {
    id: 9,
    title: "Portrait Series",
    category: "Photography",
    description: "An intimate portrait series celebrating diverse voices in the creative industry.",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
    isVideo: false,
    client: "Creative Minds Magazine",
  },
  {
    id: 10,
    title: "Ocean Conservation",
    category: "Documentary",
    description: "A powerful documentary series on marine conservation efforts and the communities protecting our oceans.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    isVideo: true,
    client: "Ocean Alliance",
  },
  {
    id: 11,
    title: "Luxury Car Campaign",
    category: "Commercial",
    description: "A sleek, high-end commercial campaign for a premium automotive brand, showcasing performance and design.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    isVideo: true,
    client: "Elite Motors",
  },
  {
    id: 12,
    title: "Music Festival",
    category: "Events",
    description: "Three days of non-stop coverage at the Summer Sounds Music Festival, capturing performances and crowd energy.",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
    isVideo: true,
    client: "Summer Sounds Festival",
  },
];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <Layout>
      <SEO 
        title="Portfolio"
        description="Explore our curated portfolio of photography, videography, documentaries, commercials, and event coverage. See our best work for top brands and events."
        url="https://atlanticcreators.com/portfolio"
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
              Our Work
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Portfolio
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              A curated selection of our best photography, videography, documentaries, 
              corporate campaigns, and event coverage.
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
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
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
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    
                    {/* Play Icon */}
                    {project.isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                          <Play size={20} className="text-primary-foreground ml-1" />
                        </div>
                      </div>
                    )}
                    
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
              ))}
            </AnimatePresence>
          </motion.div>
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

              {/* Image */}
              <div className="aspect-video relative">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                {selectedProject.isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                      <Play size={32} className="text-primary-foreground ml-1" />
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-primary text-sm font-medium uppercase tracking-wider">
                    {selectedProject.category}
                  </span>
                  <span className="text-muted-foreground text-sm">•</span>
                  <span className="text-muted-foreground text-sm">
                    Client: {selectedProject.client}
                  </span>
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
