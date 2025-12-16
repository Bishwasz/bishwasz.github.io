import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';

const defaultSettings = {
    numBoids: 2000,
    cohesion: 0.01,
    alignment: 0.125,
    separation: 50,
    visualRange: 40,
    minSpeed: 1,
    maxSpeed: 3,
    boidSize: 2,
};

function Boids() {
    const canvasRef = useRef(null);
    const mousePosition = useRef({ x: null, y: null });
    const isMouseClicked = useRef(false);
    const theme = useTheme();
    const [isAnimationStarted, setIsAnimationStarted] = useState(false);
    const animationRef = useRef(null);
    const flockRef = useRef(null);
    const [settings] = useState(defaultSettings);

    const initializeBoids = useCallback(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        function generateHiPoints(canvas, numPoints) {
            const fontSize = Math.min(canvas.width, canvas.height) * 0.4;
            const ctx = canvas.getContext('2d');

            ctx.font = `bold ${fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Hi!', canvas.width / 2, canvas.height / 2);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;

            const validPixels = [];
            for (let y = 0; y < canvas.height; y += 2) {
                for (let x = 0; x < canvas.width; x += 2) {
                    if (pixels[(y * canvas.width + x) * 4 + 3] > 0) {
                        validPixels.push({ x, y });
                    }
                }
            }

            for (let i = validPixels.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [validPixels[i], validPixels[j]] = [validPixels[j], validPixels[i]];
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return validPixels.slice(0, numPoints);
        }

        const hiPoints = generateHiPoints(canvas, settings.numBoids);

        const flock = new Array(settings.numBoids);
        for (let i = 0; i < settings.numBoids; i++) {
            flock[i] = {
                x: hiPoints[i]?.x ?? Math.random() * canvas.width,
                y: hiPoints[i]?.y ?? Math.random() * canvas.height,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1,
            };
        }
        return flock;
    }, [settings.numBoids]);

    useEffect(() => {
        if (!flockRef.current) {
            flockRef.current = initializeBoids();
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const flock = flockRef.current;
        const numBoids = flock.length;

        const {
            cohesion: centeringFactor,
            alignment: matchingFactor,
            separation: avoidFactor,
            visualRange,
            minSpeed,
            maxSpeed,
            boidSize,
        } = settings;

        const protectedRangeSquared = 50;
        const visualRangeSquared = visualRange * visualRange;
        const turnFactor = 0.05;
        const attractionFactor = 0.01;
        const width = canvas.width;
        const height = canvas.height;

        const cellSize = visualRange;
        const gridCols = Math.ceil(width / cellSize);
        const gridRows = Math.ceil(height / cellSize);
        const grid = new Array(gridCols * gridRows);

        function buildGrid() {
            for (let i = 0; i < grid.length; i++) grid[i] = [];
            for (let i = 0; i < numBoids; i++) {
                const boid = flock[i];
                const col = Math.floor(boid.x / cellSize);
                const row = Math.floor(boid.y / cellSize);
                const idx = row * gridCols + col;
                if (idx >= 0 && idx < grid.length) {
                    grid[idx].push(i);
                }
            }
        }

        function getNeighborIndices(boid) {
            const col = Math.floor(boid.x / cellSize);
            const row = Math.floor(boid.y / cellSize);
            const neighbors = [];

            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const c = col + dc;
                    const r = row + dr;
                    if (c >= 0 && c < gridCols && r >= 0 && r < gridRows) {
                        const cell = grid[r * gridCols + c];
                        for (let i = 0; i < cell.length; i++) {
                            neighbors.push(cell[i]);
                        }
                    }
                }
            }
            return neighbors;
        }

        const handleMouseDown = (e) => {
            mousePosition.current.x = e.clientX;
            mousePosition.current.y = e.clientY;
            isMouseClicked.current = true;
        };

        const handleMouseUp = () => {
            isMouseClicked.current = false;
            mousePosition.current.x = null;
            mousePosition.current.y = null;
        };

        const handleMouseMove = (e) => {
            if (isMouseClicked.current) {
                mousePosition.current.x = e.clientX;
                mousePosition.current.y = e.clientY;
            }
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mousemove', handleMouseMove);

        const boidColor = theme.palette.mode === 'dark' ? '#fffaf0' : 'black';

        function updateAndRenderBoids() {
            buildGrid();
            ctx.clearRect(0, 0, width, height);

            ctx.fillStyle = boidColor;
            ctx.beginPath();

            for (let i = 0; i < numBoids; i++) {
                const boid = flock[i];
                let xPosAvg = 0, yPosAvg = 0, xVelAvg = 0, yVelAvg = 0;
                let neighboringBoids = 0, closeDx = 0, closeDy = 0;

                const neighborIndices = getNeighborIndices(boid);

                for (let j = 0; j < neighborIndices.length; j++) {
                    const otherBoid = flock[neighborIndices[j]];
                    if (boid === otherBoid) continue;

                    const dx = boid.x - otherBoid.x;
                    const dy = boid.y - otherBoid.y;
                    const squaredDistance = dx * dx + dy * dy;

                    if (squaredDistance < protectedRangeSquared) {
                        closeDx += dx;
                        closeDy += dy;
                    } else if (squaredDistance < visualRangeSquared) {
                        xPosAvg += otherBoid.x;
                        yPosAvg += otherBoid.y;
                        xVelAvg += otherBoid.vx;
                        yVelAvg += otherBoid.vy;
                        neighboringBoids++;
                    }
                }

                if (neighboringBoids > 0) {
                    const inv = 1 / neighboringBoids;
                    boid.vx += (xPosAvg * inv - boid.x) * centeringFactor + (xVelAvg * inv - boid.vx) * matchingFactor;
                    boid.vy += (yPosAvg * inv - boid.y) * centeringFactor + (yVelAvg * inv - boid.vy) * matchingFactor;
                }

                boid.vx += closeDx * avoidFactor;
                boid.vy += closeDy * avoidFactor;

                if (isMouseClicked.current && mousePosition.current.x !== null) {
                    boid.vx += (mousePosition.current.x - boid.x) * attractionFactor;
                    boid.vy += (mousePosition.current.y - boid.y) * attractionFactor;
                }

                if (boid.x < 0) boid.vx += turnFactor;
                else if (boid.x > width) boid.vx -= turnFactor;
                if (boid.y < 0) boid.vy += turnFactor;
                else if (boid.y > height) boid.vy -= turnFactor;

                const speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
                if (speed < minSpeed) {
                    const scale = minSpeed / speed;
                    boid.vx *= scale;
                    boid.vy *= scale;
                } else if (speed > maxSpeed) {
                    const scale = maxSpeed / speed;
                    boid.vx *= scale;
                    boid.vy *= scale;
                }

                boid.x += boid.vx;
                boid.y += boid.vy;

                ctx.moveTo(boid.x + boidSize, boid.y);
                ctx.arc(boid.x, boid.y, boidSize, 0, 6.283185307);
            }

            ctx.fill();
            animationRef.current = requestAnimationFrame(updateAndRenderBoids);
        }

        // Initial static render
        ctx.fillStyle = boidColor;
        ctx.beginPath();
        for (let i = 0; i < numBoids; i++) {
            const boid = flock[i];
            ctx.moveTo(boid.x + boidSize, boid.y);
            ctx.arc(boid.x, boid.y, boidSize, 0, 6.283185307);
        }
        ctx.fill();

        if (isAnimationStarted) {
            updateAndRenderBoids();
        }

        return () => {
            cancelAnimationFrame(animationRef.current);
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, [theme.palette.mode, isAnimationStarted, initializeBoids, settings]);

    return (
        <canvas
            ref={canvasRef}
            onClick={() => !isAnimationStarted && setIsAnimationStarted(true)}
            style={{ cursor: isAnimationStarted ? 'default' : 'pointer' }}
        />
    );
}

export default Boids;