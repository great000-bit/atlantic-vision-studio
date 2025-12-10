import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Users } from "lucide-react";
import { useSectionContent, getContentValue } from "@/hooks/useSectionContent";

export const CTASection = () => {
  const { data: section } = useSectionContent('home', 'cta');
  const content = section?.content;

  const heading = getContentValue(content, 'heading', 'Ready to Create Something Unforgettable?');
  const body = getContentValue(content, 'body', "Let's bring your vision to life. Whether you need brand content, event coverage, or a full documentary — we're ready to deliver excellence.");
  const buttonText = getContentValue(content, 'buttonText', 'Book a Project');
  const buttonUrl = getContentValue(content, 'buttonUrl', '/contact');
  const secondaryHeading = getContentValue(content, 'secondaryHeading', 'Join Our Creators Collective');
  const secondaryBody = getContentValue(content, 'secondaryBody', 'Are you a talented photographer, videographer, or editor? Join our network of professionals and collaborate on high-profile projects.');
  const secondaryButtonText = getContentValue(content, 'secondaryButtonText', 'Apply Now');
  const secondaryButtonUrl = getContentValue(content, 'secondaryButtonUrl', '/creators');

  return (
    <section className="section-padding bg-card relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
      </div>
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-8 lg:p-10">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-6"><Mail size={28} /></div>
            <h3 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-4">{heading}</h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">{body}</p>
            <Link to={buttonUrl} className="group btn-gold inline-flex items-center gap-2 text-sm uppercase tracking-wider">{buttonText}<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-muted border border-border rounded-2xl p-8 lg:p-10">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-6"><Users size={28} /></div>
            <h3 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-4">{secondaryHeading}</h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">{secondaryBody}</p>
            <Link to={secondaryButtonUrl} className="group btn-outline-gold inline-flex items-center gap-2 text-sm uppercase tracking-wider">{secondaryButtonText}<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
