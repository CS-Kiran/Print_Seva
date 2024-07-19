const smoothScrollTo = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

const NavBar = () => {
  const handleClick = (id) => (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    smoothScrollTo(id);
  };

  return (
    <div className="w-full bg-white flex justify-center items-center" id="home">
      <nav className="fixed top-1 w-[55rem] rounded-md mt-2 z-20 bg-gray-50 shadow-lg border-2 ">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex items-center space-x-2">
            <img src="/print_seva.png" className="h-12 mr-4" alt="Print_Seva Logo" />
            <span className="text-4xl font-semibold text-gray-800 transition duration-500 ease-in-out hover:scale-110 cursor-pointer" onClick={handleClick('home')}>
              Print_Seva
            </span>
          </div>
          <div className="flex space-x-8">
            <a
              href="#features"
              className="text-gray-700 hover:text-violet-700 hover:underline"
              onClick={handleClick('features')}
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-violet-700 hover:underline"
              onClick={handleClick('testimonials')}
            >
              Testimonials
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-violet-700 hover:underline"
              onClick={handleClick('about')}
            >
              About
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-violet-700 hover:underline"
              onClick={handleClick('contact')}
            >
              Contact
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
