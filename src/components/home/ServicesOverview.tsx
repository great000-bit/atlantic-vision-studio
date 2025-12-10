import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Camera, Film, FileVideo, Mic2, Sparkles, Calendar, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { useSectionContent, getContentValue } from "@/hooks/useSectionContent";

const defaultServices = [
  { icon: Camera, title: "Content Creation", description: "Stunning visuals for brands and influencers.", link: "/services#content" },
  { icon: Film, title: "Commercial Production", description: "High-impact promotional videos and adverts.", link: "/services#commercials" },
  { icon: FileVideo, title: "Documentary", description: "Compelling documentary and docu-series production.", link: "/services#documentary" },
  { icon: Sparkles, title: "Tourism Media", description: "Scenic visuals and campaign videos.", link: "/services#tourism" },
  { icon: Mic2, title: "Podcast Studio", description: "Professional audio and video podcast production.", link: "/services#podcast" },
  { icon: Calendar, title: "Event Coverage", description: "Festival, conference, and corporate event media.", link: "/services#events" },
];

const iconMap: Record<string, typeof Camera> = {
  Camera, Film, FileVideo, Mic2, Sparkles, Calendar
};

export const ServicesOverview = () => {
  const { data: section } = useSectionContent('home', 'services');
  const content = section?.content;

  const label = getContentValue(content, 'label', 'Our Services');
  const heading = getContentValue(content, 'heading', 'Complete Media Solutions');
  const subheading = getContentValue(content, 'subheading', 'From concept to delivery, we offer end-to-end media production services.');

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-muted/50 to-transparent pointer-events-none" />
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <SectionHeading label={label} title={heading} subtitle={subheading} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {defaultServices.map((service, index) => (
            <motion.div key={service.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <Link to={service.link} className="group block h-full p-8 bg-card border border-border rounded-lg hover:border-primary/50 transition-all duration-500 hover:shadow-glow">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"><service.icon size={24} /></div>
                  <ArrowUpRight size={20} className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all duration-300" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
          <Link to="/services" className="btn-outline-gold inline-flex items-center gap-2 text-sm uppercase tracking-wider">View All Services<ArrowUpRight size={16} /></Link>
        </motion.div>
      </div>
    </section>
  );
};
