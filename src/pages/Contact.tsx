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
import { SEO } from "@/components/SEO";
import { contactFormSchema, sanitizeInput, type ContactFormData } from "@/lib/validation";
import { AdminEntryIcon } from "@/components/admin/AdminEntryIcon";

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
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Sanitize inputs
    const sanitizedData = {
      ...formData,
      name: sanitizeInput(formData.name),
      company: sanitizeInput(formData.company),
      message: sanitizeInput(formData.message),
      timeline: sanitizeInput(formData.timeline),
    };

    // Validate with zod
    const result = contactFormSchema.safeParse(sanitizedData);
    
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      toast({
        title: "Validation Error",
        description: "Please check the form for errors.",
        variant: "destructive",
      });
      return;
    }

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 500));

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
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <SEO 
        title="Contact Us"
        description="Get in touch with Atlantic Creators Company. Tell us about your project and we'll bring your vision to life with premium media production."
        url="https://atlanticcreators.com/contact"
        keywords="contact Atlantic Creators, media production inquiry, book media production, project consultation"
      />
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-background relative overflow-hidden" aria-labelledby="contact-heading">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 to-transparent pointer-events-none" aria-hidden="true" />
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
            <h1 id="contact-heading" className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
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
      <section className="section-padding bg-background" aria-label="Contact information and form">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Contact Info */}
            <motion.aside
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-10"
              aria-label="Contact details"
            >
              <div>
                <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
                  Let's Connect
                </h2>
                <p className="text-muted-foreground">
                  Reach out directly or fill out the form.
                </p>
              </div>
              
              <address className="space-y-8 not-italic">
                <a
                  href="mailto:hello@atlanticcreators.com"
                  className="flex items-center gap-5 group"
                  aria-label="Email us at hello@atlanticcreators.com"
                >
                  <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300" aria-hidden="true">
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
                  aria-label="Call us at +1 234 567 890"
                >
                  <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300" aria-hidden="true">
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
                  <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center text-primary" aria-hidden="true">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Location</div>
                    <div className="text-foreground text-lg font-medium">
                      Atlantic City, USA
                    </div>
                  </div>
                </div>
              </address>

              {/* Social Links */}
              <nav className="pt-6 border-t border-border" aria-label="Social media links">
                <h3 className="text-muted-foreground text-xs uppercase tracking-wider mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {[
                    { icon: Instagram, href: "https://instagram.com/atlanticcreators", label: "Follow us on Instagram" },
                    { icon: Youtube, href: "https://youtube.com/atlanticcreators", label: "Subscribe to our YouTube channel" },
                    { icon: Linkedin, href: "https://linkedin.com/company/atlanticcreators", label: "Connect with us on LinkedIn" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                    >
                      <social.icon size={20} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </nav>
            </motion.aside>

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
                <form onSubmit={handleSubmit} className="space-y-6" noValidate aria-label="Contact form">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-xs uppercase tracking-wider font-medium text-muted-foreground mb-3">
                        Full Name <span className="text-primary" aria-label="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        autoComplete="name"
                        maxLength={100}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-5 py-4 bg-background border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 ${errors.name ? 'border-destructive' : 'border-border'}`}
                        placeholder="Your name"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "name-error" : undefined}
                      />
                      {errors.name && (
                        <p id="name-error" className="text-destructive text-sm mt-1" role="alert">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-xs uppercase tracking-wider font-medium text-muted-foreground mb-3">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        autoComplete="organization"
                        maxLength={100}
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-5 py-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                        placeholder="Your company"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-xs uppercase tracking-wider font-medium text-muted-foreground mb-3">
                        Email <span className="text-primary" aria-label="required">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        autoComplete="email"
                        maxLength={255}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-5 py-4 bg-background border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 ${errors.email ? 'border-destructive' : 'border-border'}`}
                        placeholder="your@email.com"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                      />
                      {errors.email && (
                        <p id="email-error" className="text-destructive text-sm mt-1" role="alert">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs uppercase tracking-wider font-medium text-muted-foreground mb-3">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        autoComplete="tel"
                        maxLength={20}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-5 py-4 bg-background border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 ${errors.phone ? 'border-destructive' : 'border-border'}`}
                        placeholder="+1 (234) 567-890"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                      />
                      {errors.phone && (
                        <p id="phone-error" className="text-destructive text-sm mt-1" role="alert">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="projectType" className="block text-xs uppercase tracking-wider font-medium text-muted-foreground mb-3">
                        Project Type <span className="text-primary" aria-label="required">*</span>
                      </label>
                      <select
                        id="projectType"
                        name="projectType"
                        required
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className={`w-full px-5 py-4 bg-background border rounded-xl text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 ${errors.projectType ? 'border-destructive' : 'border-border'}`}
                        aria-invalid={!!errors.projectType}
                        aria-describedby={errors.projectType ? "projectType-error" : undefined}
                      >
                        <option value="">Select project type</option>
                        {projectTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.projectType && (
                        <p id="projectType-error" className="text-destructive text-sm mt-1" role="alert">{errors.projectType}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="timeline" className="block text-xs uppercase tracking-wider font-medium text-muted-foreground mb-3">
                        Timeline
                      </label>
                      <input
                        type="text"
                        id="timeline"
                        name="timeline"
                        maxLength={100}
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full px-5 py-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                        placeholder="e.g., Q1 2025"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-xs uppercase tracking-wider font-medium text-muted-foreground mb-3">
                      Budget Range (Optional)
                    </label>
                    <select
                      id="budget"
                      name="budget"
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
                    <label htmlFor="message" className="block text-xs uppercase tracking-wider font-medium text-muted-foreground mb-3">
                      Project Details <span className="text-primary" aria-label="required">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      maxLength={2000}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full px-5 py-4 bg-background border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 resize-none ${errors.message ? 'border-destructive' : 'border-border'}`}
                      placeholder="Tell us about your project, goals, and any specific requirements..."
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "message-error" : undefined}
                    />
                    {errors.message && (
                      <p id="message-error" className="text-destructive text-sm mt-1" role="alert">{errors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-gold flex items-center justify-center gap-3 text-sm uppercase tracking-wider py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} aria-hidden="true" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hidden Admin Entry - Only visible on Contact page */}
      <div className="container mx-auto px-6 lg:px-8 pb-4 flex justify-end">
        <AdminEntryIcon />
      </div>

    </Layout>
  );
};

export default Contact;
