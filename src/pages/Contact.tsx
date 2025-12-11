import { motion } from "framer-motion";
import { useForm, ValidationError } from '@formspree/react';
import { Layout } from "@/components/layout/Layout";
import { Mail, Send, Instagram, CheckCircle } from "lucide-react";
import { SEO } from "@/components/SEO";
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
  const [state, handleSubmit] = useForm("xwpgwvpo");

  if (state.succeeded) {
    return (
      <Layout>
        <SEO 
          title="Contact Us"
          description="Get in touch with Atlantic Creators Company."
          url="https://www.theatlanticcreators.com/contact"
        />
        <section className="pt-32 pb-20 bg-background min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-lg mx-auto px-6"
          >
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
              Message Sent!
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Thank you for contacting us. We'll be in touch shortly.
            </p>
            <a href="/contact" onClick={() => window.location.reload()} className="btn-gold inline-flex items-center gap-2">
              Back to Contact
            </a>
          </motion.div>
        </section>
        <AdminEntryIcon />
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title="Contact Us"
        description="Get in touch with Atlantic Creators Company. Tell us about your project and we'll bring your vision to life with premium media production."
        url="https://www.theatlanticcreators.com/contact"
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
                  href="mailto:theatlanticcreators@gmail.com"
                  className="flex items-center gap-5 group"
                  aria-label="Email us at theatlanticcreators@gmail.com"
                >
                  <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300" aria-hidden="true">
                    <Mail size={22} />
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Email</div>
                    <div className="text-foreground text-lg font-medium group-hover:text-primary transition-colors">
                      theatlanticcreators@gmail.com
                    </div>
                  </div>
                </a>
              </address>

              {/* Social Links - Instagram Only */}
              <nav className="pt-6 border-t border-border" aria-label="Social media links">
                <h3 className="text-muted-foreground text-xs uppercase tracking-wider mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/atlanticcreatorscompany/?utm_source=ig_web_button_share_sheet"
                    aria-label="Follow us on Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition-all duration-300"
                  >
                    <Instagram size={20} aria-hidden="true" />
                  </a>
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
                <form onSubmit={handleSubmit} className="space-y-6" aria-label="Contact form">
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
                        className="w-full px-5 py-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                        placeholder="Your name"
                      />
                      <ValidationError prefix="Name" field="name" errors={state.errors} className="text-destructive text-sm mt-1" />
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
                        className="w-full px-5 py-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                        placeholder="Your company"
                      />
                    </div>
                  </div>

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
                      className="w-full px-5 py-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                      placeholder="your@email.com"
                    />
                    <ValidationError prefix="Email" field="email" errors={state.errors} className="text-destructive text-sm mt-1" />
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
                        className="w-full px-5 py-4 bg-background border border-border rounded-xl text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                      >
                        <option value="">Select project type</option>
                        {projectTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <ValidationError prefix="Project Type" field="projectType" errors={state.errors} className="text-destructive text-sm mt-1" />
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
                      className="w-full px-5 py-4 bg-background border border-border rounded-xl text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                    >
                      <option value="">Select budget range</option>
                      <option value="Under $5,000">Under $5,000</option>
                      <option value="$5,000 - $15,000">$5,000 - $15,000</option>
                      <option value="$15,000 - $50,000">$15,000 - $50,000</option>
                      <option value="$50,000+">$50,000+</option>
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
                      className="w-full px-5 py-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 resize-none"
                      placeholder="Tell us about your project, goals, and vision..."
                    />
                    <ValidationError prefix="Message" field="message" errors={state.errors} className="text-destructive text-sm mt-1" />
                  </div>

                  <button
                    type="submit"
                    disabled={state.submitting}
                    className="w-full btn-gold flex items-center justify-center gap-2 py-4 text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-busy={state.submitting}
                  >
                    {state.submitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send size={16} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Admin Entry Icon */}
      <AdminEntryIcon />
    </Layout>
  );
};

export default Contact;