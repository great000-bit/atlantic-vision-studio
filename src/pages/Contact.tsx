import { useState } from "react";
import { motion } from "framer-motion";
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
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    await fetch("https://app.proforms.top/f/pr126f8471", {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
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
            <a
              href="/contact"
              onClick={() => window.location.reload()}
              className="btn-gold inline-flex items-center gap-2"
            >
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
        description="Get in touch with Atlantic Creators Company."
        url="https://www.theatlanticcreators.com/contact"
      />

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
              we'll get back to you within 24–48 hours.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">

            <motion.aside
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
              
              <a
                href="mailto:theatlanticcreators@gmail.com"
                className="flex items-center gap-5 group"
              >
                <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
                  <Mail size={22} />
                </div>
                <div>
                  <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                    Email
                  </div>
                  <div className="text-foreground text-lg font-medium group-hover:text-primary transition-colors">
                    theatlanticcreators@gmail.com
                  </div>
                </div>
              </a>

              <div className="pt-6 border-t border-border">
                <h3 className="text-muted-foreground text-xs uppercase tracking-wider mb-4">
                  Follow Us
                </h3>
                <a
                  href="https://www.instagram.com/atlanticcreatorscompany/"
                  target="_blank"
                  className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition-all duration-300"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </motion.aside>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="bg-card border border-border rounded-2xl p-8 lg:p-12">
                <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
                  Project Inquiry
                </h2>
                <p className="text-muted-foreground text-sm mb-8">
                  Tell us about your vision.
                </p>

                <form onSubmit={submitForm} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-3">
                        Full Name *
                      </label>
                      <input
                        name="name"
                        required
                        maxLength={100}
                        className="w-full px-5 py-4 bg-background border border-border rounded-xl"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-3">
                        Company / Organization
                      </label>
                      <input
                        name="company"
                        maxLength={100}
                        className="w-full px-5 py-4 bg-background border border-border rounded-xl"
                        placeholder="Your company"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-3">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-5 py-4 bg-background border border-border rounded-xl"
                      placeholder="you@email.com"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-3">
                        Project Type *
                      </label>
                      <select
                        name="projectType"
                        required
                        className="w-full px-5 py-4 bg-background border border-border rounded-xl"
                      >
                        <option value="">Select project type</option>
                        {projectTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-3">
                        Timeline
                      </label>
                      <input
                        name="timeline"
                        maxLength={100}
                        className="w-full px-5 py-4 bg-background border border-border rounded-xl"
                        placeholder="e.g., Q1 2025"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-3">
                      Budget Range
                    </label>
                    <select
                      name="budget"
                      className="w-full px-5 py-4 bg-background border border-border rounded-xl"
                    >
                      <option value="">Select budget range</option>
                      <option value="Under $5,000">Under $5,000</option>
                      <option value="$5,000 - $15,000">$5,000 - $15,000</option>
                      <option value="$15,000 - $50,000">$15,000 - $50,000</option>
                      <option value="$50,000+">$50,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-3">
                      Project Details *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      maxLength={2000}
                      className="w-full px-5 py-4 bg-background border border-border rounded-xl resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-gold flex items-center justify-center gap-2 py-4 text-sm uppercase tracking-wider disabled:opacity-50"
                  >
                    {loading ? "Sending..." : <>Send Message <Send size={16} /></>}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <AdminEntryIcon />
    </Layout>
  );
};

export default Contact;