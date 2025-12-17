import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { blogPosts } from "./Blog";
import 'katex/dist/katex.min.css';
import './Blog.css';

function BlogPost() {
  const { id } = useParams();
  const theme = useTheme();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const post = blogPosts.find(p => p.id === id);

  useEffect(() => {
    if (!post?.file) return;

    // Simple fix: just use the origin (works for both localhost and GitHub Pages)
    fetch(`${process.env.PUBLIC_URL}/bosts/${post.file}`)
      .then(res => {
        if (!res.ok) throw new Error('File not found');
        return res.text();
      })
      .then(text => {
        const contentWithoutFrontmatter = text.replace(/^---[\s\S]*?---\n/, '');
        setContent(contentWithoutFrontmatter);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setContent('Failed to load post content.');
        setLoading(false);
      });
  }, [post]);

  if (!post) {
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
        <div style={{ width: '67vw', textAlign: 'left' }}>
          <h1>Post Not Found</h1>
          <Link to="/blog" style={{ color: theme.palette.text.link, textDecoration: 'none' }}>← Back to Blog</Link>
        </div>
      </div>
    );
  }

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
      <div style={{ width: '67vw', textAlign: 'left' }}>
        <Link to="/blog" className="BackLink" style={{ 
          color: theme.palette.text.link,
          textDecoration: 'none',
          display: 'inline-block',
          marginBottom: '24px'
        }}>← Back to Blog</Link>
        
        <article style={{
          width: '100%',
          minHeight: '400px',
          background: theme.palette.background.card,
          padding: '32px',
          borderRadius: '1px',
          boxSizing: 'border-box'
        }}>
          <span className="Date" style={{ fontSize: '14px', opacity: 0.7 }}>{post.date}</span>
          <h1 style={{ marginTop: '8px', marginBottom: '24px' }}>{post.title}</h1>
          
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={theme.palette.mode === 'dark' ? oneDark : oneLight}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        border: theme.palette.mode === 'dark' ? '1px solid #444' : '1px solid #030202ff',
                        borderRadius: '8px'
                      }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code 
                      className={className} 
                      style={{
                        background: theme.palette.mode === 'dark' ? '#2d2d2d' : '#f0f0f0',
                        padding: '2px 6px',
                        fontSize: '14px',
                        border: theme.palette.mode === 'dark' ? '1px solid #444' : '1px solid #ccc'
                      }}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </article>
      </div>
    </div>
  );
}

export default BlogPost;