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
        url="https://atlanticcreators.com/"
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
