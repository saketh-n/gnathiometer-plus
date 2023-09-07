import React from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import MeasureGrowth from "./components/MeasureGrowth";
import MeasureImprovement from "./components/MeasureImprovement";
import UploadFaceProfile from "./components/UploadFaceProfile";
import UploadProfileBeforeAfter from "./components/UploadProfileBeforeAfter";
import Main from "./pages/Main";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/upload-image-fg" element={<UploadFaceProfile />} />
        <Route path="/measure-growth" element={<MeasureGrowth />} />
        <Route
          path="/upload-before-after"
          element={<UploadProfileBeforeAfter />}
        />
        <Route path="/improvement" element={<MeasureImprovement />} />
      </Routes>
    </Router>
  );
}

export default App;
