import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Users } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="section-padding bg-card relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Book a Project */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-8 lg:p-10"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-6">
              <Mail size={28} />
            </div>
            <h3 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Ready to Create Something Unforgettable?
            </h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Let's bring your vision to life. Whether you need brand content, event coverage, 
              or a full documentary — we're ready to deliver excellence.
            </p>
            <Link
              to="/contact"
              className="group btn-gold inline-flex items-center gap-2 text-sm uppercase tracking-wider"
            >
              Book a Project
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Join Collective */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-muted border border-border rounded-2xl p-8 lg:p-10"
          >
            <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary mb-6">
              <Users size={28} />
            </div>
            <h3 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Join Our Creators Collective
            </h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Are you a talented photographer, videographer, or editor? Join our network of 
              professionals and collaborate on high-profile projects with reliable payments.
            </p>
            <Link
              to="/creators"
              className="group btn-outline-gold inline-flex items-center gap-2 text-sm uppercase tracking-wider"
            >
              Apply Now
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
