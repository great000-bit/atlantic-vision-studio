import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, Film, FileVideo, Globe, Mic2, Calendar, Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useSectionContent, getContentValue } from "@/hooks/useSectionContent";
import { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Camera,
  Film,
  FileVideo,
  Globe,
  Mic2,
  Calendar,
};

const defaultServices = [
  {
    id: "content",
    icon: "Camera",
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
    icon: "Film",
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
    icon: "FileVideo",
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
    icon: "Globe",
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
    icon: "Mic2",
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
    icon: "Calendar",
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
  // Fetch all service sections from CMS
  const { data: contentCreation } = useSectionContent('services', 'content-creation');
  const { data: videoProduction } = useSectionContent('services', 'video-production');
  const { data: documentary } = useSectionContent('services', 'documentary');
  const { data: tourismMedia } = useSectionContent('services', 'tourism-media');
  const { data: podcastProduction } = useSectionContent('services', 'podcast-production');
  const { data: eventCoverage } = useSectionContent('services', 'event-coverage');
  const { data: ctaSection } = useSectionContent('services', 'cta');

  // Build services array from CMS or defaults
  const services = [
    {
      id: "content",
      icon: "Camera",
      title: getContentValue(contentCreation?.content, 'heading', defaultServices[0].title),
      subtitle: getContentValue(contentCreation?.content, 'label', defaultServices[0].subtitle),
      description: getContentValue(contentCreation?.content, 'description', defaultServices[0].description),
      benefits: getContentValue(contentCreation?.content, 'features', defaultServices[0].benefits) as string[],
      image: getContentValue(contentCreation?.content, 'imageUrl', defaultServices[0].image),
    },
    {
      id: "commercials",
      icon: "Film",
      title: getContentValue(videoProduction?.content, 'heading', defaultServices[1].title),
      subtitle: getContentValue(videoProduction?.content, 'label', defaultServices[1].subtitle),
      description: getContentValue(videoProduction?.content, 'description', defaultServices[1].description),
      benefits: getContentValue(videoProduction?.content, 'features', defaultServices[1].benefits) as string[],
      image: getContentValue(videoProduction?.content, 'imageUrl', defaultServices[1].image),
    },
    {
      id: "documentary",
      icon: "FileVideo",
      title: getContentValue(documentary?.content, 'heading', defaultServices[2].title),
      subtitle: getContentValue(documentary?.content, 'label', defaultServices[2].subtitle),
      description: getContentValue(documentary?.content, 'description', defaultServices[2].description),
      benefits: getContentValue(documentary?.content, 'features', defaultServices[2].benefits) as string[],
      image: getContentValue(documentary?.content, 'imageUrl', defaultServices[2].image),
    },
    {
      id: "tourism",
      icon: "Globe",
      title: getContentValue(tourismMedia?.content, 'heading', defaultServices[3].title),
      subtitle: getContentValue(tourismMedia?.content, 'label', defaultServices[3].subtitle),
      description: getContentValue(tourismMedia?.content, 'description', defaultServices[3].description),
      benefits: getContentValue(tourismMedia?.content, 'features', defaultServices[3].benefits) as string[],
      image: getContentValue(tourismMedia?.content, 'imageUrl', defaultServices[3].image),
    },
    {
      id: "podcast",
      icon: "Mic2",
      title: getContentValue(podcastProduction?.content, 'heading', defaultServices[4].title),
      subtitle: getContentValue(podcastProduction?.content, 'label', defaultServices[4].subtitle),
      description: getContentValue(podcastProduction?.content, 'description', defaultServices[4].description),
      benefits: getContentValue(podcastProduction?.content, 'features', defaultServices[4].benefits) as string[],
      image: getContentValue(podcastProduction?.content, 'imageUrl', defaultServices[4].image),
    },
    {
      id: "events",
      icon: "Calendar",
      title: getContentValue(eventCoverage?.content, 'heading', defaultServices[5].title),
      subtitle: getContentValue(eventCoverage?.content, 'label', defaultServices[5].subtitle),
      description: getContentValue(eventCoverage?.content, 'description', defaultServices[5].description),
      benefits: getContentValue(eventCoverage?.content, 'features', defaultServices[5].benefits) as string[],
      image: getContentValue(eventCoverage?.content, 'imageUrl', defaultServices[5].image),
    },
  ];

  const ctaHeading = getContentValue(ctaSection?.content, 'heading', 'Not Sure Which Service You Need?');
  const ctaBody = getContentValue(ctaSection?.content, 'body', "Let's discuss your project. We'll help you identify the perfect combination of services to achieve your goals — no obligation, just expert guidance.");
  const ctaButtonText = getContentValue(ctaSection?.content, 'ctaText', 'Schedule a Consultation');

  return (
    <Layout>
      <SEO 
        title="Our Services"
        description="Complete media production services including content creation, commercial production, documentary filmmaking, tourism media, podcast studio, and event coverage."
        url="https://www.theatlanticcreators.com/services"
        keywords="media production services, video production, photography services, documentary production, podcast studio, event coverage, commercial advertising"
      />
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
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Camera;
              return (
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
                        <IconComponent size={24} />
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
              );
            })}
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
              {ctaHeading}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {ctaBody}
            </p>
            <Link
              to="/contact"
              className="btn-gold inline-flex items-center gap-2 text-sm uppercase tracking-wider"
            >
              {ctaButtonText}
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
