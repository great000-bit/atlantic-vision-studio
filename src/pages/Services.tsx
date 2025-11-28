import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, Film, FileVideo, Globe, Mic2, Calendar, Check } from "lucide-react";

const services = [
  {
    id: "content",
    icon: Camera,
    title: "Content Creation",
    subtitle: "For Brands & Influencers",
    description: "Stunning visuals that captivate your audience and elevate your brand presence across all platforms.",
    benefits: [
      "Professional photography & videography",
      "Social media optimized content",
      "Brand identity alignment",
      "Fast turnaround times",
    ],
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
  },
  {
    id: "commercials",
    icon: Film,
    title: "Commercial & Advertising",
    subtitle: "Video Production",
    description: "High-impact promotional videos and adverts that capture your brand's essence and engage your audience.",
    benefits: [
      "Professional cinematography",
      "Story-driven editing",
      "Broadcast-ready quality",
      "On-brand visuals",
    ],
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
  },
  {
    id: "documentary",
    icon: FileVideo,
    title: "Documentary & Docu-series",
    subtitle: "Production",
    description: "Compelling documentary production that tells stories worth sharing — authentic, impactful, memorable.",
    benefits: [
      "In-depth research & storytelling",
      "Multi-episode series capability",
      "Interview & narrative expertise",
      "Festival-quality production",
    ],
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
  },
  {
    id: "tourism",
    icon: Globe,
    title: "Tourism Media",
    subtitle: "Destination Marketing",
    description: "Scenic visuals and campaign videos that showcase destinations at their absolute finest.",
    benefits: [
      "Aerial & drone cinematography",
      "Destination storytelling",
      "Multi-platform campaigns",
      "Seasonal content packages",
    ],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  },
  {
    id: "podcast",
    icon: Mic2,
    title: "Podcast Studio",
    subtitle: "Audio & Video Production",
    description: "Professional podcast production in our state-of-the-art studio — audio and video ready.",
    benefits: [
      "Soundproof studio environment",
      "Multi-camera video setup",
      "Professional audio mixing",
      "Remote guest integration",
    ],
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80",
  },
  {
    id: "events",
    icon: Calendar,
    title: "Festival & Event Coverage",
    subtitle: "Concerts, Conferences & More",
    description: "Full media coverage for festivals, concerts, conferences, and corporate events.",
    benefits: [
      "Multi-camera coverage",
      "Aerial & drone footage",
      "Same-day highlight reels",
      "Live streaming capability",
    ],
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  },
];

const Services = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-block text-primary text-sm font-medium tracking-[0.2em] uppercase mb-4">
              Our Services
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Complete Media{" "}
              <span className="text-gradient-gold">Solutions</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Whether you need cinematic brand videos, documentary production, event coverage, 
              or studio-quality podcast recordings — we offer a full spectrum of media services 
              tailored to your needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding bg-card">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="space-y-24">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Content */}
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <service.icon size={24} />
                    </div>
                    <span className="text-primary text-sm font-medium uppercase tracking-wider">
                      {service.subtitle}
                    </span>
                  </div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {service.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3 text-foreground">
                        <Check size={18} className="text-primary flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact"
                    className="group btn-gold inline-flex items-center gap-2 text-sm uppercase tracking-wider"
                  >
                    Get a Quote
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

                {/* Image */}
                <div className={`relative ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Decorative Element */}
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-2xl -z-10" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              Not Sure Which Service You Need?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Let's discuss your project. We'll help you identify the perfect combination 
              of services to achieve your goals — no obligation, just expert guidance.
            </p>
            <Link
              to="/contact"
              className="btn-gold inline-flex items-center gap-2 text-sm uppercase tracking-wider"
            >
              Schedule a Consultation
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
