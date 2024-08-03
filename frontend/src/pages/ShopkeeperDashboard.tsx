import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import {
  ShopkeeperProvider,
  useShopkeeper,
} from "../context/ShopkeeperContext";
import SideBar from "../components/SideBar";
import Profile from "../components/Profile";
import EditProfile from "../components/EditProfile";

const DashboardIntro = () => {
  const { shopkeeper } = useShopkeeper();
  return (
    <div className="flex flex-col mx-auto max-w-[50rem] mt-[20%] items-center justify-center flex-grow p-6 text-center">
      <h1 className="text-5xl font-bold gradient-text mb-4">
        Welcome, {shopkeeper?.name || "Shopkeeper"}!
      </h1>
      <p className="text-lg text-gray-700 mb-2">
        We're delighted to have you here. This dashboard is designed to provide
        you with a seamless experience to manage your shop and printing
        services.
      </p>
      <p className="text-lg text-gray-700">
        Navigate through the sidebar to manage your shop profile, view orders,
        and update your services. If you have any questions or need assistance,
        feel free to reach out to our support team.
      </p>
    </div>
  );
};

const ShopkeeperDashboard = () => {
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsIntroVisible(location.pathname === "/shopkeeper-dashboard");
  }, [location]);

  return (
    <ShopkeeperProvider>
      <div className="flex h-screen">
        <div className="fixed w-64 h-full bg-gray-800 text-white">
          <SideBar role="shopkeeper" />
        </div>
        <div className="flex flex-col flex-grow ml-[18rem]">
          <div className="flex-grow overflow-auto">
            {isIntroVisible && <DashboardIntro />}
            <Routes>
              <Route path="/profile" element={<Profile role="shopkeeper" />} />
              <Route path="/edit-profile" element={<EditProfile role="shopkeeper" />} />
            </Routes>
          </div>
        </div>
      </div>
    </ShopkeeperProvider>
  );
};

export default ShopkeeperDashboard;
