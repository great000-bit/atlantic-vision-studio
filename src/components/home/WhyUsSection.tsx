import { motion } from "framer-motion";
import { Check, Shield, Users, Zap, Award, Clock, LucideIcon } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { useSectionContent, getContentValue } from "@/hooks/useSectionContent";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Users, Award, Shield, Zap, Clock, Check
};

// Default benefits
const defaultBenefits = [
  { icon: "Users", title: "Unified Creative Team", description: "One team for photography, video, editing, and studio production." },
  { icon: "Award", title: "Studio-Grade Quality", description: "Cinematic visuals, pro audio, and polished editing." },
  { icon: "Shield", title: "Trusted Collective", description: "A vetted network of top talent at your fingertips." },
  { icon: "Zap", title: "Transparent Payments", description: "Fair, timely compensation for all creators." },
  { icon: "Clock", title: "Reliable Delivery", description: "On-time, every time. We deliver without compromise." },
  { icon: "Check", title: "End-to-End Service", description: "From concept to delivery, we handle everything." },
];

// Default images
const defaultImages = [
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80",
  "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=600&q=80",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
  "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80"
];

export const WhyUsSection = () => {
  const { data: section } = useSectionContent('home', 'why-us');
  const content = section?.content;

  // Dynamic content with fallbacks
  const label = getContentValue(content, 'label', 'Why Choose Us');
  const title = getContentValue(content, 'heading', 'Atlantic Creators Advantage');
  const subtitle = getContentValue(content, 'subheading', "We're your creative partners committed to excellence.");
  const benefits = getContentValue(content, 'benefits', defaultBenefits) as typeof defaultBenefits;
  const images = getContentValue(content, 'images', defaultImages) as string[];
  const yearsValue = getContentValue(content, 'yearsValue', '5+');
  const yearsLabel = getContentValue(content, 'yearsLabel', 'Years of Excellence');

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading label={label} title={title} subtitle={subtitle} align="left" />
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => {
                const IconComponent = iconMap[benefit.icon] || Check;
                return (
                  <motion.div key={benefit.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><IconComponent size={20} /></div>
                    <div>
                      <h4 className="font-heading font-semibold text-foreground mb-1">{benefit.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-lg overflow-hidden"><img src={images[0] || defaultImages[0]} alt="Behind the scenes" className="w-full h-full object-cover" /></div>
                <div className="aspect-square rounded-lg overflow-hidden"><img src={images[1] || defaultImages[1]} alt="Studio equipment" className="w-full h-full object-cover" /></div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square rounded-lg overflow-hidden"><img src={images[2] || defaultImages[2]} alt="Camera gear" className="w-full h-full object-cover" /></div>
                <div className="aspect-[4/5] rounded-lg overflow-hidden"><img src={images[3] || defaultImages[3]} alt="Production team" className="w-full h-full object-cover" /></div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground px-6 py-4 rounded-lg shadow-glow">
              <div className="font-heading text-3xl font-bold">{yearsValue}</div>
              <div className="text-sm">{yearsLabel}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
