import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Instagram,
  Youtube,
  Linkedin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const projectTypes = [
  "Content Creation",
  "Commercial Production",
  "Documentary",
  "Tourism Media",
  "Podcast Production",
  "Event Coverage",
  "Studio Booking",
  "Other",
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    projectType: "",
    timeline: "",
    budget: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you within 24-48 hours.",
    });
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      projectType: "",
      timeline: "",
      budget: "",
      message: "",
    });
  };

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
              Get in Touch
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Let's Create Something{" "}
              <span className="text-gradient-gold">Unforgettable</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Ready to bring your vision to life? Tell us about your project and 
              we'll get back to you within 24-48 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-10"
            >
              <div>
                <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
                  Let's Connect
                </h2>
                <p className="text-muted-foreground">
                  Reach out directly or fill out the form.
                </p>
              </div>
              
              <div className="space-y-8">
                <a
                  href="mailto:hello@atlanticcreators.com"
                  className="flex items-center gap-5 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
                    <Mail size={22} />
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Email</div>
                    <div className="text-foreground text-lg font-medium group-hover:text-primary transition-colors">
                      hello@atlanticcreators.com
                    </div>
                  </div>
                </a>
                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-5 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
                    <Phone size={22} />
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Phone</div>
                    <div className="text-foreground text-lg font-medium group-hover:text-primary transition-colors">
                      +1 (234) 567-890
                    </div>
                  </div>
                </a>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center text-primary">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Location</div>
                    <div className="text-foreground text-lg font-medium">
                      Atlantic City, USA
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-6 border-t border-border">
                <h3 className="text-muted-foreground text-xs uppercase tracking-wider mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {[
                    { icon: Instagram, href: "#", label: "Instagram" },
                    { icon: Youtube, href: "#", label: "YouTube" },
                    { icon: Linkedin, href: "#", label: "LinkedIn" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="bg-card border border-border rounded-2xl p-8 lg:p-12">
                <div className="mb-8">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                    Project Inquiry
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Tell us about your vision and we'll get back to you within 24 hours.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-medium text-muted-foreground mb-3">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-5 py-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-medium text-muted-foreground mb-3">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-5 py-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                        placeholder="Your company"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-medium text-muted-foreground mb-3">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-5 py-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-medium text-muted-foreground mb-3">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-5 py-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                        placeholder="+1 (234) 567-890"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-medium text-muted-foreground mb-3">
                        Project Type *
                      </label>
                      <select
                        required
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full px-5 py-4 bg-background border border-border rounded-xl text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                      >
                        <option value="">Select project type</option>
                        {projectTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-medium text-muted-foreground mb-3">
                        Timeline
                      </label>
                      <input
                        type="text"
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full px-5 py-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                        placeholder="e.g., Q1 2025"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-muted-foreground mb-3">
                      Budget Range (Optional)
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-5 py-4 bg-background border border-border rounded-xl text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-5k">Under $5,000</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k+">$50,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-muted-foreground mb-3">
                      Project Details *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-5 py-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 resize-none"
                      placeholder="Tell us about your project, goals, and any specific requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-gold flex items-center justify-center gap-3 text-sm uppercase tracking-wider py-4"
                  >
                    <Send size={18} />
                    Send Message
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Contact;
