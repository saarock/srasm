import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SRASMTreePage from "./pages/SRASMTreePag";
import Nav from "./components/Nav";

const App: React.FC = () => {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tree" element={<SRASMTreePage />} />
      </Routes>
    </Router>
  );
};

export default App;
