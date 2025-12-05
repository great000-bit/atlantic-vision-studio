import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User, Search, Clock, Loader2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "All",
  "Media Tips",
  "Behind the Scenes",
  "Company News",
  "Projects",
  "Creator Interviews",
];

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  tags: string[];
  published_at: string | null;
  is_published: boolean;
  created_at: string;
}

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch blog posts from Supabase
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .eq('is_deleted', false)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load blog posts.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calculate read time based on content length
  const calculateReadTime = (content: string | null) => {
    if (!content) return '5 min read';
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || 
      post.tags?.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Separate featured posts (latest 2 published posts)
  const featuredPosts = filteredPosts.slice(0, 2);
  const regularPosts = filteredPosts.slice(2);

  return (
    <Layout>
      <SEO 
        title="Blog & Insights"
        description="Explore stories, tips, and updates from Atlantic Creators. Learn media production techniques, get behind-the-scenes access, and stay updated on industry trends."
        url="https://atlanticcreators.com/blog"
        keywords="media production blog, videography tips, photography insights, behind the scenes, creator interviews, production techniques"
      />
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-background relative overflow-hidden" aria-labelledby="blog-heading">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-transparent pointer-events-none" aria-hidden="true" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />
        
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
            <h1 id="blog-heading" className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
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
      <section className="py-8 bg-card border-y border-border" aria-label="Search and filter articles">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <label htmlFor="blog-search" className="sr-only">Search articles</label>
              <input
                type="search"
                id="blog-search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-11 bg-background border border-border rounded-lg input-cinematic"
                aria-describedby="search-results-count"
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            </div>

            {/* Category Filter */}
            <nav className="flex flex-wrap gap-2 justify-center" aria-label="Filter by category">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                  aria-pressed={selectedCategory === category}
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>
          <p id="search-results-count" className="sr-only" aria-live="polite">
            {filteredPosts.length} articles found
          </p>
        </div>
      </section>

      {/* Loading State */}
      {isLoading ? (
        <section className="section-padding bg-background">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="section-padding bg-background" aria-labelledby="featured-heading">
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
                      <Link to={`/blog/${post.slug}`} className="block">
                        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6">
                          {post.cover_image ? (
                            <img
                              src={post.cover_image}
                              alt=""
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              loading="eager"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <span className="text-muted-foreground">No image</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" aria-hidden="true" />
                          {post.tags && post.tags.length > 0 && (
                            <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                              {post.tags[0]}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground text-sm mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} aria-hidden="true" />
                            <time dateTime={post.published_at || post.created_at}>
                              <span className="sr-only">Published:</span>
                              {formatDate(post.published_at || post.created_at)}
                            </time>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} aria-hidden="true" />
                            {calculateReadTime(post.content)}
                          </span>
                        </div>
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {post.excerpt || 'No excerpt available'}
                        </p>
                        <span className="text-primary font-medium text-sm inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                          Read More
                          <ArrowRight size={14} aria-hidden="true" />
                        </span>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* All Posts Grid */}
          <section className="section-padding bg-card" aria-labelledby="all-articles-heading">
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
                      <Link to={`/blog/${post.slug}`} className="block">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          {post.cover_image ? (
                            <img
                              src={post.cover_image}
                              alt=""
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <span className="text-muted-foreground text-sm">No image</span>
                            </div>
                          )}
                          {post.tags && post.tags.length > 0 && (
                            <span className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-foreground text-xs px-3 py-1 rounded-full">
                              {post.tags[0]}
                            </span>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-3 text-muted-foreground text-xs mb-3">
                            <time dateTime={post.published_at || post.created_at}>
                              {formatDate(post.published_at || post.created_at)}
                            </time>
                            <span aria-hidden="true">·</span>
                            <span>{calculateReadTime(post.content)}</span>
                          </div>
                          <h3 className="font-heading text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
                            {post.excerpt || 'No excerpt available'}
                          </p>
                          <span className="text-primary font-medium text-sm inline-flex items-center gap-2">
                            Read Article
                            <ArrowRight size={14} aria-hidden="true" />
                          </span>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-16" role="status">
                  <p className="text-muted-foreground text-lg">
                    {blogPosts.length === 0 
                      ? 'No blog posts yet. Check back soon!' 
                      : 'No articles found matching your criteria.'}
                  </p>
                  {blogPosts.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedCategory("All");
                        setSearchQuery("");
                      }}
                      className="mt-4 text-primary hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          </section>
        </>
      )}

      {/* Newsletter CTA */}
      <section className="section-padding bg-background" aria-labelledby="newsletter-heading">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center bg-card border border-border rounded-2xl p-10"
          >
            <h2 id="newsletter-heading" className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
              Stay Updated
            </h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter for the latest insights, tips, and behind-the-scenes content.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" aria-label="Newsletter subscription">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                type="email"
                id="newsletter-email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                required
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