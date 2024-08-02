import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GetStartedPage from "./pages/GetStartedPage";
import { useState } from "react";
import Intro from "./components/Intro";
import UserDashboard from "./pages/UserDashboard";
import ShopkeeperDashboard from "./pages/ShopkeeperDashboard";
import { AlertProvider } from "./context/AlertContext";
import { UserProvider } from "./context/UserContext";
import { ShopkeeperProvider } from "./context/ShopkeeperContext";

function App() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => setShowIntro(false);

  return (
    <AlertProvider>
      <UserProvider>
        <ShopkeeperProvider>
          {showIntro ? (
            <Intro onComplete={handleIntroComplete} />
          ) : (
            <div className="bg-gray-50 font-mono">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/get-started/*" element={<GetStartedPage />} />
                <Route path="/user-dashboard/*" element={<UserDashboard />} />
                <Route path="/shopkeeper-dashboard/*" element={<ShopkeeperDashboard />} />
              </Routes>
            </div>
          )}
        </ShopkeeperProvider>
      </UserProvider>
    </AlertProvider>
  );
}

export default App;
