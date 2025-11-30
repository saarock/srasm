import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Nav from "./components/Nav";
import TreeExplorer from "./components/TreeVisualization";
import useReadGlobalState from "./hooks/useReadGlobalState";
import { initialState, type MyState } from "./srsm/userState";

const App: React.FC = () => {
  const {
    rootState
   } = useReadGlobalState<MyState>({...initialState});



  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tree" element={<TreeExplorer data={{...rootState}} />} />
      </Routes>
    </Router>
  );
};

export default App;
