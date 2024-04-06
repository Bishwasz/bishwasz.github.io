import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Boid from "./Boid";
import Navbar from "./Navbar";
import Blog from "./Blog";
import AboutMe from "./AboutMe";
import Demos from "./Demos";
import PathFindingDemo from "./PathFindingDemo";

function App() {
  return (
    <div>
      
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Boid />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/demos" element={<Demos/>}/>
          <Route path="/demos/pathFinding" element={<PathFindingDemo/>}>
            

          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;