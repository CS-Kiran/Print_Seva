import { useNavigate } from "react-router-dom";

const HeroSection = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/get-started/user");
  };

  return (
    <section className="relative bg-white py-16 h-screen flex items-center overflow-hidden ">
      <div className="absolute inset-0 flex justify-center items-center z-10">
        <div className="shadow-2xl relative w-[48rem] h-[32rem] bg-[#ffffff1a] border-[1px] border-[#ffffff20] backdrop-blur-[16px] backdrop-saturate-[120%] rounded-lg"></div>
      </div>

      <div className="max-w-screen-xl w-[50rem] mx-auto px-4 text-center relative z-10">
        <h1 className="text-6xl font-extrabold text-gray-900">
          Simplify Your Printing Needs with Print_Seva
        </h1>
        <p className="mt-4 text-gray-950 text-lg">
          Upload your documents, choose a print shop, and enjoy hassle-free printing. Fast, convenient, and reliable.
        </p>
        <button
          className="animate-bounce mt-8 text-white bg-violet-700 hover:bg-violet-800 hover:shadow-lg focus:ring-2 focus:outline-none focus:ring-violet-300 rounded-lg text-md font-semibold px-6 py-3" onClick={handleClick}
        >
          Get Started
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
