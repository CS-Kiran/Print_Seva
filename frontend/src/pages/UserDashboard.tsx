import { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import SideBar from "../components/SideBar";
import { UserProvider, useUser } from "../context/UserContext";
import AvailableShops from "../components/AvailableShops";

const DashboardIntro = () => {
  const { user } = useUser() as { user: String };
  return (
    <div className="flex flex-col mx-auto max-w-[50rem] mt-[20%] items-center justify-center flex-grow p-6 text-center">
      <h1 className="text-5xl font-bold gradient-text mb-4">
        Welcome, {user?.name || "User"}!
      </h1>
      <p className="text-lg text-gray-700 mb-2">
        We're delighted to have you here. This dashboard is designed to provide
        you with a seamless experience to manage your printing needs.
      </p>
      <p className="text-lg text-gray-700">
        Navigate through the sidebar to explore available shops and manage your
        print orders efficiently. If you have any questions or need assistance,
        feel free to reach out to our support team.
      </p>
    </div>
  );
};

const UserDashboard = () => {
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsIntroVisible(location.pathname === "/user-dashboard");
  }, [location]);

  return (
    <UserProvider>
      <div className="flex h-screen">
        <div className="fixed w-64 h-full bg-gray-800 text-white">
          <SideBar role="user" />
        </div>
        <div className="flex flex-col flex-grow ml-[18rem]">
          <div className="flex-grow overflow-auto">
            {isIntroVisible && <DashboardIntro />}
            <Routes>
              <Route path="/available-shops" element={<AvailableShops />} />
              {/* Add additional routes here if needed */}
            </Routes>
          </div>
        </div>
      </div>
    </UserProvider>
  );
};

export default UserDashboard;
