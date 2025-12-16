import React, { useState, useEffect, useRef } from "react";
import { useTheme } from '@mui/material/styles';
import { FaGithub, FaLinkedin, FaChevronDown, FaChevronRight } from "react-icons/fa";
import './AboutMe.css';

function AboutMe() {
  const theme = useTheme();
  const [hovered, setHovered] = useState(null);
  const [expandedProjects, setExpandedProjects] = useState({});
  const sectionRef = useRef(null);

  const toggleProject = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const projects = [
    {
      id: 'gazprea',
      title: 'Gazprea Compiler',
      description: `I took CMPUT 415 (Compiler Design) to deepen my interest in compilers, and it became the most engaging course I've taken at the University of Alberta. The main project was Gazprea, a statically typed language with shape-aware vector and matrix types. Our team built a compiler targeting LLVM using ANTLR4 and a multi-pass AST-based design. I focused on semantic analysis and backend code generation. The project highlighted how challenging compiler correctness and maintainability are, and how important good design and testing are in large systems.`
    }
  ];

  return (
    <div 
      ref={sectionRef} 
      className="about-me" 
      style={{ 
        background: theme.palette.background.default, 
        color: theme.palette.text.primary,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}
    >
      <div style={{ 
        display: 'flex',
        justifyContent: 'flex-start',
        paddingLeft: '15%',
        flex: 1
      }}>
        <div className="about-me-content" style={{ maxWidth: '700px', textAlign: 'left' }}>
          <h1>About</h1>
          <p>
            I'm Bishwas Bhattarai.
          </p>
          
          <p>
            You can reach me at <a href="mailto:bishwas2026@gmail.com" style={{ color: theme.palette.text.link, textDecoration: 'none' }}>bishwas2026@gmail.com</a>
          </p>

          <h2>Past Projects</h2>
          
          {projects.map(project => (
            <div key={project.id} style={{ marginBottom: '12px' }}>
              <div 
                onClick={() => toggleProject(project.id)}
                style={{ 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 0',
                  userSelect: 'none'
                }}
              >
                {expandedProjects[project.id] ? (
                  <FaChevronDown size={14} />
                ) : (
                  <FaChevronRight size={14} />
                )}
                <strong>{project.title}</strong>
              </div>
              
              {expandedProjects[project.id] && (
                <p style={{ 
                  marginLeft: '22px', 
                  marginTop: '4px',
                  lineHeight: '1.6'
                }}>
                  {project.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="social-links" style={{ 
        paddingBottom: '48px',
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        width: '100%'
      }}>
        <a 
          href="https://github.com/Bishwasz" 
          target="_blank" 
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered("github")}
          onMouseLeave={() => setHovered(null)}
        >
          <FaGithub size={32} color={hovered === "github" ? "#6e5494" : theme.palette.text.primary} />
        </a>
        
        <a 
          href="https://www.linkedin.com/in/bishwas-bhattarai/" 
          target="_blank" 
          rel="noopener noreferrer"
            onMouseEnter={() => setHovered("linkedin")}
          onMouseLeave={() => setHovered(null)}
        >
          <FaLinkedin size={32} color={hovered === "linkedin" ? "#0077b5" : theme.palette.text.primary} />
        </a>
      </div>
    </div>
  );
}

export default AboutMe;