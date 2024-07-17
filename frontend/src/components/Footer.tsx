const Footer = () => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  
    return (
      <footer className="bg-gray-100 py-6 mt-12 relative">
        <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/print_seva.png" className="h-10 mr-3" alt="Print_Seva Logo" />
            <span className="text-gray-600">© 2024 Print_Seva. All rights reserved.</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-violet-700">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-violet-700">Terms of Service</a>
          </div>
        </div>
        <button
          onClick={scrollToTop}
          className="absolute animate-bounce bottom-4 right-6 bg-violet-700 text-white p-2 rounded-full shadow-lg hover:bg-violet-800 focus:ring-2 focus:outline-none focus:ring-violet-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </footer>
    );
  };
  
  export default Footer;
  