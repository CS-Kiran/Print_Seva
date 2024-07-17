const Contact = () => {
  return (
    <section id="contact" className="bg-white py-16">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Contact Us</h2>
        <p className="mt-4 text-gray-600">
          We'd love to hear from you! Get in touch with us for any queries or support.
        </p>
        <div className="flex justify-center mt-12 space-x-40">
          {/* Left column */}
          <div className="text-left space-y-6 max-w-md">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">Our Office</h3>
              <p className="text-gray-600">
                Print_Seva Inc.<br />
                123 Printing Lane,<br />
                India, PV 12345<br />
                Phone: (123) 456-7890<br />
                Email: contact@printseva.com
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-black hover:text-blue-500 p-1 rounded-full flex items-center">
                  <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.47.69.89-.53 1.56-1.37 1.88-2.37-.83.49-1.75.84-2.72 1.03a4.18 4.18 0 00-7.14 3.81 11.84 11.84 0 01-8.6-4.36 4.18 4.18 0 001.29 5.57 4.14 4.14 0 01-1.89-.52v.05a4.18 4.18 0 003.35 4.09 4.22 4.22 0 01-1.89.07 4.18 4.18 0 003.9 2.9A8.36 8.36 0 012 19.54a11.78 11.78 0 006.29 1.84c7.54 0 11.67-6.25 11.67-11.67 0-.18 0-.36-.01-.53A8.28 8.28 0 0024 4.56a8.34 8.34 0 01-2.39.66 4.18 4.18 0 001.83-2.3"></path>
                  </svg>
                </a>
                <a href="#" className="text-black hover:text-blue-800 flex items-center p-1 rounded-full">
                  <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.8 0-5 2.2-5 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5v-14c0-2.8-2.2-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.3c-1 0-1.8-.8-1.8-1.8 0-1 .8-1.8 1.8-1.8 1 0 1.8.8 1.8 1.8 0 1-.8 1.8-1.8 1.8zm13.5 10.3h-3v-4.9c0-1.2 0-2.7-1.6-2.7-1.6 0-1.8 1.3-1.8 2.6v5h-3v-9h2.9v1.2h.1c.4-.7 1.2-1.4 2.4-1.4 2.5 0 3 1.7 3 4.1v5.1z"></path>
                  </svg>
                </a>
                <a href="#" className="text-black hover:text-red-600 flex items-center p-1 rounded-full">
                  <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 2.1.2 2.7.4.7.2 1.3.6 1.8 1.1.5.5.9 1.1 1.1 1.8.2.6.3 1.5.4 2.7.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 2.1-.4 2.7-.2.7-.6 1.3-1.1 1.8-.5.5-1.1.9-1.8 1.1-.6.2-1.5.3-2.7.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-2.1-.2-2.7-.4-.7-.2-1.3-.6-1.8-1.1-.5-.5-.9-1.1-1.1-1.8-.2-.6-.3-1.5-.4-2.7-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-2.1.4-2.7.2-.7.6-1.3 1.1-1.8.5-.5 1.1-.9 1.8-1.1.6-.2 1.5-.3 2.7-.4 1.3-.1 1.7-.1 4.9-.1m0-2.2c-3.3 0-3.7 0-5 .1-1.3.1-2.2.2-3 .5-.9.3-1.7.7-2.4 1.4-.7.7-1.1 1.5-1.4 2.4-.3.8-.4 1.7-.5 3-.1 1.3-.1 1.7-.1 5s0 3.7.1 5c.1 1.3.2 2.2.5 3 .3.9.7 1.7 1.4 2.4.7.7 1.5 1.1 2.4 1.4.8.3 1.7.4 3 .5 1.3.1 1.7.1 5 .1s3.7 0 5-.1c1.3-.1 2.2-.2 3-.5.9-.3 1.7-.7 2.4-1.4.7-.7 1.1-1.5 1.4-2.4.3-.8.4-1.7.5-3 .1-1.3.1-1.7.1-5s0-3.7-.1-5c-.1-1.3-.2-2.2-.5-3-.3-.9-.7-1.7-1.4-2.4-.7-.7-1.5-1.1-2.4-1.4-.8-.3-1.7-.4-3-.5-1.3-.1-1.7-.1-5-.1z"></path><path d="M12 5.8a6.2 6.2 0 106.2 6.2 6.2 6.2 0 00-6.2-6.2zm0 10.2a4 4 0 114-4 4 4 0 01-4 4zm6.5-10.7a1.5 1.5 0 11-1.5-1.5 1.5 1.5 0 011.5 1.5z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          {/* Right column */}
          <div>
            <form className="mt-8 space-y-6 max-w-md mx-auto">
              <input type="text" name="name" placeholder="Your Name" className="w-full p-3 border rounded-lg" />
              <input type="email" name="email" placeholder="Your Email" className="w-full p-3 border rounded-lg" />
              <textarea name="message" placeholder="Your Message" className="w-full p-3 border rounded-lg"></textarea>
              <button type="submit" className="w-full text-white bg-violet-700 hover:bg-violet-800 focus:ring-2 focus:outline-none focus:ring-violet-300 rounded-lg text-md font-semibold px-6 py-3">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
