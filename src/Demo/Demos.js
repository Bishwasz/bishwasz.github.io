import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import './demo.css';

function Demos() {
    const theme = useTheme();

    const demos = [
        { to: "/demos/pathFinding", title: "Path Finding Demo" },
        { to: "/demos/gameOfLife", title: "Conway's Game of Life" },
        { to: "/demos/gravitySimulator", title: "Gravity Sandbox" },
        { to: "/", title: "Boids (Homepage)" },
        { to: "/demos/RayTracer", title: "Ray Tracer (WebGPU)" },
        { to: null, title: "Fluid Simulation (Coming Soon)" },
    ];

    return (
        <div className="DemosPage" style={{
            paddingLeft: '15%',
            paddingTop: '100px',
            minHeight: '100vh',
            background: theme.palette.background.default,
            color: theme.palette.text.primary
        }}>
            <h1>Demos</h1>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {demos.map((demo, index) => (
                    <li key={index} style={{ marginBottom: '16px' }}>
                        {demo.to ? (
                            <Link
                                to={demo.to}
                                style={{
                                    color: theme.palette.text.link,
                                    textDecoration: 'none',
                                    fontSize: '18px'
                                }}
                            >
                                {demo.title}
                            </Link>
                        ) : (
                            <span style={{ opacity: 0.5, fontSize: '18px' }}>{demo.title}</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Demos;