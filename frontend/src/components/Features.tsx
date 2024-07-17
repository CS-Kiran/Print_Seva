import { useState } from 'react';

const Features = () => {
  const features = [
    {
      title: "Easy Document Upload",
      description: "Upload documents in various formats with ease.",
    },
    {
      title: "Wide Range of Print Shops",
      description: "Choose from a variety of print shops to meet your needs.",
    },
    {
      title: "Secure Payments",
      description: "Enjoy secure and reliable payment options.",
    },
    {
      title: "Real-time Order Tracking",
      description: "Track your orders in real-time for peace of mind.",
    },
    {
      title: "Quality Assurance",
      description: "Receive high-quality prints with our quality assurance checks.",
    },
    {
      title: "Affordable Pricing",
      description: "Enjoy competitive and affordable pricing for all services.",
    },
    {
      title: "Customer Support",
      description: "Get assistance whenever you need with our 24/7 customer support.",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesToShow = 3; // Number of features to show at once
  const totalSlides = Math.ceil(features.length / slidesToShow);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === totalSlides - 1 ? 0 : prevSlide + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? totalSlides - 1 : prevSlide - 1
    );
  };

  return (
    <section id="features" className="py-16">
      <div className="max-w-screen-xl mx-auto px-4 text-center my-10">
        <h2 className="text-3xl font-bold text-gray-900">Our Features</h2>
        <div className="relative mt-12 overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div key={slideIndex} className="flex min-w-full">
                {features
                  .slice(slideIndex * slidesToShow, slideIndex * slidesToShow + slidesToShow)
                  .map((feature, index) => (
                    <div
                      key={index}
                      className="w-1/3 p-6 bg-gray-200 shadow-md rounded-lg mx-2 transitions-colors duration-300 ease-in-out hover:bg-gray-300"
                    >
                      <h3 className="text-xl font-semibold text-gray-800">
                        {feature.title}
                      </h3>
                      <p className="mt-4 text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  ))}
              </div>
            ))}
          </div>
          <div className="absolute top-1/2 transform -translate-y-1/2 left-3">
            <button
              onClick={prevSlide}
              className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
            >
              <svg
                className="w-4 h-4 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>
          </div>
          <div className="absolute top-1/2 transform -translate-y-1/2 right-3">
            <button
              onClick={nextSlide}
              className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
            >
              <svg
                className="w-4 h-4 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
          <div className="mt-8 flex justify-center space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide
                    ? 'bg-violet-700'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
