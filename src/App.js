import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import Boid from "./Boid/Boid";
import Navbar from "./NavBar/Navbar";
import Blog from "./Blog/Blog";
import AboutMe from "./AboutMe/AboutMe";
import Demos from "./Demo/Demos";
import PathFindingDemo from "./Demo/PathFinding/PathFindingDemo";
import GameOfLife from "./Demo/GameOfLife/GameOfLife";
import GravitySimulator from "./Demo/Gravity/Grav";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <ConditionalNavbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Boid />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/demos" element={<Demos />} />
          <Route path="/demos/pathFinding" element={<PathFindingDemo />} />
          <Route path="/demos/gameOfLife" element={<GameOfLife />} />
          <Route path="/demos/gravitySimulator" element={<GravitySimulator />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

const ConditionalNavbar = ({ isDarkMode, toggleTheme }) => {
  const location = useLocation();

  if (location.pathname.startsWith("/demos/pathFinding") || location.pathname.startsWith("/demos/gameOfLife")) {
    return null;
  }

  return <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
};

export default App;

