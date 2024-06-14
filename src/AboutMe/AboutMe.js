import React from "react";
import './AboutMe.css';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";


function AboutMe() {
    return (
        <div className="AboutMePage">
            <h1>About</h1>
            <div className="DescriptionMe">
                <p>
                Hey! I'm Bishwas Bhattarai, a third-year student pursuing a double major in Computer Science and Statistics at the University of Alberta. I have a deep-seated fascination for various domains, including Deep Learning, Reinforcement Learning, Generative Models, Computer Graphics,  Software Development and much more. Exploring the intersections of these fields fuels my curiosity and drives me to delve deeper into understanding their applications and implications.
                <br/> Here is my <a target="_blank" rel="noopener noreferrer">CV</a>.
                </p>
            </div>
            <div className="Links">
                <a href="https://github.com/bishwasz" target="_blank" rel="noopener noreferrer">
                    <FaGithub />
                </a>
                <a href="https://www.linkedin.com/in/bishwas-bhattarai-269938219/" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                </a>
                {/* <a href="https://leetcode.com/bishwas2026/" target="_blank" rel="noopener noreferrer">
                    <SiLeetcode />
                </a> */}
            </div>
        </div>
    );
}

export default AboutMe;
