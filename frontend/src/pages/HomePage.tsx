import img  from "../assets/art2.jpg";
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
      <div className="max-h-screen animate-fadeIn">
        <div>
        <img src={img} alt="bg-image" className="w-screen h-screen z-10 absolute flex justify-center items-center"/>
          <NavBar />
          <HeroSection />
        </div>
        <Features />
        <Testimonials />
        <About />
        <Contact />
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
