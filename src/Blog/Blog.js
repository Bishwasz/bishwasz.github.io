import React from "react";
import './Blog.css';
function Blog() {
    return (
        <div className="BlogPage">
            <h1>Blog</h1>
            <ul className="Posts">
                <li>
                    <span className="Date">Coming Soon</span>
                    <a className="Title">Implementing Pixel RNN</a>
                    <p className="Description"> </p>
                </li>
            </ul>
        </div>
    );
}
export default Blog;