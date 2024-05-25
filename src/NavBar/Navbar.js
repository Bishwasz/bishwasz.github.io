import React from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';
import logo from './logo.png'; // Adjust the path as needed

function Navbar() {
    return (
        <header className="band">
            <div className="logo-container">
                <img src={logo} alt="Logo" style={{width:"90px",height:"40px"}} />
            </div>
            <div className="menu">
                <Link to="/" id="menu-top">Landing</Link>
                <Link to="/about" id="menu-about">About</Link>
                <Link to="/blog" id="menu-blog">Blog</Link>
                <Link to="/demos" id="menu-demo">Demos</Link>
            </div>
        </header>
    );
}

export default Navbar;
