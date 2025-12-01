import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Camera, Video, Plane, Radio, Scissors, Users } from "lucide-react";
import { SEO } from "@/components/SEO";

const eventTypes = [
  {
    title: "Music Festivals",
    description: "Capture the energy, the crowds, the performances — creating lasting memories of unforgettable moments.",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
  },
  {
    title: "Corporate Events",
    description: "Professional coverage for conferences, seminars, product launches, and corporate gatherings.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  },
  {
    title: "Conferences",
    description: "Multi-day conference coverage with keynote captures, panel discussions, and networking moments.",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
  },
  {
    title: "Private Events",
    description: "Weddings, galas, and exclusive gatherings documented with cinematic elegance.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  },
];

const capabilities = [
  { icon: Camera, label: "Multi-Camera Coverage" },
  { icon: Plane, label: "Aerial & Drone Footage" },
  { icon: Video, label: "Same-Day Highlight Reels" },
  { icon: Radio, label: "Live Streaming" },
  { icon: Scissors, label: "Post-Event Editing" },
  { icon: Users, label: "Dedicated Event Team" },
];

const packages = [
  {
    name: "Essential",
    description: "Perfect for smaller events and single-day coverage.",
    features: [
      "2 videographers",
      "Photography coverage",
      "4K video capture",
      "Highlight reel (2-3 min)",
      "48-hour delivery",
    ],
  },
  {
    name: "Professional",
    description: "Comprehensive coverage for medium-scale events.",
    features: [
      "4 videographers",
      "2 photographers",
      "Drone footage",
      "Live streaming setup",
      "Same-day highlights",
      "Full event documentary",
    ],
    featured: true,
  },
  {
    name: "Premium",
    description: "Full-scale production for major events and festivals.",
    features: [
      "Full production crew",
      "Multi-camera setup",
      "Aerial cinematography",
      "Live streaming + recording",
      "Real-time social content",
      "Multi-format deliverables",
      "Dedicated project manager",
    ],
  },
];

const Events = () => {
  return (
    <Layout>
      <SEO 
        title="Festival & Conference Coverage"
        description="Professional event media coverage for music festivals, corporate conferences, concerts, and private events. Multi-camera videography, aerial shots, and highlight reels."
        url="https://atlanticcreators.com/events"
        keywords="event coverage, festival videography, conference media, corporate event photography, live event production, event highlight reels"
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
              Event Coverage
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Festival & Conference{" "}
              <span className="text-gradient-gold">Coverage</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              From large-scale festivals to corporate conferences — we offer full media coverage 
              with multi-camera videography, aerial shots, highlight reels, live streaming, and more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {capabilities.map((cap, index) => (
              <motion.div
                key={cap.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <cap.icon size={20} />
                </div>
                <span className="text-foreground text-sm font-medium">{cap.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <SectionHeading
            label="What We Cover"
            title="Event Types"
            subtitle="Whether it's a music festival, corporate conference, or intimate gathering — we bring the same level of excellence."
          />

          <div className="grid md:grid-cols-2 gap-8">
            {eventTypes.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative aspect-[16/10] rounded-2xl overflow-hidden"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="section-padding bg-card">
        <div className="container mx-auto px-6 lg:px-8">
          <SectionHeading
            label="Packages"
            title="Coverage Options"
            subtitle="Choose a package that fits your event scale and needs."
          />

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
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
                <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                  {pkg.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {pkg.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-foreground text-sm">
                      <Check size={16} className="text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact?subject=event-coverage"
                  className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg text-sm uppercase tracking-wider transition-all ${
                    pkg.featured ? "btn-gold" : "btn-outline-gold"
                  }`}
                >
                  Get Quote
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <SectionHeading
              label="Our Process"
              title="How We Work"
              subtitle="A streamlined process ensuring quality coverage from planning to delivery."
            />

            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Consultation",
                  description: "We discuss your event, understand your goals, and recommend the best coverage approach.",
                },
                {
                  step: "02",
                  title: "Planning",
                  description: "Detailed shot lists, crew assignments, equipment prep, and logistics coordination.",
                },
                {
                  step: "03",
                  title: "Execution",
                  description: "Our experienced team captures every moment with precision and creativity.",
                },
                {
                  step: "04",
                  title: "Delivery",
                  description: "Fast turnaround on edited content, from highlight reels to full event documentaries.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-heading text-xl font-bold text-primary">
                        {item.step}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              Have an Upcoming Event?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Let's discuss how we can capture your event with cinematic quality. 
              From planning to post-production, we've got you covered.
            </p>
            <Link
              to="/contact"
              className="btn-gold inline-flex items-center gap-2 text-sm uppercase tracking-wider"
            >
              Inquire for Coverage
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Events;
