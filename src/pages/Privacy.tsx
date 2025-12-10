import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Shield, Database, Cookie, Users, Mail, FileText } from "lucide-react";

const Privacy = () => {
  const lastUpdated = "December 10, 2025";

  return (
    <Layout>
      <SEO 
        title="Privacy Policy"
        description="Privacy Policy for Atlantic Creators Company. Learn how we collect, use, and protect your personal information."
        url="https://www.theatlanticcreators.com/privacy"
      />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
              <Shield size={32} />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-lg">
              Last updated: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="prose prose-invert max-w-none"
            >
              {/* Introduction */}
              <div className="bg-card border border-border rounded-2xl p-8 mb-8">
                <p className="text-muted-foreground leading-relaxed">
                  Atlantic Creators Company ("we," "our," or "us") is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                  when you visit our website atlanticcreators.com and use our services.
                </p>
              </div>

              {/* Section 1 */}
              <div className="bg-card border border-border rounded-2xl p-8 mb-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Database size={24} />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-foreground m-0">
                    1. Information We Collect
                  </h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    <strong className="text-foreground">Personal Information:</strong> When you submit a contact form, 
                    apply to join our creators collective, or book our services, we may collect:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Full name</li>
                    <li>Email address</li>
                    <li>Company or organization name</li>
                    <li>Project details and requirements</li>
                    <li>Portfolio links (for creator applications)</li>
                  </ul>
                  <p className="leading-relaxed">
                    <strong className="text-foreground">Automatically Collected Information:</strong> We automatically 
                    collect certain information when you visit our website, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>IP address and browser type</li>
                    <li>Device information</li>
                    <li>Pages visited and time spent</li>
                    <li>Referring website</li>
                  </ul>
                </div>
              </div>

              {/* Section 2 */}
              <div className="bg-card border border-border rounded-2xl p-8 mb-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Users size={24} />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-foreground m-0">
                    2. How We Use Your Information
                  </h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">We use the information we collect to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Respond to your inquiries and project requests</li>
                    <li>Process creator applications and manage our collective</li>
                    <li>Provide and improve our media production services</li>
                    <li>Send you relevant updates about our services (with your consent)</li>
                    <li>Analyze website usage to improve user experience</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div className="bg-card border border-border rounded-2xl p-8 mb-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Shield size={24} />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-foreground m-0">
                    3. Data Storage and Security
                  </h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    Your data is stored securely using industry-standard cloud infrastructure. We implement 
                    appropriate technical and organizational measures to protect your personal information against:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Unauthorized access or disclosure</li>
                    <li>Accidental loss or destruction</li>
                    <li>Unlawful processing</li>
                  </ul>
                  <p className="leading-relaxed">
                    We retain your personal information only for as long as necessary to fulfill the purposes 
                    outlined in this policy or as required by law.
                  </p>
                </div>
              </div>

              {/* Section 4 */}
              <div className="bg-card border border-border rounded-2xl p-8 mb-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Cookie size={24} />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-foreground m-0">
                    4. Cookies and Tracking
                  </h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    Our website uses cookies and similar tracking technologies to enhance your browsing experience. 
                    These include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong className="text-foreground">Essential Cookies:</strong> Required for website functionality</li>
                    <li><strong className="text-foreground">Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                    <li><strong className="text-foreground">Preference Cookies:</strong> Remember your settings and preferences</li>
                  </ul>
                  <p className="leading-relaxed">
                    You can control cookie preferences through your browser settings. Note that disabling certain 
                    cookies may affect website functionality.
                  </p>
                </div>
              </div>

              {/* Section 5 */}
              <div className="bg-card border border-border rounded-2xl p-8 mb-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <FileText size={24} />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-foreground m-0">
                    5. Third-Party Services
                  </h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    We may use third-party services that collect, monitor, and analyze user data:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong className="text-foreground">Analytics:</strong> To understand website traffic and user behavior</li>
                    <li><strong className="text-foreground">Cloud Hosting:</strong> For secure data storage and website delivery</li>
                    <li><strong className="text-foreground">Social Media:</strong> Embedded content from platforms like Instagram</li>
                  </ul>
                  <p className="leading-relaxed">
                    These third-party services have their own privacy policies governing the use of your information.
                  </p>
                </div>
              </div>

              {/* Section 6 */}
              <div className="bg-card border border-border rounded-2xl p-8 mb-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Users size={24} />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-foreground m-0">
                    6. Your Rights
                  </h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">You have the right to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Access the personal information we hold about you</li>
                    <li>Request correction of inaccurate information</li>
                    <li>Request deletion of your personal information</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Withdraw consent where applicable</li>
                  </ul>
                  <p className="leading-relaxed">
                    To exercise any of these rights, please contact us using the information below.
                  </p>
                </div>
              </div>

              {/* Section 7 - Terms of Service Summary */}
              <div className="bg-card border border-border rounded-2xl p-8 mb-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <FileText size={24} />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-foreground m-0">
                    7. Terms of Service & Disclaimer
                  </h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    By using our website and services, you agree to the following terms:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>All content on this website is owned by Atlantic Creators Company</li>
                    <li>Services are provided as described and subject to availability</li>
                    <li>Project quotes and timelines are estimates and may vary</li>
                    <li>We reserve the right to refuse service at our discretion</li>
                    <li>Client deliverables are subject to agreed-upon contracts</li>
                  </ul>
                  <p className="leading-relaxed">
                    <strong className="text-foreground">Disclaimer:</strong> While we strive for excellence in all our work, 
                    we cannot guarantee specific results from our media production services. Final deliverables 
                    are subject to the scope and terms agreed upon in individual project contracts.
                  </p>
                </div>
              </div>

              {/* Contact Section */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Mail size={24} />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-foreground m-0">
                    8. Contact Us
                  </h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    If you have any questions about this Privacy Policy or wish to exercise your rights, 
                    please contact us:
                  </p>
                  <div className="bg-background border border-border rounded-xl p-6 mt-4">
                    <p className="font-semibold text-foreground mb-2">Atlantic Creators Company</p>
                    <a 
                      href="mailto:theatlanticcreators@gmail.com" 
                      className="text-primary hover:underline"
                    >
                      theatlanticcreators@gmail.com
                    </a>
                  </div>
                  <p className="leading-relaxed mt-4">
                    We will respond to your inquiry within 30 business days.
                  </p>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
