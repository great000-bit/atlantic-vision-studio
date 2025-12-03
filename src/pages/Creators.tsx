import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { 
  Check, 
  Users, 
  Wallet, 
  Briefcase, 
  Star,
  ChevronDown,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { creatorFormSchema, sanitizeInput, type CreatorFormData } from "@/lib/validation";

const benefits = [
  {
    icon: Briefcase,
    title: "Premium Projects",
    description: "Access national-scale projects with top brands, tourism boards, events, and corporates.",
  },
  {
    icon: Wallet,
    title: "Transparent Payments",
    description: "Our internal payment portal ensures fair, timely payouts with full transparency.",
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
    answer: "We operate on project-based compensation with clear payment terms. Once a project is completed and approved, payments are processed within 7-14 business days through our secure payment portal.",
  },
  {
    question: "What's the application process?",
    answer: "Submit your application through our form with your portfolio. Our team reviews applications weekly. If selected, you'll have a brief interview to discuss your experience and collaboration expectations.",
  },
  {
    question: "What equipment do I need?",
    answer: "Requirements vary by role. Generally, we expect professional-grade equipment appropriate to your specialty. Studio projects can utilize our in-house equipment.",
  },
  {
    question: "Can I work on my own projects while in the collective?",
    answer: "Absolutely. We encourage creative freedom. The collective is a collaborative opportunity, not an exclusive contract. You maintain full control over your independent work.",
  },
];

const Creators = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    portfolio: "",
    experience: "",
    location: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreatorFormData, string>>>({});
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
      experience: sanitizeInput(formData.experience),
      location: sanitizeInput(formData.location),
    };

    // Validate with zod
    const result = creatorFormSchema.safeParse(sanitizedData);
    
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CreatorFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof CreatorFormData;
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
      title: "Application Submitted!",
      description: "Thank you for your interest. We'll be in touch soon.",
    });
    setFormData({
      name: "",
      email: "",
      role: "",
      portfolio: "",
      experience: "",
      location: "",
    });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <SEO 
        title="Creators Collective"
        description="Join Atlantic Creators Collective - a network of professional photographers, videographers, editors, and audio professionals. Access premium projects and transparent payments."
        url="https://atlanticcreators.com/creators"
        keywords="join creators collective, freelance videographer, freelance photographer, media production network, creator opportunities"
      />
      {/* Hero Section */}
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
              Creators{" "}
              <span className="text-gradient-gold">Collective</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Are you a talented photographer, videographer, editor, or audio professional? 
              Join our network of creators and collaborate on high-profile projects with 
              reliable, transparent payments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
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

      {/* Payment Portal Info */}
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
                Our internal payment portal is designed with creators in mind. Track your 
                projects, view payment status, download invoices, and manage your earnings — 
                all in one secure dashboard.
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

      {/* Application Form */}
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
              noValidate
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
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 bg-background border rounded-lg input-cinematic ${errors.name ? 'border-destructive' : 'border-border'}`}
                    placeholder="Your name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "creator-name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="creator-name-error" className="text-destructive text-sm mt-1" role="alert">{errors.name}</p>
                  )}
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 bg-background border rounded-lg input-cinematic ${errors.email ? 'border-destructive' : 'border-border'}`}
                    placeholder="your@email.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "creator-email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="creator-email-error" className="text-destructive text-sm mt-1" role="alert">{errors.email}</p>
                  )}
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
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={`w-full px-4 py-3 bg-background border rounded-lg input-cinematic ${errors.role ? 'border-destructive' : 'border-border'}`}
                    aria-invalid={!!errors.role}
                    aria-describedby={errors.role ? "creator-role-error" : undefined}
                  >
                    <option value="">Select your role</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  {errors.role && (
                    <p id="creator-role-error" className="text-destructive text-sm mt-1" role="alert">{errors.role}</p>
                  )}
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
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={`w-full px-4 py-3 bg-background border rounded-lg input-cinematic ${errors.location ? 'border-destructive' : 'border-border'}`}
                    placeholder="City, Country"
                    aria-invalid={!!errors.location}
                    aria-describedby={errors.location ? "creator-location-error" : undefined}
                  />
                  {errors.location && (
                    <p id="creator-location-error" className="text-destructive text-sm mt-1" role="alert">{errors.location}</p>
                  )}
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
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  className={`w-full px-4 py-3 bg-background border rounded-lg input-cinematic ${errors.portfolio ? 'border-destructive' : 'border-border'}`}
                  placeholder="https://yourportfolio.com"
                  aria-invalid={!!errors.portfolio}
                  aria-describedby={errors.portfolio ? "creator-portfolio-error" : undefined}
                />
                {errors.portfolio && (
                  <p id="creator-portfolio-error" className="text-destructive text-sm mt-1" role="alert">{errors.portfolio}</p>
                )}
              </div>

              <div>
                <label htmlFor="creator-experience" className="block text-sm font-medium text-foreground mb-2">
                  Experience & Background <span className="text-primary" aria-label="required">*</span>
                </label>
                <textarea
                  id="creator-experience"
                  name="experience"
                  required
                  rows={4}
                  maxLength={2000}
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className={`w-full px-4 py-3 bg-background border rounded-lg input-cinematic resize-none ${errors.experience ? 'border-destructive' : 'border-border'}`}
                  placeholder="Tell us about your experience, notable projects, and why you'd like to join the collective..."
                  aria-invalid={!!errors.experience}
                  aria-describedby={errors.experience ? "creator-experience-error" : undefined}
                />
                {errors.experience && (
                  <p id="creator-experience-error" className="text-destructive text-sm mt-1" role="alert">{errors.experience}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-gold flex items-center justify-center gap-2 text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} aria-hidden="true" />
                    Submit Application
                  </>
                )}
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-background" aria-labelledby="faq-heading">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <SectionHeading
              label="Questions"
              title="Frequently Asked"
              subtitle="Everything you need to know about joining the collective."
            />

            <div className="space-y-4" role="list" aria-label="Frequently asked questions">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                  role="listitem"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                    aria-expanded={expandedFaq === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className="font-heading font-semibold text-foreground">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-primary transition-transform duration-300 ${
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
                      className="px-6 pb-6"
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
