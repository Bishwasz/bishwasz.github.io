import React from "react";
import { Link } from "react-router-dom";
import './demo.css';

function Demos() {
    return (
        <div className="DemosPage">
            <div className="demo-item">
                <Link to="/demos/pathFinding" className="demo-link">Path Finding Demo</Link>
            </div>
            <div className="demo-item">
                <Link to="/demos/gameOfLife" className="demo-link">John Conway's Cellular Automaton</Link> 
                {/* <Link to="/demos/gameOfLifeWebGPU" className="demo-link">WebGpu</Link> */}
            </div>
            <div className="demo-item">
                <Link to ="/demos/gravitySimulator" className="demo-link">Gravity SandBox </Link>
            </div>
            <div className="demo-item">
                <Link to="/" className="demo_link">Boids (HomePage)</Link>
            </div>
            <div className="demo-item">
                <span className="demo-link">Interactive Fluid Simulation(Coming Soon)</span>
            </div>
            <div className="demo-item">
                <Link to ="/demos/RayTracer" className="demo-link">RayTrace webGpu.(will make it more interactive and efficient)</Link>
            </div>
        </div>
    );
}

export default Demos;



