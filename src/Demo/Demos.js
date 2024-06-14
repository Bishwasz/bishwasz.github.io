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
            </div>
            <div className="demo-item">
                <Link to ="/demos/gravitySimulator" className="demo-link">Gravity Simulator</Link>
            </div>
            <div className="demo-item">
                <span className="demo-link">Interactive Fluid Simulation(Coming Soon)</span>
            </div>
        </div>
    );
}

export default Demos;



