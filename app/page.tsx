import { Navigation } from '@/components/navigation';

import { AboutSection } from '@/components/sections/about';


import { ContactSection } from '@/components/sections/contact';
import { Footer } from '@/components/sections/footer';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectSection';
import HeroSection from '@/components/sections/hero';
import ResumeSection from '@/components/sections/ResumeSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ResumeSection />
      <AboutSection />
      <SkillsSection />
  
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
