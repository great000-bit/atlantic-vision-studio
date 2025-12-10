import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { WhyUsSection } from "@/components/home/WhyUsSection";
import { CTASection } from "@/components/home/CTASection";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <Layout>
      <SEO 
        title="Cinematic Media Production"
        description="Atlantic Creators Company - Full-service cinematic media production. Photography, videography, documentaries, podcast studio, and event coverage. Premium quality for brands, tourism, and events."
        url="https://www.theatlanticcreators.com/"
        keywords="media production, video production, photography, documentary, podcast studio, event coverage, film production, cinematic content, brand content, tourism media, Atlantic Creators"
      />
      <HeroSection />
      <ServicesOverview />
      <FeaturedWork />
      <WhyUsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
