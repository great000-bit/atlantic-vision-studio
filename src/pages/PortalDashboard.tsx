import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { 
  Wallet, 
  FileText, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Download,
  User,
  LogOut,
  ChevronRight,
  TrendingUp,
  Calendar,
  DollarSign,
  Briefcase
} from "lucide-react";
import { SEO } from "@/components/SEO";

// Mock data for demonstration
const mockUser = {
  name: "Alex Thompson",
  email: "alex@example.com",
  role: "Videographer",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
  joinedDate: "March 2024",
};

const mockStats = [
  { label: "Total Earnings", value: "$12,450", icon: DollarSign, change: "+15%" },
  { label: "Pending Payment", value: "$2,800", icon: Clock, change: null },
  { label: "Completed Projects", value: "24", icon: Briefcase, change: "+3" },
  { label: "Active Projects", value: "3", icon: TrendingUp, change: null },
];

const mockProjects = [
  {
    id: 1,
    title: "Brand Commercial - TechCorp",
    type: "Video Production",
    status: "In Progress",
    deadline: "Dec 15, 2024",
    payment: "$1,500",
    paymentStatus: "pending",
  },
  {
    id: 2,
    title: "Festival Coverage - SoundWave",
    type: "Event Coverage",
    status: "In Progress",
    deadline: "Dec 20, 2024",
    payment: "$2,200",
    paymentStatus: "pending",
  },
  {
    id: 3,
    title: "Documentary - Ocean Life",
    type: "Documentary",
    status: "Review",
    deadline: "Dec 10, 2024",
    payment: "$3,500",
    paymentStatus: "processing",
  },
];

const mockPayments = [
  { id: 1, project: "Product Shoot - FashionHub", amount: "$1,200", date: "Nov 28, 2024", status: "Paid" },
  { id: 2, project: "Interview Series - StartupX", amount: "$800", date: "Nov 20, 2024", status: "Paid" },
  { id: 3, project: "Music Video - Indie Band", amount: "$1,800", date: "Nov 15, 2024", status: "Paid" },
  { id: 4, project: "Corporate Event - FinanceY", amount: "$2,500", date: "Nov 10, 2024", status: "Paid" },
];

const mockInvoices = [
  { id: "INV-2024-001", project: "Documentary - Ocean Life", amount: "$3,500", date: "Dec 1, 2024" },
  { id: "INV-2024-002", project: "Festival Coverage - SoundWave", amount: "$2,200", date: "Nov 25, 2024" },
  { id: "INV-2024-003", project: "Brand Commercial - TechCorp", amount: "$1,500", date: "Nov 18, 2024" },
];

const PortalDashboard = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "payments" | "invoices">("overview");

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "completed":
        return "text-green-400 bg-green-400/10";
      case "pending":
      case "in progress":
        return "text-yellow-400 bg-yellow-400/10";
      case "processing":
      case "review":
        return "text-blue-400 bg-blue-400/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <Layout>
      <SEO 
        title="Dashboard"
        description="Creator dashboard for Atlantic Creators collective members. View projects, track payments, and manage your account."
        url="https://atlanticcreators.com/portal/dashboard"
      />
      <section className="pt-28 pb-20 min-h-screen bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
              <img
                src={mockUser.avatar}
                alt={mockUser.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary"
              />
              <div>
                <h1 className="font-heading text-2xl font-bold text-foreground">
                  Welcome back, {mockUser.name.split(" ")[0]}!
                </h1>
                <p className="text-muted-foreground text-sm">
                  {mockUser.role} · Member since {mockUser.joinedDate}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/portal"
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut size={18} />
                Sign Out
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {mockStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <stat.icon size={20} />
                  </div>
                  {stat.change && (
                    <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  )}
                </div>
                <p className="font-heading text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "projects", label: "Projects", icon: Briefcase },
              { id: "payments", label: "Payments", icon: Wallet },
              { id: "invoices", label: "Invoices", icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Active Projects */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-heading text-lg font-semibold text-foreground">
                      Active Projects
                    </h2>
                    <button
                      onClick={() => setActiveTab("projects")}
                      className="text-primary text-sm hover:underline flex items-center gap-1"
                    >
                      View All
                      <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {mockProjects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
                      >
                        <div>
                          <h3 className="font-medium text-foreground text-sm mb-1">
                            {project.title}
                          </h3>
                          <p className="text-muted-foreground text-xs">
                            Due: {project.deadline}
                          </p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Payments */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-heading text-lg font-semibold text-foreground">
                      Recent Payments
                    </h2>
                    <button
                      onClick={() => setActiveTab("payments")}
                      className="text-primary text-sm hover:underline flex items-center gap-1"
                    >
                      View All
                      <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {mockPayments.slice(0, 3).map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
                      >
                        <div>
                          <h3 className="font-medium text-foreground text-sm mb-1">
                            {payment.project}
                          </h3>
                          <p className="text-muted-foreground text-xs">{payment.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground text-sm">
                            {payment.amount}
                          </p>
                          <span className={`text-xs ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === "projects" && (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Project
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Type
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Deadline
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {mockProjects.map((project) => (
                        <tr key={project.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-foreground text-sm">{project.title}</p>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground text-sm">
                            {project.type}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground text-sm">
                            {project.deadline}
                          </td>
                          <td className="px-6 py-4 text-foreground text-sm font-medium">
                            {project.payment}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === "payments" && (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Project
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Date
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {mockPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-foreground text-sm">{payment.project}</p>
                          </td>
                          <td className="px-6 py-4 text-foreground text-sm font-medium">
                            {payment.amount}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground text-sm">
                            {payment.date}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                              <CheckCircle size={12} />
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Invoices Tab */}
            {activeTab === "invoices" && (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Invoice ID
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Project
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Date
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {mockInvoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-primary text-sm">{invoice.id}</p>
                          </td>
                          <td className="px-6 py-4 text-foreground text-sm">
                            {invoice.project}
                          </td>
                          <td className="px-6 py-4 text-foreground text-sm font-medium">
                            {invoice.amount}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground text-sm">
                            {invoice.date}
                          </td>
                          <td className="px-6 py-4">
                            <button className="flex items-center gap-2 text-primary hover:underline text-sm">
                              <Download size={14} />
                              Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default PortalDashboard;
