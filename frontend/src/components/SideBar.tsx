// src/components/Sidebar.js

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useShopkeeper } from '../context/ShopkeeperContext';
import backgroundImage from "../assets/art1.jpg"; // Your background image path
import shopIcon from "../icons/svg/available_shop.svg";
import sendRequestIcon from "../icons/svg/send_request.svg";
import notificationsIcon from "../icons/svg/notification.svg";
import profileIcon from "../icons/svg/profile.svg";
import pendingRequestIcon from "../icons/svg/pending_request.svg";
import acceptedRequestIcon from "../icons/svg/track_request.svg";
import logoutIcon from "../icons/svg/logout.svg";

const Sidebar = ({ role }) => {
  const [activeTab, setActiveTab] = useState();
  const navigate = useNavigate();
  const { user, logout: userLogout } = useUser() || {}; // Use default empty object
  const { shopkeeper, logout: shopkeeperLogout } = useShopkeeper() || {}; // Use default empty object
  
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleLogout = () => {
    if (role === 'user') {
      userLogout();
    } else if (role === 'shopkeeper') {
      shopkeeperLogout();
    }
    navigate('/');
  };

  useEffect(() => {
    if (role === 'user' && !user) {
      navigate('/user-dashboard');
    } else if (role === 'shopkeeper' && !shopkeeper) {
      navigate('/shopkeeper-dashboard');
    }
  }, [role, user, shopkeeper, navigate]);

  const renderProfile = () => {
    const profile = role === 'user' ? user : shopkeeper;
    if (!profile) return null;

    // Use default values or handle missing data gracefully
    const profileImage = profile.shop_image || profile.profile_image || 'path/to/default/image.png'; // Add a default image path
    return (
      <>
        <img
          className="border-none shadow-lg object-cover w-24 h-24 mx-2 rounded-full transition duration-300 ease-in-out hover:scale-105"
          src={profileImage}
          alt="avatar"
        />
        <h4 className="mx-2 mt-2 font-semibold text-gray-950 text-2xl">{profile.name || 'User Name'}</h4>
        <p className="mx-2 mt-1 text-md font-medium text-gray-800">
          {profile.email || 'user@example.com'}
        </p>
      </>
    );
  };

  return (
    <aside className="relative flex flex-col min-w-[18rem] h-screen px-2 py-8 overflow-y-auto border-r bg-cover" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="relative z-10 flex flex-col h-full">
        <h1 className="mx-auto text-shadow font-bold text-white animate-scaleUp text-4xl transition duration-500 ease-in-out hover:scale-105">Print_Seva</h1>
        <div className="flex-grow mt-10">
          <div className="bg-[#ffffff1a] shadow-2xl border-[1px] border-[#ffffff20] backdrop-blur-[16px] backdrop-saturate-[200%] rounded-md p-3">
            <div className="flex flex-col items-center mt-6 -mx-2">
              {renderProfile()}
            </div>

            <div className="flex flex-col justify-between flex-1 mt-6">
              <nav>
                {role === "user" && (
                  <>
                    <Link
                      to="/user-dashboard/available-shops"
                      className={`flex items-center px-4 py-2 mt-5 text-gray-900 transition-colors duration-300 transform rounded-lg hover:bg-white/70 hover:text-gray-900 ${activeTab === 'Available Shops' ? 'bg-white text-gray-900' : 'bg-transparent'}`}
                      onClick={() => handleTabClick('Available Shops')}
                    >
                      <img src={shopIcon} alt="Available Shops" className="w-7 h-7 group-hover:filter group-hover:invert" />
                      <span className="mx-4 font-medium">Available Shops</span>
                    </Link>
                    <a
                      className={`flex items-center px-4 py-2 mt-5 text-gray-900 transition-colors duration-300 transform rounded-lg hover:bg-white/70 hover:text-gray-900 ${activeTab === 'Send Request' ? 'bg-white text-gray-900' : 'bg-transparent'}`}
                      href="#"
                      onClick={() => handleTabClick('Send Request')}
                    >
                      <img src={sendRequestIcon} alt="Send Request" className="w-7 h-7 group-hover:filter group-hover:invert" />
                      <span className="mx-4 font-medium">Send Request</span>
                    </a>
                    <a
                      className={`flex items-center px-4 py-2 mt-5 text-gray-900 transition-colors duration-300 transform rounded-lg hover:bg-white/70 hover:text-gray-900 ${activeTab === 'Notifications' ? 'bg-white text-gray-900' : 'bg-transparent'}`}
                      href="#"
                      onClick={() => handleTabClick('Notifications')}
                    >
                      <img src={notificationsIcon} alt="Notifications" className="w-6 h-6 group-hover:filter group-hover:invert" />
                      <span className="mx-4 font-medium">Notifications</span>
                    </a>
                    <a
                      className={`flex items-center px-4 py-2 mt-5 text-gray-900 transition-colors duration-300 transform rounded-lg hover:bg-white/70 hover:text-gray-900 ${activeTab === 'Profile' ? 'bg-white text-gray-900' : 'bg-transparent'}`}
                      href="#"
                      onClick={() => handleTabClick('Profile')}
                    >
                      <img src={profileIcon} alt="Profile" className="w-5 h-5 group-hover:filter group-hover:invert" />
                      <span className="mx-4 font-medium">Profile</span>
                    </a>
                  </>
                )}
                {role === "shopkeeper" && (
                  <>
                    <a
                      className={`flex items-center px-4 py-2 mt-5 text-gray-900 transition-colors duration-300 transform rounded-lg hover:bg-white/70 hover:text-gray-900 ${activeTab === 'Profile' ? 'bg-white text-gray-900' : 'bg-transparent'}`}
                      href="#"
                      onClick={() => handleTabClick('Profile')}
                    >
                      <img src={profileIcon} alt="Profile" className="w-6 h-6 group-hover:filter group-hover:invert" />
                      <span className="mx-4 font-medium">Profile</span>
                    </a>
                    <a
                      className={`flex items-center px-4 py-2 mt-5 text-gray-900 transition-colors duration-300 transform rounded-lg hover:bg-white/70 hover:text-gray-900 ${activeTab === 'Pending Request' ? 'bg-white text-gray-900' : 'bg-transparent'}`}
                      href="#"
                      onClick={() => handleTabClick('Pending Request')}
                    >
                      <img src={pendingRequestIcon} alt="Pending Request" className="w-7 h-7 group-hover:filter group-hover:invert" />
                      <span className="mx-4 font-medium">Pending Request</span>
                    </a>
                    <a
                      className={`flex items-center px-4 py-2 mt-5 text-gray-900 transition-colors duration-300 transform rounded-lg hover:bg-white/70 hover:text-gray-900 ${activeTab === 'Track Request' ? 'bg-white text-gray-900' : 'bg-transparent'}`}
                      href="#"
                      onClick={() => handleTabClick('Track Request')}
                    >
                      <img src={acceptedRequestIcon} alt="Track Request" className="w-7 h-7 group-hover:filter group-hover:invert" />
                      <span className="mx-4 font-medium">Track Request</span>
                    </a>
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
        <div className="flex cursor-pointer items-center px-4 py-2 mt-5 text-gray-950 transition-colors duration-300 transform rounded-lg hover:bg-red-600 hover:text-white bg-[#ffffff1a] border-[1px] border-[#ffffff20] backdrop-blur-[16px] backdrop-saturate-[200%] p-3 shadow-xl group" onClick={handleLogout}>
          <img src={logoutIcon} alt="Logout" className="w-7 h-7 group-hover:filter group-hover:invert" />
          <span className="mx-4 font-medium">Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
