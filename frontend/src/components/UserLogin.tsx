import { ChangeEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";
import axios from "axios";
import art from "../assets/art1.jpg";

const UserLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setIsForgotPassword(false);
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setIsSignUp(false);
  };

  const handleBackClick = () => navigate("/");
  const handleShopkeeperLoginClick = () => navigate("/get-started/shopkeeper");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    } else {
      setProfileImage(null);
    }
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      showAlert("warning", "Email and Password are required.");
      return false;
    }
    if (isSignUp && (!formData.username || !formData.confirmPassword)) {
      showAlert("warning", "All fields are required for sign-up.");
      return false;
    }
    if (isSignUp && formData.password !== formData.confirmPassword) {
      showAlert("warning", "Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      if (isSignUp) {
        const userFormData = new FormData();
        userFormData.append("name", formData.username);
        userFormData.append("email", formData.email);
        userFormData.append("password", formData.password);
        userFormData.append("confirm_password", formData.confirmPassword);
        if (profileImage) {
          userFormData.append("profile_image", profileImage);
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response = await axios.post("http://localhost:5000/register/user", userFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        showAlert("success", "Registration successful");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setProfileImage(null);
        navigate('/get-started/user');
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response = await axios.post("http://localhost:5000/login/user", {
          email: formData.email,
          password: formData.password,
        });
        showAlert("success", "Login successful");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate('/')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An error occurred";
      setError(errorMessage);
      showAlert("error", errorMessage);
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setProfileImage(null);
    }
  };

  const renderInputField = (type: string | undefined, id: string | undefined, placeholder: string | undefined, required = true) => (
    <div className="mb-5">
      <input
        type={type}
        id={id}
        value={formData[id]}
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );

  const renderFileInputField = (id: string | undefined, accept: string | undefined, onChange: ChangeEventHandler<HTMLInputElement> | undefined, required = true) => (
    <div className="mb-5">
      <input
        type="file"
        id={id}
        accept={accept}
        onChange={onChange}
        className="border-2 file-input w-full max-w-full file-input-ghost file-input-bordered"
        required={required}
      />
      {profileImage && profileImage instanceof File && (
        <div className="mt-5">
          <img
            src={URL.createObjectURL(profileImage)}
            alt="Profile"
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );

  const renderHeader = () => (
    <h2 className="text-2xl text-center font-semibold text-gray-800 mb-5 mt-5 hover:animate-wiggle">
      {isSignUp ? "Sign Up" : isForgotPassword ? "Forgot Password" : "Sign In"}
    </h2>
  );

  const renderForm = () => (
    <form className="p-2" onSubmit={handleSubmit}>
      {isSignUp && renderInputField("text", "username", "Username")}
      {renderInputField("email", "email", "Email")}
      {!isForgotPassword &&
        renderInputField("password", "password", "Password")}
      {isSignUp &&
        renderInputField("password", "confirmPassword", "Confirm Password")}
      {isSignUp &&
        renderFileInputField(
          "profileImage",
          "image/*",
          handleProfileImageChange
        )}
      <button
        type="submit"
        className="text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
      >
        {isSignUp ? "Sign Up" : isForgotPassword ? "Reset Password" : "Sign In"}
      </button>
    </form>
  );

  const renderFooter = () => (
    <>
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
    </>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative animate-fadeIn">
      <div
        className="absolute top-5 left-5 cursor-pointer"
        onClick={handleBackClick}
      >
        <img
          src="https://www.svgrepo.com/show/521963/arrow-left-circle.svg"
          alt="Back"
          className="w-10 h-10 hover:shadow-lg hover:animate-horizontalBounce transition duration-300 ease-linear rounded-full"
        />
        <p className="text-gray-600 text-sm mt-2 text-center">Back to Home</p>
      </div>
      <div
        className="absolute top-5 right-6 cursor-pointer"
        onClick={handleShopkeeperLoginClick}
      >
        <img
          src="https://www.svgrepo.com/show/521969/arrow-right-circle.svg"
          alt="Shopkeeper Login"
          className="animate-horizontalBounce w-10 h-10 hover:shadow-lg hover:animate-horizontalBounce transition duration-300 ease-linear rounded-full ml-auto"
        />
        <p className="text-gray-600 text-sm mt-2 text-center">
          Shopkeeper Login
        </p>
      </div>
      <div className="relative bg-white p-3 rounded-lg shadow-2xl max-w-md w-full transform transition-transform">
        <img
          src={art}
          alt="Art"
          className="w-full h-[15rem] rounded-lg transition duration-500 ease-in-out shadow-lg hover:shadow-2xl hover:scale-110"
        />
        {renderHeader()}
        {renderForm()}
        {renderFooter()}
      </div>
    </div>
  );
};

export default UserLogin;
