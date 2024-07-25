import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import slide_video from "../assets/slidebar.mp4";
import shopIcon from "../icons/svg/available_shop.svg";
import sendRequestIcon from "../icons/svg/send_request.svg";
import notificationsIcon from "../icons/svg/notification.svg";
import profileIcon from "../icons/svg/profile.svg";
import pendingRequestIcon from "../icons/svg/pending_request.svg";
import acceptedRequestIcon from "../icons/svg/track_request.svg";
import logoutIcon from "../icons/svg/logout.svg";

const Sidebar = ({ role }: { role: string }) => {
  const [activeTab, setActiveTab] = useState(role === "user" ? "Available Shops" : "Profile");
  const navigate = useNavigate();

  const handleTabClick = (tabName: string): void => {
    setActiveTab(tabName);
  };

  return (
    <aside className="relative flex flex-col w-[18rem] h-screen px-2 py-8 overflow-y-auto border-r">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={slide_video}
        autoPlay
        loop
        muted
      />
      <div className="relative z-10 flex flex-col h-full">
        <h1 className="mx-auto font-bold text-gray-900 text-4xl transition duration-500 ease-in-out hover:scale-105">Print_Seva</h1>
        <div className="flex-grow mt-10">
          <div className="bg-[#ffffff1a] shadow-2xl border-[1px] border-[#ffffff20] backdrop-blur-[16px] backdrop-saturate-[200%] rounded-md p-3">
            <div className="flex flex-col items-center mt-6 -mx-2">
              <img
                className="border-2 border-gray-400 object-cover w-24 h-24 mx-2 rounded-full transition duration-300 ease-in-out hover:scale-105"
                src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                alt="avatar"
              />
              <h4 className="mx-2 mt-2 font-medium text-gray-800">John Doe</h4>
              <p className="mx-2 mt-1 text-sm font-medium text-gray-600">
                john@example.com
              </p>
            </div>

            <div className="flex flex-col justify-between flex-1 mt-6">
              <nav>
                {role === "user" && (
                  <>
                    <a
                      className={`flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-400 hover:text-gray-900 ${activeTab === 'Available Shops' ? 'bg-gray-400 text-gray-900' : 'bg-transparent'}`}
                      href="#"
                      onClick={() => handleTabClick('Available Shops')}
                    >
                      <img src={shopIcon} alt="Available Shops" className="w-7 h-7" />
                      <span className="mx-4 font-medium">Available Shops</span>
                    </a>
                    <a
                      className={`flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-400 hover:text-gray-900 ${activeTab === 'Send Request' ? 'bg-gray-400 text-gray-900' : 'bg-transparent'}`}
                      href="#"
                      onClick={() => handleTabClick('Send Request')}
                    >
                      <img src={sendRequestIcon} alt="Send Request" className="w-7 h-7" />
                      <span className="mx-4 font-medium">Send Request</span>
                    </a>
                    <a
                      className={`flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-400 hover:text-gray-900 ${activeTab === 'Notifications' ? 'bg-gray-400 text-gray-900' : 'bg-transparent'}`}
                      href="#"
                      onClick={() => handleTabClick('Notifications')}
                    >
                      <img src={notificationsIcon} alt="Notifications" className="w-7 h-7" />
                      <span className="mx-4 font-medium">Notifications</span>
                    </a>
                    <a
                      className={`flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-400 hover:text-gray-900 ${activeTab === 'Profile' ? 'bg-gray-400 text-gray-900' : 'bg-transparent'}`}
                      href="#"
                      onClick={() => handleTabClick('Profile')}
                    >
                      <img src={profileIcon} alt="Profile" className="w-5 h-5" />
                      <span className="mx-4 font-medium">Profile</span>
                    </a>
                  </>
                )}
                {role === "shopkeeper" && (
                  <>
                    <a
                      className={`flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-400 hover:text-gray-900 ${activeTab === 'Pending Request' ? 'bg-gray-400 text-gray-900' : 'bg-transparent'}`}
                      href="#"
                      onClick={() => handleTabClick('Pending Request')}
                    >
                      <img src={pendingRequestIcon} alt="Pending Request" className="w-7 h-7" />
                      <span className="mx-4 font-medium">Pending Request</span>
                    </a>
                    <a
                      className={`flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-400 hover:text-gray-900 ${activeTab === 'Track Request' ? 'bg-gray-400 text-gray-900' : 'bg-transparent'}`}
                      href="#"
                      onClick={() => handleTabClick('Track Request')}
                    >
                      <img src={acceptedRequestIcon} alt="Track Request" className="w-7 h-7" />
                      <span className="mx-4 font-medium">Track Request</span>
                    </a>
                    <a
                      className={`flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-400 hover:text-gray-900 ${activeTab === 'Profile' ? 'bg-gray-400 text-gray-900' : 'bg-transparent'}`}
                      href="#"
                      onClick={() => handleTabClick('Profile')}
                    >
                      <img src={profileIcon} alt="Profile" className="w-6 h-6" />
                      <span className="mx-4 font-medium">Profile</span>
                    </a>
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
        <div className="flex cursor-pointer items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-red-600 hover:text-white bg-[#ffffff1a] border-[1px] border-[#ffffff20] backdrop-blur-[16px] backdrop-saturate-[200%] p-3 shadow-xl group"  onClick={() => { navigate('/') }}>
            <img src={logoutIcon} alt="Logout" className="w-7 h-7 group-hover:filter group-hover:invert" />
            <span className="mx-4 font-medium">Logout</span>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
