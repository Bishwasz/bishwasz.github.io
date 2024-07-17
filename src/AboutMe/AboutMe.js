import React from "react";
import { useTheme } from '@mui/material/styles';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import './AboutMe.css';

function AboutMe() {
  const theme = useTheme();

  return (
    <div className="AboutMePage" style={{ color: theme.palette.text.primary }}>
      <h1 style={{ color: theme.palette.text.primary }}>About</h1>
      <div className="DescriptionMe">
        <p>
        Hello! I'm Bishwas Bhattarai, a third-year student at the University of Alberta, pursuing a double major in Computer Science and Mathematics. My passion lies in exploring various fields such as deep learning, reinforcement learning, generative models, computer graphics, and software development. Investigating the intersections of these domains not only fuels my curiosity but also motivates me to further examine their applications and implications.          <br/> Here is my <a href="URL_to_CV" target="_blank" rel="noopener noreferrer" style={{ color: theme.palette.primary.main }}>CV</a>.
        </p>
      </div>
      <div className="Links">
        <a href="https://github.com/bishwasz" target="_blank" rel="noopener noreferrer" style={{ color: theme.palette.text.primary }}>
          <FaGithub />
        </a>
        <a href="https://www.linkedin.com/in/bishwas-bhattarai-269938219/" target="_blank" rel="noopener noreferrer" style={{ color: theme.palette.text.primary }}>
          <FaLinkedin />
        </a>
        {/* <a href="https://leetcode.com/bishwas2026/" target="_blank" rel="noopener noreferrer" style={{ color: theme.palette.text.primary }}>
          <SiLeetcode />
        </a> */}
      </div>
    </div>
  );
}

export default AboutMe;

