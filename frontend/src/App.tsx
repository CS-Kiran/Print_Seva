import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GetStartedPage from "./pages/GetStartedPage";
import { useState } from "react";
import Intro from "./components/Intro";

function App() {

  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };
  return (
    <>
    {showIntro && <Intro onComplete={handleIntroComplete} />}
    {!showIntro && (
      <>
      <div className="bg-gray-50 font-mono">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/get-started/*" element={<GetStartedPage />} />
        </Routes>
      </div>
      </>
    )}
    </>
  );
}

export default App;
