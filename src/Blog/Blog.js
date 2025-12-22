import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { posts } from './posts';
import './Blog.css';

function Blog() {
  const theme = useTheme();

  return (
    <div
      className="BlogPage"
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        paddingLeft: '15%',
        paddingTop: '100px',
        minHeight: '100vh',
        background: theme.palette.background.default,
        color: theme.palette.text.primary
      }}
    >
      <div style={{ width: '100%', textAlign: 'left' }}>
<div style={{ width: '100%', textAlign: 'left' }}>
  <h1>Blog & Notes </h1>

<h3>Why make a blog?</h3>
<ul style={{ lineHeight: 1.7, paddingLeft: '1.2rem' }}>
  <li>helps me clarify and organize my thoughts.</li>
  <li>
    It serves as a personal log of what I’m learning and keeps me motivated to dive deeper into my interests.
  </li>
  <li>
    As the saying goes: <em>“To teach is to learn twice.”</em>
  </li>
    <li>
    It also makes it easier to notice what I *don’t* understand yet, which is usually the interesting part.
  </li>
</ul>

</div>


        <ul className="Posts" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {posts.map(post => (
            <li key={post.id} style={{ marginBottom: '20px' }}>
              <Link
                to={`/blog/${post.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={{
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
                  <span
                    className="Date"
                    style={{ fontSize: '14px', opacity: 0.7 }}
                  >
                    {post.date}
                  </span>

                  <h3 style={{ margin: '12px 0', fontSize: '22px' }}>
                    {post.title}
                  </h3>

                  <p style={{ margin: 0, opacity: 0.8, fontSize: '15px' }}>
                    {post.description}
                  </p>
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
