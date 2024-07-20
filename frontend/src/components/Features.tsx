import upload from "../icons/upload.png";
import store from "../icons/store.png";
import payment from "../icons/payment.png";
import tracking from "../icons/tracking.png";
import quality from "../icons/quality.png";
import cost from "../icons/cost.png";
import support from "../icons/support.png";

const features = [
  {
    title: "Easy Document Upload",
    description: "Upload documents in various formats with ease.",
    icon: upload,
  },
  {
    title: "Wide Range of Print Shops",
    description: "Choose from a variety of print shops to meet your needs.",
    icon: store,
  },
  {
    title: "Secure Payments",
    description: "Enjoy secure and reliable payment options.",
    icon: payment,
  },
  {
    title: "Real-time Order Tracking",
    description: "Track your orders in real-time for peace of mind.",
    icon: tracking,
  },
  {
    title: "Quality Assurance",
    description:
      "Receive high-quality prints with our quality assurance checks.",
    icon: quality,
  },
  {
    title: "Affordable Pricing",
    description: "Enjoy competitive and affordable pricing for all services.",
    icon: cost,
  },
  {
    title: "Customer Support",
    description:
      "Get assistance whenever you need with our 24/7 customer support.",
    icon: support,
  },
];

const Features = () => {
  return (
    <section className="text-gray-600 body-font" id="features">
      <div className="mt-10">
        <h1 className="text-5xl mt-32 font-bold title-font text-gray-900 mb-0 text-center">
          Our Services
        </h1>
        <div className="container px-5 py-16 mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-gray-200 sm:flex-row flex-col ${
                index % 2 !== 0 ? "sm:flex-row-reverse" : ""
              }`}
            >
              <div className="sm:w-32 sm:h-32 h-20 w-20 sm:mr-10 sm:ml-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 flex-shrink-0">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="sm:w-16 sm:h-16 w-10 h-10"
                />
              </div>
              <div className="flex-grow sm:text-left text-center mt-6 sm:mt-0">
                <h2 className="text-gray-900 text-lg title-font font-medium mb-2">
                  {feature.title}
                </h2>
                <p className="leading-relaxed text-base">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
