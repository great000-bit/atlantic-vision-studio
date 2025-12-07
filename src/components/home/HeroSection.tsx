import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Play, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.mp4";

export const HeroSection = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Cinematic Background Video */}
      <div className="absolute inset-0">
        <video
          src={heroBg}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          className="w-full h-full object-cover"
          style={{ willChange: 'transform', transform: 'translateZ(0)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50" />
      </div>

      <div className="absolute inset-0 grain pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 lg:px-8 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6">
            <span className="inline-flex items-center gap-2 text-foreground/80 text-sm font-medium tracking-[0.2em] uppercase border border-foreground/20 backdrop-blur-sm px-4 py-2 rounded-full bg-background/30">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Full-Service Media Production
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6">
            <span className="text-foreground drop-shadow-lg">Cinematic Stories.</span><br />
            <span className="text-gradient-gold drop-shadow-lg">Impactful Visuals.</span><br />
            <span className="text-foreground drop-shadow-lg">Complete Media Solutions.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="text-foreground/70 text-lg md:text-xl font-medium tracking-wide max-w-2xl mx-auto">
            Cinematic Media. Unified Creators. National Impact.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link to="/portfolio" className="group btn-gold flex items-center gap-2 text-sm uppercase tracking-wider">
              <Play size={18} />Explore Portfolio<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/contact" className="border border-foreground/30 text-foreground bg-background/30 backdrop-blur-sm px-6 py-3 rounded-md transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary flex items-center gap-2 text-sm uppercase tracking-wider">
              Book a Project
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-foreground/10 pt-10">
            {[{ value: "150+", label: "Projects Delivered" }, { value: "50+", label: "Brand Partners" }, { value: "25+", label: "Creator Network" }, { value: "5+", label: "Years Experience" }].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-3xl md:text-4xl font-bold text-primary mb-2 drop-shadow-lg">{stat.value}</div>
                <div className="text-foreground/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.6 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-foreground/50 text-xs uppercase tracking-wider">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-foreground/30 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
};
