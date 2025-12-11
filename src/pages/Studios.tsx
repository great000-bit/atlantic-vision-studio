import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Camera, 
  Mic2, 
  Check, 
  Lightbulb, 
  Monitor, 
  Headphones,
  Video
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { useSectionContent, getContentValue } from "@/hooks/useSectionContent";

const defaultMediaStudioFeatures = [
  "4K Multi-camera setup",
  "Professional lighting rigs",
  "Seamless backdrops & sets",
  "Green screen capability",
  "Product photography station",
  "High-end equipment available",
];

const defaultPodcastStudioFeatures = [
  "Soundproof recording room",
  "Multi-channel audio mixer",
  "Podcast video recording",
  "Remote guest integration",
  "Voice-over booth",
  "Professional monitoring",
];

const Studios = () => {
  const { data: heroSection } = useSectionContent('studios', 'hero');
  const { data: mediaStudioSection } = useSectionContent('studios', 'media-studio');
  const { data: podcastStudioSection } = useSectionContent('studios', 'podcast-studio');
  
  // Hero content from CMS with fallbacks
  const heroLabel = getContentValue(heroSection?.content, 'label', 'Our Facilities');
  const heroHeading = getContentValue(heroSection?.content, 'heading', 'Studio');
  const heroHeadingHighlight = getContentValue(heroSection?.content, 'headingHighlight', 'Spaces');
  const heroBody = getContentValue(heroSection?.content, 'body', 'State-of-the-art production facilities for photoshoots, video production, podcasts, and more. Professional equipment, versatile spaces, expert support.');
  
  // Media Studio content from CMS
  const mediaStudioHeading = getContentValue(mediaStudioSection?.content, 'heading', 'Media Studio');
  const mediaStudioBody = getContentValue(mediaStudioSection?.content, 'body', 'Our fully equipped media studio is perfect for photoshoots, product media, commercials, interviews, and more. With high-end lighting, cinematic sets, and professional equipment, we create the perfect environment for your vision.');
  const mediaStudioFeatures = getContentValue(mediaStudioSection?.content, 'features', defaultMediaStudioFeatures) as string[];
  const mediaStudioImages = getContentValue(mediaStudioSection?.content, 'images', [
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
    'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=600&q=80',
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80'
  ]) as string[];
  
  // Podcast Studio content from CMS
  const podcastStudioHeading = getContentValue(podcastStudioSection?.content, 'heading', 'Podcast Studio');
  const podcastStudioBody = getContentValue(podcastStudioSection?.content, 'body', 'Our sound-proof, studio-grade podcast room features pro-level audio gear — ideal for interviews, talk shows, voice-overs, and branded podcasts. Multi-camera video capability included.');
  const podcastStudioFeatures = getContentValue(podcastStudioSection?.content, 'features', defaultPodcastStudioFeatures) as string[];
  const podcastStudioImage = getContentValue(podcastStudioSection?.content, 'imageUrl', 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80');

  return (
    <Layout>
      <SEO 
        title="Studio Spaces"
        description="Book our state-of-the-art media and podcast studios. Professional equipment, versatile spaces, and expert support for photoshoots, video production, and podcast recording."
        url="https://www.theatlanticcreators.com/studios"
        keywords="media studio rental, podcast studio, production studio, studio booking, professional studio space, video production studio"
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
              {heroLabel}
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {heroHeading}{" "}
              <span className="text-gradient-gold">{heroHeadingHighlight}</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              {heroBody}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Media Studio */}
      <section className="section-padding bg-card">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Camera size={24} />
                </div>
                <span className="text-primary text-sm font-medium uppercase tracking-wider">
                  Production Space
                </span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                {mediaStudioHeading}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {mediaStudioBody}
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                {mediaStudioFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-foreground">
                    <Check size={18} className="text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact?subject=media-studio"
                className="btn-gold inline-flex items-center gap-2 text-sm uppercase tracking-wider"
              >
                Book Media Studio
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[4/5] rounded-xl overflow-hidden">
                    <img
                      src={mediaStudioImages[0] || "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80"}
                      alt="Media studio setup"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-xl overflow-hidden">
                    <img
                      src={mediaStudioImages[1] || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80"}
                      alt="Camera equipment"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-square rounded-xl overflow-hidden">
                    <img
                      src={mediaStudioImages[2] || "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=600&q=80"}
                      alt="Lighting setup"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-[4/5] rounded-xl overflow-hidden">
                    <img
                      src={mediaStudioImages[3] || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80"}
                      alt="Behind the scenes"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Podcast Studio */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1 relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden">
                <img
                  src={podcastStudioImage}
                  alt="Podcast studio"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Feature Icons */}
              <div className="absolute -bottom-6 left-6 right-6 flex justify-center gap-4">
                {[Mic2, Headphones, Monitor, Video].map((Icon, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center text-primary shadow-lg"
                  >
                    <Icon size={24} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Mic2 size={24} />
                </div>
                <span className="text-primary text-sm font-medium uppercase tracking-wider">
                  Audio Production
                </span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                {podcastStudioHeading}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {podcastStudioBody}
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                {podcastStudioFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-foreground">
                    <Check size={18} className="text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact?subject=podcast-studio"
                className="btn-gold inline-flex items-center gap-2 text-sm uppercase tracking-wider"
              >
                Book Podcast Studio
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Booking Info */}
      <section className="section-padding bg-card">
        <div className="container mx-auto px-6 lg:px-8">
          <SectionHeading
            label="Booking"
            title="Studio Packages"
            subtitle="Flexible booking options for all your production needs."
          />

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Hourly",
                price: "$150",
                period: "per hour",
                features: ["Studio access", "Basic equipment", "1 technician support"],
              },
              {
                name: "Half Day",
                price: "$500",
                period: "4 hours",
                features: ["Studio access", "Full equipment", "2 technician support", "Editing suite access"],
                featured: true,
              },
              {
                name: "Full Day",
                price: "$900",
                period: "8 hours",
                features: ["Studio access", "Full equipment", "Full crew support", "Editing suite", "Catering included"],
              },
            ].map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-2xl p-8 ${
                  pkg.featured
                    ? "bg-gradient-to-b from-primary/20 to-primary/5 border-2 border-primary"
                    : "bg-background border border-border"
                }`}
              >
                {pkg.featured && (
                  <span className="inline-block text-primary text-xs font-medium uppercase tracking-wider mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  {pkg.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-heading text-4xl font-bold text-foreground">
                    {pkg.price}
                  </span>
                  <span className="text-muted-foreground text-sm">/ {pkg.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-foreground text-sm">
                      <Check size={16} className="text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact?subject=studio-booking"
                  className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg text-sm uppercase tracking-wider transition-all ${
                    pkg.featured
                      ? "btn-gold"
                      : "btn-outline-gold"
                  }`}
                >
                  Book Now
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-muted-foreground text-sm mt-8"
          >
            Custom packages available for long-term bookings and special projects.{" "}
            <Link to="/contact" className="text-primary hover:underline">
              Contact us
            </Link>{" "}
            to discuss your needs.
          </motion.p>
        </div>
      </section>
    </Layout>
  );
};

export default Studios;
