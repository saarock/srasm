import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogHome from './components/BlogHome';
import Nav from './components/Nav';
import TreeExplorer from './components/TreeVisualization';
import { useReadGlobalState } from './hooks';
import { initialState } from './srsm';
import SrasmChat from './components/SrasmChat';

const App: React.FC = () => {
  const { globalState } = useReadGlobalState({ blog: initialState });

  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<BlogHome />} />
        <Route path="/tree" element={<TreeExplorer data={globalState} />} />
        <Route path="/chat" element={<SrasmChat chatPath='/chat' />} />
        {/* Add more routes here as needed */}
        {/* Example: <Route path="/about" element={<About />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
