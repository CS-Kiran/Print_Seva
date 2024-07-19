import { useState } from "react";
import art from "../assets/art1.jpg";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setIsForgotPassword(false);
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setIsSignUp(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      {/* Back SVG */}
      <div
        className="absolute top-5 left-5 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src="https://www.svgrepo.com/show/521963/arrow-left-circle.svg"
          alt="Back"
          className="w-10 h-10 hover:shadow-lg hover:animate-horizontalBounce transition duration-300 ease-linear rounded-full"
        />
        <p className="text-gray-600 text-sm mt-2 text-center">Back to Home</p>
      </div>
      {/* ShopkeeperLogin SVG */}
      <div
        className="absolute top-5 right-6 cursor-pointer"
        onClick={() => navigate("/get-started/shopkeeper")}
      >
        <img
          src="https://www.svgrepo.com/show/521969/arrow-right-circle.svg"
          alt="Shopkeeper Login"
          className="w-10 h-10 hover:shadow-lg hover:animate-horizontalBounce transition duration-300 ease-linear rounded-full ml-auto"
        />
        <p className="text-gray-600 text-sm mt-2 text-center">Shopkeeper Login</p>
      </div>

      <div className="relative bg-white p-3 rounded-lg shadow-2xl max-w-md w-full transform transition-transform">
        <img src={art} alt="Art" className="w-full h-[12rem] rounded-lg transition duration-500 ease-in-out shadow-lg hover:shadow-2xl hover:scale-110" />
        <h2 className="text-2xl text-center font-semibold text-gray-800 mb-5 mt-5 hover:animate-wiggle">
          {isSignUp
            ? "Sign Up"
            : isForgotPassword
            ? "Forgot Password"
            : "Sign In"}
        </h2>
        <form className="p-2">
          {isSignUp && (
            <div className="mb-5">
              <input
                type="text"
                id="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5"
                placeholder="Username"
                required
              />
            </div>
          )}
          <div className="mb-5">
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5"
              placeholder="Email"
              required
            />
          </div>
          {!isForgotPassword && (
            <div className="mb-5">
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5"
                required
              />
            </div>
          )}
          {isSignUp && (
            <div className="mb-5">
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5"
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
          >
            {isSignUp
              ? "Sign Up"
              : isForgotPassword
              ? "Reset Password"
              : "Sign In"}
          </button>
        </form>
        {!isForgotPassword && (
          <p className="mt-4 text-sm text-gray-600">
            {isSignUp ? (
              <>
                <span>Already have an account?</span>
                <b
                  onClick={toggleForm}
                  className="cursor-pointer text-violet-500 ml-1"
                >
                  Sign in here
                </b>
              </>
            ) : (
              <>
                <span>Don't have an account?</span>
                <b
                  onClick={toggleForm}
                  className="cursor-pointer text-violet-500 ml-1"
                >
                  Sign up here
                </b>
              </>
            )}
          </p>
        )}
        {!isSignUp && (
          <p className="mt-2 text-sm text-gray-600">
            <b
              onClick={toggleForgotPassword}
              className="cursor-pointer text-violet-500"
            >
              Forgot password?
            </b>
          </p>
        )}
      </div>
    </div>
  );
};

export default UserLogin;
