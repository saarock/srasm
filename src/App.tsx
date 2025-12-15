import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogHome from './components/BlogHome';
import Nav from './components/Nav';
import TreeWrapper from './components/TreeVisualization/TreeWrapper';
import SrasmChat from './components/SrasmChat';
import ReRenderDemo from './components/ReRenderDemo';

const App: React.FC = () => {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<BlogHome />} />
        <Route path="/tree" element={<TreeWrapper />} />
        <Route path="/chat" element={<SrasmChat chatPath='/chat' />} />
        <Route path="/demo" element={<ReRenderDemo />} />
        {/* Add more routes here as needed */}
        {/* Example: <Route path="/about" element={<About />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
