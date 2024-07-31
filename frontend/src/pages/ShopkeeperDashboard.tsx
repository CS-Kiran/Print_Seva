import { ShopkeeperProvider } from "../context/ShopkeeperContext";
import Sidebar from "../components/SideBar";

const ShopkeeperDashboard = () => {
  return (
    <>
      <ShopkeeperProvider>
        <Sidebar role="shopkeeper" />
      </ShopkeeperProvider>
    </>
  );
};

export default ShopkeeperDashboard;
