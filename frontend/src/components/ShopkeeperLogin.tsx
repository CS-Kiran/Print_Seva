import { useState } from 'react';
import art from '../assets/art2.jpg';
import { useNavigate } from 'react-router-dom';

const ShopkeeperLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [shopImage, setShopImage] = useState<string | ArrayBuffer | null>(null);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setIsForgotPassword(false);
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setIsSignUp(false);
  };

  const handleShopImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setShopImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setShopImage(null);
    }
  };

  const renderInputField = (id, type, placeholder, required = true) => (
    <div className="mb-5">
      <input
        type={type}
        id={id}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );

  const renderFileInputField = (id, accept, onChange, required = true) => (
    <div className="mb-5">
      <input
        type="file"
        id={id}
        accept={accept}
        onChange={onChange}
        className="border-2 file-input w-full max-w-full file-input-ghost file-input-bordered"
        required={required}
      />
      {shopImage && typeof shopImage === 'string' && (
        <div className="mt-5">
          <img
            src={shopImage}
            alt="Shop"
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );

  const renderForm = () => (
    <form className="p-2">
      {isSignUp && (
        <>
          {renderInputField('name', 'text', 'Name')}
          {renderInputField('email', 'email', 'Email')}
          {renderInputField('password', 'password', 'Password')}
          {renderInputField('shopName', 'text', 'Shop Name')}
          {renderInputField('shopAddress', 'text', 'Shop Address')}
          {renderFileInputField('shopImage', 'image/*', handleShopImageChange)}
          {renderInputField('costSingleSide', 'number', 'Cost Single Side')}
          {renderInputField('costBothSide', 'number', 'Cost Both Side')}
        </>
      )}
      {!isForgotPassword && !isSignUp && renderInputField('email', 'email', 'Email')}
      {!isForgotPassword && renderInputField('password', 'password', 'Password')}
      {isForgotPassword && renderInputField('email', 'email', 'Email')}
      <button
        type="submit"
        className="text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
      >
        {isSignUp ? 'Sign Up' : isForgotPassword ? 'Reset Password' : 'Sign In'}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <div className="absolute top-5 left-5 cursor-pointer" onClick={() => navigate("/")}>
        <img
          src="https://www.svgrepo.com/show/521963/arrow-left-circle.svg"
          alt="Back"
          className="w-10 h-10 hover:shadow-lg hover:animate-horizontalBounce transition duration-300 ease-linear rounded-full"
        />
        <p className="text-gray-600 text-sm mt-2 text-center">Back to Home</p>
      </div>
      <div className="absolute top-5 right-6 cursor-pointer" onClick={() => navigate("/get-started/user")}>
        <img
          src="https://www.svgrepo.com/show/521969/arrow-right-circle.svg"
          alt="User Login"
          className="w-10 h-10 hover:shadow-lg hover:animate-horizontalBounce transition duration-300 ease-linear rounded-full ml-auto"
        />
        <p className="text-gray-600 text-sm mt-2 text-center">User Login</p>
      </div>

      <div className="relative bg-white p-3 my-4 rounded-lg shadow-2xl max-w-md w-full transform transition-transform">
        <img src={art} alt="Art" className="w-full h-[12rem] rounded-lg transition duration-500 ease-in-out shadow-lg hover:shadow-2xl hover:scale-110" />
        <h2 className="text-2xl text-center font-semibold text-gray-800 mb-5 mt-5 hover:animate-wiggle">
          {isSignUp ? 'Shopkeeper Sign Up' : isForgotPassword ? 'Forgot Password' : 'Shopkeeper Sign In'}
        </h2>
        {renderForm()}
        {!isForgotPassword && (
          <p className="mt-4 text-sm text-gray-600">
            {isSignUp ? (
              <>
                <span>Already have an account?</span>
                <b onClick={toggleForm} className="cursor-pointer text-violet-500 ml-1">Sign in here</b>
              </>
            ) : (
              <>
                <span>Don't have an account?</span>
                <b onClick={toggleForm} className="cursor-pointer text-violet-500 ml-1">Sign up here</b>
              </>
            )}
          </p>
        )}
        {!isSignUp && (
          <p className="mt-2 text-sm text-gray-600">
            <b onClick={toggleForgotPassword} className="cursor-pointer text-violet-500">Forgot password?</b>
          </p>
        )}
      </div>
    </div>
  );
};

export default ShopkeeperLogin;
