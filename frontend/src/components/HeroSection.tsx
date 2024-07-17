const HeroSection = () => {
  return (
    <section className="relative bg-white py-16 h-screen flex items-center overflow-hidden">

      <div className="absolute inset-0 flex justify-center items-center">
        <div className="shadow-2xl relative w-[32rem] h-[32rem] bg-gradient-to-r from-slate-300 to-transparent via-slate-200 rounded-full animate-movePendulum ring-4 ring-slate-100 ring-opacity-100"></div>
      </div>

      <div className="max-w-screen-xl w-[50rem] mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Simplify Your Printing Needs with Print_Seva
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Upload your documents, choose a print shop, and enjoy hassle-free printing. Fast, convenient, and reliable.
        </p>
        <button
          className="animate-bounce mt-8 text-white bg-violet-700 hover:bg-violet-800 hover:shadow-lg focus:ring-2 focus:outline-none focus:ring-violet-300 rounded-lg text-md font-semibold px-6 py-3"
        >
          Get Started
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
