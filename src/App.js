import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

import Boid from "./Boid/Boid";
import Navbar from "./NavBar/Navbar";
import Blog from "./Blog/Blog";
import AboutMe from "./AboutMe/AboutMe";
import Demos from "./Demo/Demos";
import PathFindingDemo from "./Demo/PathFinding/PathFindingDemo";
import GameOfLife from "./Demo/GameOfLife/GameOfLife";

const App = () => {
  return (
    <div>
      <Router>
        <ConditionalNavbar />
        <Routes>
          <Route path="/" element={<Boid />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/demos" element={<Demos />} />
          <Route path="/demos/pathFinding" element={<PathFindingDemo />} />
          <Route path="/demos/gameOfLife" element={<GameOfLife />} />
        </Routes>
      </Router>
    </div>
  );
};

const ConditionalNavbar = () => {
  const location = useLocation();

  if (location.pathname.startsWith("/demos/pathFinding") || location.pathname.startsWith("/demos/gameOfLife")) {
    return null;
  }

  return <Navbar />;
};

export default App;

