import { useState, useEffect } from 'react';

const testimonials = [
  {
    text: "Print_Seva made printing so easy and convenient. I love it! The process is straightforward and the results are always perfect. Highly recommend Print_Seva for all your printing needs.",
    author: "John Doe",
  },
  {
    text: "Great service with fast and reliable delivery. Highly recommend! The quality of the prints is exceptional and the prices are very reasonable. Will definitely use again.",
    author: "Jane Smith",
  },
  {
    text: "Exceptional quality and fantastic customer service. The team is very responsive and helpful. My prints always turn out great. Thank you, Print_Seva!",
    author: "Alex Johnson",
  },
  {
    text: "Affordable prices and top-notch prints. Couldn't ask for more! The convenience of being able to upload documents from home and pick them up is unbeatable.",
    author: "Emily Davis",
  },
  {
    text: "Print_Seva is a lifesaver for all my urgent printing needs. I can always count on them for quick and high-quality prints. Their service is a game-changer.",
    author: "Michael Brown",
  },
];

const Testimonials = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="text-gray-600 body-font" id='testimonials'>
      <div className="container px-5 py-24 mx-auto">
        <h1 className="text-5xl font-bold title-font text-gray-900 mt-4 mb-12 text-center">What Our User's Say About Us</h1>
        <div className="overflow-hidden">
          <div className="flex w-1/2 h-[20rem] text-center text-lg transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${index * 100}%)` }}>
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="p-4 md:w-1/2 w-full flex-shrink-0" style={{ minWidth: '100%' }}>
                <div className="h-full bg-gray-100 p-8 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="block w-5 h-5 text-gray-400 mb-4" viewBox="0 0 975.036 975.036">
                    <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                  </svg>
                  <p className="leading-relaxed mb-6">{testimonial.text}</p>
                  <a className="inline-flex items-center">
                    <span className="flex-grow flex flex-col pl-4">
                      <span className="title-font font-medium text-gray-900">{testimonial.author}</span>
                    </span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
