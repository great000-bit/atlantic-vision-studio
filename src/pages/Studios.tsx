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

const mediaStudioFeatures = [
  "4K Multi-camera setup",
  "Professional lighting rigs",
  "Seamless backdrops & sets",
  "Green screen capability",
  "Product photography station",
  "High-end equipment available",
];

const podcastStudioFeatures = [
  "Soundproof recording room",
  "Multi-channel audio mixer",
  "Podcast video recording",
  "Remote guest integration",
  "Voice-over booth",
  "Professional monitoring",
];

const Studios = () => {
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
              Our Facilities
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Studio{" "}
              <span className="text-gradient-gold">Spaces</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              State-of-the-art production facilities for photoshoots, video production, 
              podcasts, and more. Professional equipment, versatile spaces, expert support.
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
                Media Studio
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our fully equipped media studio is perfect for photoshoots, product media, 
                commercials, interviews, and more. With high-end lighting, cinematic sets, 
                and professional equipment, we create the perfect environment for your vision.
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                {mediaStudioFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-foreground">
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
                      src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80"
                      alt="Media studio setup"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80"
                      alt="Camera equipment"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-square rounded-xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=600&q=80"
                      alt="Lighting setup"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-[4/5] rounded-xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80"
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
                  src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80"
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
                Podcast Studio
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our sound-proof, studio-grade podcast room features pro-level audio gear — 
                ideal for interviews, talk shows, voice-overs, and branded podcasts. 
                Multi-camera video capability included.
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                {podcastStudioFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-foreground">
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
