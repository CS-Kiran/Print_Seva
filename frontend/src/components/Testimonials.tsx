import { useState, useEffect } from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      text: "Print_Seva made printing so easy and convenient. I love it!",
      author: "John Doe",
    },
    {
      text: "Great service with fast and reliable delivery. Highly recommend!",
      author: "Jane Smith",
    },
    {
      text: "Exceptional quality and fantastic customer service.",
      author: "Alex Johnson",
    },
    {
      text: "Affordable prices and top-notch prints. Couldn't ask for more!",
      author: "Emily Davis",
    },
    {
      text: "Print_Seva is a lifesaver for all my urgent printing needs.",
      author: "Michael Brown",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const slidesToShow = 2;
  const totalSlides = Math.ceil(testimonials.length / slidesToShow);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === totalSlides - 1 ? 0 : prevSlide + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  return (
    <section id="testimonials" className="bg-white py-16">
      <div className="max-w-screen-xl mx-auto px-4 text-center my-10">
        <h2 className="text-3xl font-bold text-gray-900">
          What Our Customers Say
        </h2>
        <div className="relative mt-12">
          <div className="overflow-hidden h-40">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="flex min-w-full"
                >
                  {testimonials
                    .slice(slideIndex * slidesToShow, slideIndex * slidesToShow + slidesToShow)
                    .map((testimonial, index) => (
                      <div
                        key={index}
                        className="w-1/2 p-6 bg-violet-200 shadow-md rounded-lg mx-2"
                      >
                        <p className="text-gray-600">{testimonial.text}</p>
                        <span className="block mt-4 text-gray-800 font-semibold">
                          - {testimonial.author}
                        </span>
                      </div>
                    ))}
                </div>
              ))}
            </div>
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

export default Testimonials;
