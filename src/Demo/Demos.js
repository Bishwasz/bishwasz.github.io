import React from "react";
import { Link } from "react-router-dom";
import './demo.css';
function Demos() {
    return (
        <div className="DemosPage" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
                <Link to="/demos/pathFinding" style={{ margin: '0 10px' }}>Path Finding Demo</Link>
                <Link to="/demos/gameOfLife" style={{ margin: '0 10px' }}>Game of Life Demo</Link>
                <a>Gravity Simulator (Coming Soon)</a>
            </div>
        </div>
    );
}

export default Demos;
;
