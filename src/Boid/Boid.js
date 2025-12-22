import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';

const SETTINGS = {
  numBoids: 2000,
  cohesion: 0.01,
  alignment: 0.125,
  separation: 50,
  visualRange: 40,
  minSpeed: 1,
  maxSpeed: 3,
  boidSize: 2,
};
export default function Boids() {
  const canvasRef = useRef(null);
  const flockRef = useRef(null);
  const gridRef = useRef(null);
  const hiPointsRef = useRef(null);

  const animationRef = useRef(null);
  const runningRef = useRef(false);

  const mouse = useRef({ x: 0, y: 0, down: false });
  const [started, setStarted] = useState(false);
  const theme = useTheme();

  /* ------------------ Helpers ------------------ */
  function drawStaticFrame(ctx, flock, color) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = color;
    ctx.beginPath();
    for (const b of flock) {
      ctx.moveTo(b.x + SETTINGS.boidSize, b.y);
      ctx.arc(b.x, b.y, SETTINGS.boidSize, 0, Math.PI * 2);
    }
    ctx.fill();
  }

  function generateHiPoints(canvas, count) {
    const ctx = canvas.getContext('2d');
    const fontSize = Math.min(canvas.width, canvas.height) * 0.4;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.fillText('Hi!', canvas.width / 2, canvas.height / 2);

    const { data, width, height } = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    const points = [];
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        if (data[(y * width + x) * 4 + 3] > 0) {
          points.push({ x, y });
        }
      }
    }

    for (let i = points.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [points[i], points[j]] = [points[j], points[i]];
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return points.slice(0, count);
  }

  /* ------------------ One-time init (NO theme dependency) ------------------ */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Only generate "Hi!" points once
    if (!hiPointsRef.current) {
      hiPointsRef.current = generateHiPoints(canvas, SETTINGS.numBoids);
    }

    const points = hiPointsRef.current;
    const flock = new Array(SETTINGS.numBoids);

    for (let i = 0; i < SETTINGS.numBoids; i++) {
      const p = points[i];
      flock[i] = {
        x: p ? p.x : Math.random() * canvas.width,
        y: p ? p.y : Math.random() * canvas.height,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
      };
    }

    flockRef.current = flock;

    const cellSize = SETTINGS.visualRange;
    const cols = Math.ceil(canvas.width / cellSize);
    const rows = Math.ceil(canvas.height / cellSize);
    
    gridRef.current = {
      cells: Array.from({ length: cols * rows }, () => []),
      cols,
      rows,
    };

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(animationRef.current);
    };
  }, []); // NO dependencies - only runs once

  /* ------------------ Update static frame when theme changes ------------------ */
  useEffect(() => {
    if (started || !flockRef.current) return; // Don't redraw if animating
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const boidColor = theme.palette.mode === 'dark' ? '#fffaf0' : '#000';
    
    drawStaticFrame(ctx, flockRef.current, boidColor);
  }, [theme.palette.mode, started]);

  /* ------------------ Animation loop ------------------ */
  useEffect(() => {
    if (!started) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const flock = flockRef.current;
    const { cells: grid, cols, rows } = gridRef.current;

    const {
      cohesion,
      alignment,
      separation,
      visualRange,
      minSpeed,
      maxSpeed,
      boidSize,
    } = SETTINGS;

    const width = canvas.width;
    const height = canvas.height;
    const visualRangeSq = visualRange * visualRange;
    const cellSize = visualRange;
    const turnFactor = 0.05;

    const boidColor = theme.palette.mode === 'dark' ? '#fffaf0' : '#000';

    runningRef.current = true;

    function buildGrid() {
      for (const cell of grid) cell.length = 0;
      for (let i = 0; i < flock.length; i++) {
        const b = flock[i];
        const col = (b.x / cellSize) | 0;
        const row = (b.y / cellSize) | 0;
        const idx = row * cols + col;
        if (idx >= 0 && idx < grid.length) {
          grid[idx].push(i);
        }
      }
    }

    function animate() {
      if (!runningRef.current) return;

      buildGrid();
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = boidColor;
      ctx.beginPath();

      for (let i = 0; i < flock.length; i++) {
        const b = flock[i];
        let ax = 0, ay = 0, mx = 0, my = 0, cx = 0, cy = 0, count = 0;

        const col = (b.x / cellSize) | 0;
        const row = (b.y / cellSize) | 0;

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const r = row + dy;
            const c = col + dx;
            
            if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
            
            const cell = grid[r * cols + c];
            if (!cell) continue;

            for (const j of cell) {
              if (i === j) continue;
              const o = flock[j];
              const dx2 = b.x - o.x;
              const dy2 = b.y - o.y;
              const d2 = dx2 * dx2 + dy2 * dy2;

              if (d2 < separation) {
                cx += dx2;
                cy += dy2;
              } else if (d2 < visualRangeSq) {
                ax += o.vx;
                ay += o.vy;
                mx += o.x;
                my += o.y;
                count++;
              }
            }
          }
        }

        if (count) {
          b.vx += (mx / count - b.x) * cohesion;
          b.vy += (my / count - b.y) * cohesion;
          b.vx += (ax / count - b.vx) * alignment;
          b.vy += (ay / count - b.vy) * alignment;
        }

        b.vx += cx * separation;
        b.vy += cy * separation;

        if (mouse.current.down) {
          b.vx += (mouse.current.x - b.x) * 0.01;
          b.vy += (mouse.current.y - b.y) * 0.01;
        }

        if (b.x < 0) b.vx += turnFactor;
        else if (b.x > width) b.vx -= turnFactor;
        if (b.y < 0) b.vy += turnFactor;
        else if (b.y > height) b.vy -= turnFactor;

        const speed = Math.hypot(b.vx, b.vy);
        if (speed > maxSpeed) {
          b.vx *= maxSpeed / speed;
          b.vy *= maxSpeed / speed;
        } else if (speed < minSpeed) {
          b.vx *= minSpeed / speed;
          b.vy *= minSpeed / speed;
        }

        b.x += b.vx;
        b.y += b.vy;

        ctx.moveTo(b.x + boidSize, b.y);
        ctx.arc(b.x, b.y, boidSize, 0, Math.PI * 2);
      }

      ctx.fill();
      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(animationRef.current);
    };
  }, [started, theme.palette.mode]);

  /* ------------------ Mouse handling ------------------ */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const down = e => {
      mouse.current = { x: e.clientX, y: e.clientY, down: true };
    };
    const up = () => (mouse.current.down = false);
    const move = e => {
      if (mouse.current.down) {
        mouse.current.x = e.clientX;
        mouse.current.y = e.clientY;
      }
    };

    canvas.addEventListener('mousedown', down);
    canvas.addEventListener('mouseup', up);
    canvas.addEventListener('mousemove', move);

    return () => {
      canvas.removeEventListener('mousedown', down);
      canvas.removeEventListener('mouseup', up);
      canvas.removeEventListener('mousemove', move);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onClick={() => !started && setStarted(true)}
      style={{ cursor: started ? 'default' : 'pointer' }}
    />
  );
}