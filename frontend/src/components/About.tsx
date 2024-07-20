const About = () => {
  return (
    <section id="about" className="py-16">
      <div className="max-w-screen-xl mx-auto px-4 text-center my-10">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
          About Print_Seva
        </h2>
        <p className="mt-4 mb-4 text-lg text-gray-700">
          Print_Seva is dedicated to providing an efficient and user-friendly
          platform for all your printing needs. Our mission is to simplify the
          printing process and offer a seamless experience to our customers.
        </p>
        <div className="mt-12 space-y-12">
          <div className="transition transform hover:-translate-y-1 hover:shadow-lg p-6 rounded-lg bg-white text-left">
            <h3 className="text-3xl font-semibold text-gray-800">Our Story</h3>
            <p className="mt-4 text-gray-600">
              Founded in 2024, Print_Seva started with the goal of addressing the
              common hassles associated with printing documents. We understand the
              frustration of finding a reliable print shop and the time-consuming
              process of printing. Our platform is designed to eliminate these
              challenges and provide a hassle-free printing experience.
            </p>
          </div>
          <div className="transition transform hover:-translate-y-1 hover:shadow-lg p-6 rounded-lg bg-white text-left">
            <h3 className="text-3xl font-semibold text-gray-800">Our Values</h3>
            <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
              <li>
                <span className="font-semibold text-gray-800">Customer Satisfaction:</span> Our top priority is ensuring a smooth and
                satisfactory experience for our users.
              </li>
              <li>
                <span className="font-semibold text-gray-800">Reliability:</span> We partner with the best print shops to ensure
                high-quality prints every time.
              </li>
              <li>
                <span className="font-semibold text-gray-800">Convenience:</span> Our platform is designed to be user-friendly and
                accessible, making the printing process as simple as possible.
              </li>
            </ul>
          </div>
          <div className="transition transform hover:-translate-y-1 hover:shadow-lg p-6 rounded-lg bg-white text-left">
            <h3 className="text-3xl font-semibold text-gray-800">Our Team</h3>
            <p className="mt-4 text-gray-600">
              Our team consists of passionate professionals dedicated to improving
              the printing experience for our users. From software developers to
              customer support, we work tirelessly to make Print_Seva the best
              printing management system available.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
