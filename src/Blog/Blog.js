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
                    <p className="Description">To my knowledge, LeCun et al. 1989 is the earliest real-world application of a neural net trained end-to-end with backpropagation. Can we improve on it using 33 years of progress in deep learning? What does 1989 deep learning look like to someone in 2022, and what will today's deep learning look like to someone in 2055?</p>
                </li>
            </ul>
        </div>
    );
}
export default Blog;