import React from "react";
import './Blog.css';
function Blog() {
    return (
        <div className="BlogPage">
            <h1>My Blog</h1>
            <ul className="Posts">
                <li>
                    <span className="Date">Coming Soon</span>
                    <a className="Title">Implementing REINFORCE: A Simple Policy-Gradient Control Method</a>
                    <p className="Description"> </p>
                </li>
            </ul>
        </div>
    );
}
export default Blog;