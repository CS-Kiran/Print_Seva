import { useState, useEffect } from "react";
import img from "../assets/art1.jpg"; // Ensure this path is correct

const Intro = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 1800); // Start fade-out after 3 seconds

    const completeTimer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 2100); // Complete the transition after 0.5 additional second

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-cover bg-center transition-opacity duration-1000`}
      style={{ backgroundImage: `url(${img})` }}
    >
      <h1
        className={`text-4xl font-bold text-white animate-fadeIn animate-scaleUp bg-[#ffffff1a] border-[1px] border-[#ffffff20] backdrop-blur-[16px] backdrop-saturate-[120%] rounded-lg p-10 ${
          fadeOut ? "animate-fadeOut" : ""
        }`}
      >
        <span className="animate-rotate">
          Welcome to Print_Seva
        </span>
      </h1>
    </div>
  );
};

export default Intro;
