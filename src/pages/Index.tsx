import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TemplateShowcase from "@/components/landing/TemplateShowcase";
import FreelancerSection from "@/components/landing/FreelancerSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TemplateShowcase />
      <FreelancerSection />
      <Footer />
    </div>
  );
};

export default Index;
