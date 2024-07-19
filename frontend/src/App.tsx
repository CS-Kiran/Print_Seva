import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GetStartedPage from "./pages/GetStartedPage";

function App() {
  return (
    <>
      <div className="bg-gray-50 font-mono">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/get-started/*" element={<GetStartedPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
