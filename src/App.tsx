import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Nav from "./components/Nav";
import TreeExplorer from "./components/TreeVisualization";
import useReadGlobalState from "./hooks/useReadGlobalState";
import { initialState, type MyState } from "./srsm/userState";
import SrasmChat from "./components/SrasmChat";

const App: React.FC = () => {
  const { globalState } = useReadGlobalState<MyState>({ ...initialState }); // Readableonly

  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tree" element={<TreeExplorer data={globalState} />} />
        <Route path="/chat" element={<SrasmChat />} />
      </Routes>
    </Router>
  );
};

export default App;
