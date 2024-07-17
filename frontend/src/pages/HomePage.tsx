import About from "../components/About";
import Contact from "../components/Contact";
import Features from "../components/Features";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import NavBar from "../components/NavBar";
import Testimonials from "../components/Testimonials";

const HomePage = () => {
  return (
    <>
      <div className="max-h-screen">
        <NavBar />
        <HeroSection />
        <Features/>
        <Testimonials/>
        <About/>
        <Contact/>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
