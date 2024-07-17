const About = () => {
  return (
    <section id="about" className="bg-gray-50 py-16">
      <div className="max-w-screen-xl mx-auto px-4 text-center my-10">
        <h2 className="text-3xl font-bold text-gray-900">About Print_Seva</h2>
        <p className="mt-4 text-gray-600">
          Print_Seva is dedicated to providing an efficient and user-friendly
          platform for all your printing needs. Our mission is to simplify the
          printing process and offer a seamless experience to our customers.
        </p>
        <div className="mt-8 text-left space-y-6">
          <h3 className="text-2xl font-semibold text-gray-800">Our Story</h3>
          <p className="text-gray-600">
            Founded in 2024, Print_Seva started with the goal of addressing the
            common hassles associated with printing documents. We understand the
            frustration of finding a reliable print shop and the time-consuming
            process of printing. Our platform is designed to eliminate these
            challenges and provide a hassle-free printing experience.
          </p>
          <h3 className="text-2xl font-semibold text-gray-800">Our Values</h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>
              Customer Satisfaction: Our top priority is ensuring a smooth and
              satisfactory experience for our users.
            </li>
            <li>
              Reliability: We partner with the best print shops to ensure
              high-quality prints every time.
            </li>
            <li>
              Convenience: Our platform is designed to be user-friendly and
              accessible, making the printing process as simple as possible.
            </li>
          </ul>
          <h3 className="text-2xl font-semibold text-gray-800">Our Team</h3>
          <p className="text-gray-600">
            Our team consists of passionate professionals dedicated to improving
            the printing experience for our users. From software developers to
            customer support, we work tirelessly to make Print_Seva the best
            printing management system available.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
