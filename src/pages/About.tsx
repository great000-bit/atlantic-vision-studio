import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "react-router-dom";
import { ArrowRight, Target, Eye, Heart, Users } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useSectionContent, getContentValue } from "@/hooks/useSectionContent";

const defaultTeamMembers = [
  { name: "Alex Rivera", role: "Creative Director", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { name: "Sarah Chen", role: "Lead Cinematographer", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
  { name: "Marcus Williams", role: "Post-Production Lead", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
  { name: "Emma Thompson", role: "Producer", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
];

const values = [
  { icon: Target, title: "Excellence", description: "We pursue excellence in every frame, every edit, every delivery." },
  { icon: Eye, title: "Vision", description: "We see beyond the obvious to create content that resonates." },
  { icon: Heart, title: "Passion", description: "We love what we do, and it shows in our work." },
  { icon: Users, title: "Collaboration", description: "We believe the best work comes from great partnerships." },
];

const About = () => {
  const { data: teamSection } = useSectionContent('about', 'team');
  
  const teamLabel = getContentValue(teamSection?.content, 'label', 'Our Team');
  const teamHeading = getContentValue(teamSection?.content, 'heading', 'Meet the Creators');
  const teamSubheading = getContentValue(teamSection?.content, 'subheading', 'The talented individuals who bring your vision to life.');
  const teamMembers = getContentValue(teamSection?.content, 'members', defaultTeamMembers) as { name: string; role: string; image: string }[];

  return (
    <Layout>
      <SEO 
        title="About Us"
        description="Learn about Atlantic Creators Company - a full-service media production collective uniting top-tier creators, premium studio spaces, and streamlined workflows to deliver excellence."
        url="https://www.theatlanticcreators.com/about"
        keywords="about Atlantic Creators, media production team, creative collective, production company history"
      />
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <span className="inline-block text-primary text-sm font-medium tracking-[0.2em] uppercase mb-4">
              About Us
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Where Cinematic Vision Meets{" "}
              <span className="text-gradient-gold">Professional Excellence</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Atlantic Creators Company is a full-service media production collective. 
              We unite top-tier creators, premium studio spaces, and streamlined workflows 
              to deliver excellence on every project.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-card">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Target size={24} />
                </div>
                <h2 className="font-heading text-2xl font-bold text-foreground">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Atlantic Creators Company exists to elevate media production standards — 
                delivering cinematic visuals, polished audio, and cohesive storytelling 
                for brands, businesses, and creatives. We bridge the gap between vision 
                and execution, ensuring every project we touch reflects the highest quality.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Eye size={24} />
                </div>
                <h2 className="font-heading text-2xl font-bold text-foreground">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To become the nation's go-to media collective: uniting top-tier creators, 
                premium studio spaces, and streamlined workflows — ensuring every project 
                we touch reflects excellence. We envision a future where quality media 
                production is accessible to visionaries everywhere.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <SectionHeading
            label="Our Values"
            title="What Drives Us"
            subtitle="The principles that guide every decision, every project, every collaboration."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <value.icon size={28} />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-card">
        <div className="container mx-auto px-6 lg:px-8">
          <SectionHeading
            label={teamLabel}
            title={teamHeading}
            subtitle={teamSubheading}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="text-primary text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Creators Collective Info */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <SectionHeading
              label="Our Collective"
              title="The Creators Collective"
              subtitle="A network of vetted professionals committed to excellence."
            />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card border border-border rounded-2xl p-8 lg:p-12"
            >
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our creators collective is composed of vetted photographers, videographers, 
                editors, and audio professionals. We believe in fair, timely compensation — 
                that's why we built an internal payment portal to ensure transparency and trust.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Every creator in our network has been carefully selected for their skills, 
                professionalism, and commitment to quality. When you work with Atlantic Creators, 
                you're accessing a curated team of specialists who deliver consistently excellent results.
              </p>
              <Link
                to="/creators"
                className="group btn-gold inline-flex items-center gap-2 text-sm uppercase tracking-wider"
              >
                Join Our Collective
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;