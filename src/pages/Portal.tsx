import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff,
  ArrowRight,
  Shield,
  Wallet,
  FileText,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";

const features = [
  {
    icon: Wallet,
    title: "Payment Tracking",
    description: "Monitor your earnings, pending payments, and complete payment history.",
  },
  {
    icon: FileText,
    title: "Project Management",
    description: "View assigned projects, deadlines, and deliverable requirements.",
  },
  {
    icon: Clock,
    title: "Invoice Access",
    description: "Download invoices and receipts for all completed projects.",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Bank-level security protecting your data and payment information.",
  },
];

const Portal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (isLogin) {
      // Login flow - redirect to dashboard
      toast({
        title: "Welcome Back!",
        description: "Successfully signed in to your account.",
      });
      navigate("/portal/dashboard");
    } else {
      // Sign up flow - show success and switch to login
      toast({
        title: "Account Created!",
        description: "Your account has been created. Please sign in.",
      });
      setIsLogin(true);
      setFormData({ ...formData, password: "", confirmPassword: "" });
    }
    setIsLoading(false);
  };

  return (
    <Layout>
      <SEO 
        title="Artist Portal"
        description="Secure creator portal for Atlantic Creators collective members. Track projects, manage payments, and download invoices."
        url="https://atlanticcreators.com/portal"
      />
      <section className="pt-32 pb-20 min-h-screen bg-background relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 to-transparent pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 text-primary text-sm font-medium tracking-[0.2em] uppercase mb-4">
                <Lock size={16} />
                Creator Portal
              </span>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                Artist Payment{" "}
                <span className="text-gradient-gold">Portal</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed mb-10">
                The secure hub for Atlantic Creators collective members. Track projects, 
                manage payments, download invoices, and stay connected with your work.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <feature.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 pt-10 border-t border-border">
                <p className="text-muted-foreground text-sm mb-4">
                  Not a member yet? Join our creators collective.
                </p>
                <Link
                  to="/creators"
                  className="text-primary hover:underline text-sm font-medium inline-flex items-center gap-2"
                >
                  Apply to Join
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>

            {/* Right - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-card border border-border rounded-2xl p-8 lg:p-10 max-w-md mx-auto">
                {/* Tab Switcher */}
                <div className="flex bg-muted rounded-lg p-1 mb-8">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
                      isLogin
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
                      !isLogin
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg input-cinematic"
                        placeholder="Your full name"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 pl-11 bg-background border border-border rounded-lg input-cinematic"
                        placeholder="your@email.com"
                      />
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-3 pl-11 pr-11 bg-background border border-border rounded-lg input-cinematic"
                        placeholder="••••••••"
                      />
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="w-full px-4 py-3 pl-11 bg-background border border-border rounded-lg input-cinematic"
                          placeholder="••••••••"
                        />
                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>
                  )}

                  {isLogin && (
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        className="text-primary text-sm hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-gold flex items-center justify-center gap-2 text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        {isLogin ? "Signing In..." : "Creating Account..."}
                      </span>
                    ) : (
                      <>
                        {isLogin ? "Sign In" : "Create Account"}
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-muted-foreground text-xs">
                    By continuing, you agree to our{" "}
                    <Link to="/terms" className="text-primary hover:underline">Terms</Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
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

export default Portal;
