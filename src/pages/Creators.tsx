import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Users,
  Wallet,
  Briefcase,
  Star,
  ChevronDown,
  Send,
  CheckCircle,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SEO } from "@/components/SEO";

const benefits = [
  {
    icon: Briefcase,
    title: "Premium Projects",
    description:
      "Access national-scale projects with top brands, tourism boards, events, and corporates.",
  },
  {
    icon: Wallet,
    title: "Transparent Payments",
    description:
      "Our internal payment portal ensures fair, timely payouts with full transparency.",
  },
  {
    icon: Users,
    title: "Professional Network",
    description: "Collaborate with like-minded professionals and expand your creative network.",
  },
  {
    icon: Star,
    title: "Studio Access",
    description: "Get access to our professional media and podcast studios for your projects.",
  },
];

const roles = [
  "Photographer",
  "Videographer",
  "Video Editor",
  "Audio Engineer",
  "Drone Operator",
  "Motion Graphics Designer",
  "Producer",
  "Other",
];

const faqs = [
  {
    question: "How does the payment system work?",
    answer:
      "We operate on project-based compensation with clear payment terms. Once a project is completed and approved, payments are processed within 7-14 business days through our secure payment portal.",
  },
  {
    question: "What's the application process?",
    answer:
      "Submit your application through our form with your portfolio. Our team reviews applications weekly. If selected, you'll have a brief interview to discuss your experience and collaboration expectations.",
  },
  {
    question: "What equipment do I need?",
    answer:
      "Requirements vary by role. Generally, we expect professional-grade equipment appropriate to your specialty. Studio projects can utilize our in-house equipment.",
  },
  {
    question: "Can I work on my own projects while in the collective?",
    answer:
      "Absolutely. We encourage creative freedom. The collective is a collaborative opportunity, not an exclusive contract. You maintain full control over your independent work.",
  },
];

const PROFORMS_ENDPOINT = "https://app.proforms.top/f/pr1274f8b5";

