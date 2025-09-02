import React from "react";
import './Blog.css';
function Blog() {
    return (
        <div className="BlogPage">
            <h1>Blog</h1>
            <ul className="Posts">
                <li>
                    <span className="Date">Soon enough</span>
                    <a className="Title">One Day</a>
                    <p className="Description"> </p>
                </li>
            </ul>
        </div>
    );
}
export default Blog;