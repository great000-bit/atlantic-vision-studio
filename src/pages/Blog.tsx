import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User, Tag, Search, Clock } from "lucide-react";

const categories = [
  "All",
  "Media Tips",
  "Behind the Scenes",
  "Company News",
  "Projects",
  "Creator Interviews",
];

const blogPosts = [
  {
    id: 1,
    title: "5 Cinematic Techniques Every Brand Video Needs",
    excerpt: "Discover the essential cinematography techniques that transform ordinary brand videos into compelling visual stories that captivate audiences.",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
    category: "Media Tips",
    author: "Marcus Chen",
    date: "Nov 28, 2024",
    readTime: "5 min read",
    featured: true,
  },
  {
    id: 2,
    title: "Behind the Scenes: SoundWave Festival 2024",
    excerpt: "Take an exclusive look at how our team captured three days of incredible performances at one of the year's biggest music festivals.",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
    category: "Behind the Scenes",
    author: "Sarah Williams",
    date: "Nov 25, 2024",
    readTime: "8 min read",
    featured: true,
  },
  {
    id: 3,
    title: "Atlantic Creators Expands to New Studio Space",
    excerpt: "We're excited to announce our new state-of-the-art studio facility, featuring enhanced podcast rooms and expanded production capabilities.",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
    category: "Company News",
    author: "Atlantic Team",
    date: "Nov 20, 2024",
    readTime: "3 min read",
    featured: false,
  },
  {
    id: 4,
    title: "Creator Spotlight: Interview with Alex Thompson",
    excerpt: "Meet Alex Thompson, one of our talented videographers who's been creating stunning content for major brands across the country.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
    category: "Creator Interviews",
    author: "Editorial Team",
    date: "Nov 18, 2024",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: 5,
    title: "The Future of Documentary Filmmaking",
    excerpt: "How emerging technologies and changing viewer habits are reshaping the documentary landscape and what it means for creators.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
    category: "Media Tips",
    author: "James Rodriguez",
    date: "Nov 15, 2024",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: 6,
    title: "Project Showcase: Ocean Life Documentary",
    excerpt: "An in-depth look at the production process behind our award-nominated documentary exploring marine ecosystems.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    category: "Projects",
    author: "Documentary Team",
    date: "Nov 10, 2024",
    readTime: "10 min read",
    featured: false,
  },
];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-transparent pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-block text-primary text-sm font-medium tracking-[0.2em] uppercase mb-4">
              Blog & Insights
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Insights from{" "}
              <span className="text-gradient-gold">Behind the Lens</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Explore stories, tips, and updates from the creators' collective. 
              Learn from industry experts and get behind-the-scenes access.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-card border-y border-border">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-11 bg-background border border-border rounded-lg input-cinematic"
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container mx-auto px-6 lg:px-8">
            <SectionHeading
              label="Featured"
              title="Latest Stories"
              subtitle="Our most recent and impactful articles"
            />

            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Link to={`/blog/${post.id}`} className="block">
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                      <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm mb-3">
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <span className="text-secondary font-medium text-sm inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                      Read More
                      <ArrowRight size={14} />
                    </span>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts Grid */}
      <section className="section-padding bg-card">
        <div className="container mx-auto px-6 lg:px-8">
          <SectionHeading
            label="All Articles"
            title="Explore More"
            subtitle="Browse our complete collection of insights and stories"
          />

          {regularPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-background border border-border rounded-2xl overflow-hidden"
                >
                  <Link to={`/blog/${post.id}`} className="block">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-foreground text-xs px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-muted-foreground text-xs mb-3">
                        <span>{post.date}</span>
                        <span>·</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="font-heading text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                      <span className="text-secondary font-medium text-sm inline-flex items-center gap-2">
                        Read Article
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No articles found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4 text-secondary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Load More */}
          {regularPosts.length > 0 && (
            <div className="text-center mt-12">
              <button className="btn-outline-gold text-sm uppercase tracking-wider">
                Load More Articles
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center bg-card border border-border rounded-2xl p-10"
          >
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
              Stay Updated
            </h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter for the latest insights, tips, and behind-the-scenes content.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg input-cinematic"
              />
              <button type="submit" className="btn-gold text-sm uppercase tracking-wider whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
