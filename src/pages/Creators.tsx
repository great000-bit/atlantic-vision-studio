import { useState, useRef } from "react";
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
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  Video,
} from "lucide-react";
// Assuming these imports are correctly aliased in your project
import { Layout } from "@/components/layout/Layout"; 
import { SectionHeading } from "@/components/ui/SectionHeading"; 
import { SEO } from "@/components/SEO"; 
import { supabase } from "@/integrations/supabase/client"; 
import { useToast } from "@/hooks/use-toast"; 

// --- Constants ---
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

// No file type restrictions - accept all files
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB per file
const MAX_FILES = 20; // Allow up to 20 files

/**
 * Helper function to determine the appropriate icon for a file based on its MIME type.
 * @param type The MIME type of the file (e.g., 'image/jpeg', 'application/pdf').
 * @returns The LucideReact icon component.
 */
const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return ImageIcon;
  if (type.startsWith("video/")) return Video;
  return FileText;
};

// --- Main Component ---
const Creators = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [experienceText, setExperienceText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const MIN_EXPERIENCE_LENGTH = 100;
  const MAX_EXPERIENCE_LENGTH = 2000;

  /**
   * Handles the selection of files from the input element, performing validation.
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // 1. Validate files - only size restriction
    const validFiles: File[] = [];
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`,
          variant: "destructive",
        });
        continue;
      }
      validFiles.push(file);
    }

    // 2. Validate total file count
    if (uploadedFiles.length + validFiles.length > MAX_FILES) {
      toast({
        title: "Too many files",
        description: `You can upload a maximum of ${MAX_FILES} files.`,
        variant: "destructive",
      });
      return;
    }

    // 3. Update state and clear the input value to allow the same file to be selected again
    setUploadedFiles((prev) => [...prev, ...validFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * Removes a file from the list of files to be uploaded.
   * @param index The index of the file to remove.
   */
  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Uploads all files in the uploadedFiles state to Supabase Storage.
   * @returns A promise that resolves to an array of public URLs for the uploaded files.
   */
  const uploadFilesToStorage = async (): Promise<string[]> => {
    const urls: string[] = [];
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      // Create a unique path: applications/timestamp_index_sanitizedname
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "");
      const filePath = `applications/${Date.now()}_${i}_${sanitizedName}`;
      
      const { data, error } = await supabase.storage
        .from("creator-uploads")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false, // Prevent overwriting
        });
      
      if (error) {
        console.error("Supabase Upload error:", error);
        throw new Error(`Failed to upload file ${file.name}. Please ensure your Supabase Storage bucket has the correct RLS policy.`);
      }
      
      // Get the public URL for the newly uploaded file
      const { data: urlData } = supabase.storage
        .from("creator-uploads")
        .getPublicUrl(data.path);
      
      if (!urlData || !urlData.publicUrl) {
          throw new Error(`Failed to retrieve public URL for ${file.name}`);
      }
      
      urls.push(urlData.publicUrl);
    }
    
    return urls;
  };

  /**
   * Handles the overall form submission, including file upload and sending to ProForms.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const formEl = e.currentTarget;
      const formData = new FormData(formEl);
      
      // 1. Upload files first if any
      setUploading(true);
      let fileUrls: string[] = [];
      if (uploadedFiles.length > 0) {
        fileUrls = await uploadFilesToStorage();
      }
      setUploading(false);

      // 2. Prepare form data for ProForms
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const role = formData.get("role") as string;
      const location = formData.get("location") as string;
      const portfolio = formData.get("portfolio") as string;
      const experience = formData.get("experience") as string;

      // 3. Insert application into database (optional - remove if not needed)
      try {
        await supabase.from("creator_applications").insert({
          name,
          email,
          role,
          location,
          portfolio_link: portfolio || null,
          experience,
          file_urls: fileUrls,
        });
      } catch (dbError) {
        console.log("Database insert skipped:", dbError);
        // Continue with email submission even if DB fails
      }

      // 4. Send to ProForms endpoint
      const proformsData = new FormData();
      proformsData.append("name", name);
      proformsData.append("email", email);
      proformsData.append("role", role);
      proformsData.append("location", location);
      proformsData.append("portfolio", portfolio);
      proformsData.append("experience", experience);
      
      // Add file URLs to the form data
      if (fileUrls.length > 0) {
        proformsData.append("file_urls", fileUrls.join(", "));
      }

      // Replace 'YOUR_PROFORMS_ENDPOINT' with your actual ProForms form endpoint
      const proformsEndpoint = "https://app.proforms.top/f/pr1274f8b5";
      
      const response = await fetch(proformsEndpoint, {
        method: "POST",
        body: proformsData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to submit application. Please try again.");
      }

      setSubmitted(true);
      // Clear states/inputs after successful submission
      setUploadedFiles([]);
      setExperienceText("");
      formEl.reset();
    } catch (err: any) {
      // General error handling for upload or submission failures
      setError(err?.message || "An unexpected error occurred while submitting the form.");
      toast({
        title: "Submission Failed",
        description: err?.message || "Please check your network and try again.",
        variant: "destructive",
      });
    } finally {
      // Ensure loading states are cleared regardless of success or failure
      setSubmitting(false);
      setUploading(false);
    }
  };

  // --- Render Submitted State ---
  if (submitted) {
    return (
      <Layout>
        <SEO
          title="Creators Collective"
          description="Application successfully submitted to Atlantic Creators Collective."
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

  // --- Render Main Application Form ---
  return (
    <Layout>
      <SEO
        title="Creators Collective"
        description="Join Atlantic Creators Collective - a network of professional photographers, videographers, editors, and audio professionals. Access premium projects and transparent payments."
        url="https://www.theatlanticcreators.com/creators"
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
              Creators <span className="text-gradient-gold">Collective</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Are you a talented photographer, videographer, editor, or audio professional? Join our network of creators and collaborate on high-profile projects with reliable, transparent payments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
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

      {/* Payment Portal Section */}
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

      {/* Application Form Section */}
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
                    defaultValue=""
                  >
                    <option value="" disabled>Select your role</option>
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
                  Portfolio Link <span className="text-muted-foreground text-xs">(Optional)</span>
                </label>
                <input
                  type="url"
                  id="creator-portfolio"
                  name="portfolio"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg input-cinematic"
                  placeholder="https://yourportfolio.com (e.g., Behance, personal site)"
                />
              </div>

              {/* File Upload Section */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Upload Files <span className="text-muted-foreground text-xs">(Optional - CV, Work Samples, etc.)</span>
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-foreground font-medium mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-muted-foreground text-sm">
                      All file types accepted (Max {MAX_FILE_SIZE / 1024 / 1024}MB each, up to {MAX_FILES} files)
                    </p>
                  </label>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-foreground">Files to upload ({uploadedFiles.length}):</p>
                    {uploadedFiles.map((file, index) => {
                      const FileIcon = getFileIcon(file.type);
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-background border border-border rounded-lg px-4 py-3"
                          role="alert"
                          aria-live="polite"
                        >
                          <div className="flex items-center gap-3">
                            <FileIcon className="w-5 h-5 text-primary flex-shrink-0" />
                            <div>
                              <p className="text-foreground text-sm font-medium truncate max-w-[200px] sm:max-w-full">
                                {file.name}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-muted-foreground hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-500/10"
                            aria-label={`Remove file ${file.name}`}
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
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
                  minLength={MIN_EXPERIENCE_LENGTH}
                  maxLength={MAX_EXPERIENCE_LENGTH}
                  value={experienceText}
                  onChange={(e) => setExperienceText(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg input-cinematic resize-none"
                  placeholder="Tell us about your experience, notable projects, and what you bring to the collective..."
                />
                <div className="flex items-center justify-between mt-2">
                  <p className={`text-xs ${experienceText.length < MIN_EXPERIENCE_LENGTH ? 'text-red-400' : 'text-muted-foreground'}`}>
                    {experienceText.length < MIN_EXPERIENCE_LENGTH 
                      ? `Minimum ${MIN_EXPERIENCE_LENGTH} characters required` 
                      : 'Character count'}
                  </p>
                  <p className={`text-xs ${
                    experienceText.length < MIN_EXPERIENCE_LENGTH 
                      ? 'text-red-400 font-medium' 
                      : experienceText.length >= MAX_EXPERIENCE_LENGTH 
                      ? 'text-primary font-medium' 
                      : 'text-muted-foreground'
                  }`}>
                    {experienceText.length} / {MAX_EXPERIENCE_LENGTH}
                  </p>
                </div>
              </div>

              {error && (
                <div className="text-red-500 bg-red-500/10 p-3 rounded-lg text-sm" role="alert">
                  <strong>Submission Error:</strong> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || uploading || experienceText.length < MIN_EXPERIENCE_LENGTH}
                className="w-full btn-gold flex items-center justify-center gap-2 py-4 text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  uploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Uploading files...
                    </>
                  ) : (
                    <>
                      <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Submitting Application...
                    </>
                  )
                ) : (
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

      {/* FAQ Section */}
      <section className="section-padding bg-background" aria-labelledby="faq-heading">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <SectionHeading
              label="FAQ"
              title="Questions & Answers"
              subtitle="Everything you need to know about joining and working with the collective."
            />

            <div className="space-y-4" role="list">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="border border-border rounded-xl overflow-hidden"
                  role="listitem"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left bg-card hover:bg-card/80 transition-colors"
                    aria-expanded={expandedFaq === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className="font-heading text-foreground font-medium pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-primary flex-shrink-0 transition-transform ${
                        expandedFaq === index ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  <motion.div
                    id={`faq-answer-${index}`}
                    initial={false}
                    animate={{
                      height: expandedFaq === index ? "auto" : 0,
                      opacity: expandedFaq === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
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