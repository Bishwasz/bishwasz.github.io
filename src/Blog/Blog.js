import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import './Blog.css';

export const blogPosts = [
  {
    id: 'my-first-post',
    title: 'Math and Code Example',
    date: 'December 2024',
    description: 'A post with LaTeX and code examples',
    file: 'my_first_post.md'
  },
];

function Blog() {
  const theme = useTheme();

  return (
    <div className="BlogPage" style={{
      display: 'flex',
      justifyContent: 'flex-start',
      paddingLeft: '15%',
      paddingTop: '100px',
      minHeight: '100vh',
      background: theme.palette.background.default,
      color: theme.palette.text.primary
    }}>
      <div style={{ width: '100%', textAlign: 'left' }}>

        <h1>Blog</h1>
        <ul className="Posts" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {blogPosts.map(post => (
            <li key={post.id} style={{ marginBottom: '20px' }}>
              <Link to={`/blog/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  width: '70vw',
                  minHeight: '150px',
                  background: theme.palette.background.card,
                  padding: '24px 28px',
                  borderRadius: '12px',
                  boxShadow: theme.shadows.card,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = theme.shadows.cardHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = theme.shadows.card;
                }}
                >
                  <span className="Date" style={{ fontSize: '14px', opacity: 0.7 }}>{post.date}</span>
                  <h3 style={{ margin: '12px 0', fontSize: '22px' }}>{post.title}</h3>
                  <p style={{ margin: 0, opacity: 0.8, fontSize: '15px' }}>{post.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Blog;