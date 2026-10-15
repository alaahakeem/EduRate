import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import TopTeachers from '../components/TopTeachers';
import PopularCenters from '../components/PopularCenters';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function LandingPage() {
  const { dir } = useLanguage();

  return (
    <div dir={dir} className="min-h-screen font-sans bg-gray-50 overflow-x-hidden transition-all">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <TopTeachers />
      <PopularCenters />
      <Footer />
    </div>
  );
}