const Creators = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const formEl = e.currentTarget;
      const formData = new FormData(formEl);
      const payload = Object.fromEntries(formData.entries());

      const res = await fetch(PROFORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = `Submission failed (${res.status})`;
        try {
          const json = await res.json();
          if (json?.message) msg = json.message;
        } catch {
          /* ignore */
        }
        throw new Error(msg);
      }

      setSubmitted(true);
      formEl.reset();
    } catch (err: any) {
      setError(err?.message || "An error occurred while submitting the form.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <SEO
          title="Creators Collective"
          description="Join Atlantic Creators Collective - a network of professional photographers, videographers, editors, and audio professionals."
          url="https://www.theatlanticcreators.com/creators"
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
              Application Submitted!
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Thanks for reaching out! We'll review your application and get back to you shortly.
            </p>
            <a href="/creators" onClick={() => window.location.reload()} className="btn-gold inline-flex items-center gap-2">
              Back to Creators
            </a>
          </motion.div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="Creators Collective"
        description="Join Atlantic Creators Collective - a network of professional photographers, videographers, editors, and audio professionals. Access premium projects and transparent payments."
        url="https://www.theatlanticcreators.com/creators"
        keywords="join creators collective, freelance videographer, freelance photographer, media production network, creator opportunities"
      />

      <section className="pt-32 pb-20 bg-background relative overflow-hidden" aria-labelledby="creators-heading">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 to-transparent pointer-events-none" aria-hidden="true" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-block text-primary text-sm font-medium tracking-[0.2em] uppercase mb-4">
              Join the Collective
            </span>
            <h1 id="creators-heading" className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Creators <span className="text-gradient-gold">Collective</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Are you a talented photographer, videographer, editor, or audio professional? Join our network of creators and collaborate on high-profile projects with reliable, transparent payments.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-card" aria-labelledby="benefits-heading">
        <div className="container mx-auto px-6 lg:px-8">
          <SectionHeading
            label="Why Join"
            title="Benefits of the Collective"
            subtitle="More than just a network — a partnership built on trust, quality, and mutual success."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8" role="list">
            {benefits.map((benefit, index) => (
              <motion.article
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
                role="listitem"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4" aria-hidden="true">
                  <benefit.icon size={24} />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-background" aria-labelledby="portal-heading">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-primary text-sm font-medium tracking-[0.2em] uppercase mb-4">
                Payment Portal
              </span>
              <h2 id="portal-heading" className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Transparent, Reliable Payments
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our internal payment portal is designed with creators in mind. Track your projects, view payment status, download invoices, and manage your earnings — all in one secure dashboard.
              </p>
              <ul className="space-y-3" role="list">
                {[
                  "Clear project tracking and status updates",
                  "Secure, timely payments within 7-14 days",
                  "Downloadable invoices and payment history",
                  "Direct deposit to your preferred account",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-foreground">
                    <Check size={18} className="text-primary flex-shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card border border-border rounded-2xl p-6"
              aria-label="Payment portal preview"
            >
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">Current Balance</span>
                    <span className="text-primary text-sm font-medium">Available</span>
                  </div>
                  <div className="font-heading text-3xl font-bold text-foreground">$4,250.00</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-card border border-border rounded-lg p-3 text-center">
                    <div className="text-primary text-xl font-bold">12</div>
                    <div className="text-muted-foreground text-xs">Projects</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-3 text-center">
                    <div className="text-primary text-xl font-bold">3</div>
                    <div className="text-muted-foreground text-xs">Pending</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-3 text-center">
                    <div className="text-primary text-xl font-bold">$18k</div>
                    <div className="text-muted-foreground text-xs">Total Earned</div>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs text-center pt-2">
                  Portal preview — actual dashboard available after joining
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-card" aria-labelledby="apply-heading">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <SectionHeading
              label="Apply Now"
              title="Join the Collective"
              subtitle="Fill out the form below to apply. We review applications weekly and will be in touch."
            />

            <motion.form
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onSubmit={handleSubmit}
              className="space-y-6"
              aria-label="Creator application form"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="creator-name" className="block text-sm font-medium text-foreground mb-2">
                    Full Name <span className="text-primary" aria-label="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="creator-name"
                    name="name"
                    required
                    autoComplete="name"
                    maxLength={100}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg input-cinematic"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="creator-email" className="block text-sm font-medium text-foreground mb-2">
                    Email <span className="text-primary" aria-label="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="creator-email"
                    name="email"
                    required
                    autoComplete="email"
                    maxLength={255}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg input-cinematic"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="creator-role" className="block text-sm font-medium text-foreground mb-2">
                    Primary Role <span className="text-primary" aria-label="required">*</span>
                  </label>
                  <select
                    id="creator-role"
                    name="role"
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg input-cinematic"
                  >
                    <option value="">Select your role</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="creator-location" className="block text-sm font-medium text-foreground mb-2">
                    Location <span className="text-primary" aria-label="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="creator-location"
                    name="location"
                    required
                    autoComplete="address-level2"
                    maxLength={100}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg input-cinematic"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="creator-portfolio" className="block text-sm font-medium text-foreground mb-2">
                  Portfolio Link <span className="text-primary" aria-label="required">*</span>
                </label>
                <input
                  type="url"
                  id="creator-portfolio"
                  name="portfolio"
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg input-cinematic"
                  placeholder="https://yourportfolio.com"
                />
              </div>

              <div>
                <label htmlFor="creator-experience" className="block text-sm font-medium text-foreground mb-2">
                  Relevant Experience <span className="text-primary" aria-label="required">*</span>
                </label>
                <textarea
                  id="creator-experience"
                  name="experience"
                  required
                  rows={4}
                  maxLength={2000}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg input-cinematic resize-none"
                  placeholder="Tell us about your experience, notable projects, and what you bring to the collective..."
                />
              </div>

              {error && (
                <div className="text-destructive text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-gold flex items-center justify-center gap-2 py-4 text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : (
                  <>
                    Submit Application
                    <Send size={16} aria-hidden="true" />
                  </>
                )}
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background" aria-labelledby="faq-heading">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <SectionHeading
              label="FAQs"
              title="Common Questions"
              subtitle="Everything you need to know about joining the collective."
            />

            <div className="space-y-4" role="list">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                  role="listitem"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                    aria-expanded={expandedFaq === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className="font-heading font-semibold text-foreground pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-primary flex-shrink-0 transition-transform duration-300 ${
                        expandedFaq === index ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {expandedFaq === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-5"
                    >
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Creators;