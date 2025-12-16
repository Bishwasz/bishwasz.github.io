// App.jsx
import { useState } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import Boid from "./Boid/Boid";
import Navbar from "./NavBar/Navbar";
import Blog from "./Blog/Blog";
import BlogPost from "./Blog/BlogPost";  // Add this import
import AboutMe from "./AboutMe/AboutMe";
import Demos from "./Demo/Demos";
import PathFindingDemo from "./Demo/PathFinding/PathFindingDemo";
import GameOfLife from "./Demo/GameOfLife/GameOfLife";
import GravitySimulator from "./Demo/Gravity/Grav";
import WebGPURayTracer from "./Demo/RayTracer/main.tsx";

const HIDDEN_NAVBAR_PATHS = ['/demos/pathFinding', '/demos/gameOfLife', '/demos/gravitySimulator', '/demos/RayTracer'];

function ConditionalNavbar(props) {
  const { pathname } = useLocation();
  return HIDDEN_NAVBAR_PATHS.some(p => pathname.startsWith(p)) ? null : <Navbar {...props} />;
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <HashRouter>
        <ConditionalNavbar isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(d => !d)} />
        <Routes>
          <Route path="/" element={<Boid />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />  {/* Add this route */}
          <Route path="/about" element={<AboutMe />} />
          <Route path="/demos" element={<Demos />} />
          <Route path="/demos/pathFinding" element={<PathFindingDemo />} />
          <Route path="/demos/gameOfLife" element={<GameOfLife />} />
          <Route path="/demos/gravitySimulator" element={<GravitySimulator />} />
          <Route path="/demos/RayTracer" element={<WebGPURayTracer />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}