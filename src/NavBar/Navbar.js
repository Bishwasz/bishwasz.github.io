import React from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';
function Navbar() {
    return (
        <header className="band" >
            {/* <div className="logo">
                <span className="title">bishwas.io</span>
            </div> */}
            <div className="menu">
                <Link to="/" id="menu-top">Landing</Link>
                {/* <Link to="/works" id="menu-works">Works</Link> */}
                <Link to="/about" id="menu-about">About</Link>
                <Link to="/blog" id="menu-blog">Blog</Link>
                <Link to="/demos" id="menu-demo">Demos</Link>
                {/* <a href="./" id="menu-top">Landing</a>
                <a href="./works" id="menu-works">Works</a>
                <a href="./about" id="menu-about">About</a>
                <a href="./blog" id="menu-blog">Blog</a>
                <a href="./demos" id="menu-demo">Demos</a> */}
            </div>
        </header>
    );
}

export default Navbar;
