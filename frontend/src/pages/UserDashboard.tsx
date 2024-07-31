import SideBar from "../components/SideBar";
import { UserProvider } from "../context/UserContext";

const UserDashboard = () => {
  return (
    <>
      <UserProvider>
        <SideBar role="user" />
      </UserProvider>
    </>
  );
};

export default UserDashboard;
