import React from 'react';
import './NavBar.css';
function Navbar() {
    return (
        <header className="band" >
            {/* <div className="logo">
                <span className="title">bishwas.io</span>
            </div> */}
            <div className="menu">
                <a href="./" id="menu-top">Top</a>
                <a href="./works" id="menu-works">Works</a>
                <a href="./about" id="menu-about">About</a>
                <a href="./blog" id="menu-blog">Blog</a>
                <a href="./demos" id="menu-demo">Demos</a>
            </div>
        </header>
    );
}

export default Navbar;
