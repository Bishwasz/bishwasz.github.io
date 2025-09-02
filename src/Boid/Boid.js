import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';

function Boids() {
    const canvasRef = useRef(null);
    const mousePosition = useRef({ x: null, y: null });
    const isMouseClicked = useRef(false);
    const theme = useTheme();
    const [isAnimationStarted, setIsAnimationStarted] = useState(false);
    const animationRef = useRef(null);
    const flockRef = useRef(null);

    const initializeBoids = useCallback(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        function generateHiPoints(canvas, numPoints) {
            const points = [];
            const fontSize = Math.min(canvas.width, canvas.height) * 0.4;
            const ctx = canvas.getContext('2d');
            
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const text = 'Hi !';
            const x = canvas.width / 2;
            const y = canvas.height / 2;
            
            ctx.fillText(text, x, y);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            
            for (let i = 0; i < numPoints; i++) {
                let rx, ry;
                do {
                    rx = Math.floor(Math.random() * canvas.width);
                    ry = Math.floor(Math.random() * canvas.height);
                } while (pixels[(ry * canvas.width + rx) * 4 + 3] === 0);
                
                points.push({ x: rx, y: ry });
            }
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return points;
        }

        const numBoids = 1000;
        const hiPoints = generateHiPoints(canvas, numBoids);
        
        return hiPoints.map(point => ({
            x: point.x,
            y: point.y,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 2 - 1
        }));
    }, []);

    useEffect(() => {
        if (!flockRef.current) {
            flockRef.current = initializeBoids();
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const visualRange = 40;
        const protectedRangeSquared = 50;
        const visualRangeSquared = visualRange ** 2;
        const centeringFactor = 0.01;
        const matchingFactor = 0.125;
        const avoidFactor = 50;
        const turnFactor = 0.05;
        const minSpeed = 1;
        const maxSpeed = 3;
        const attractionFactor = 0.01;

        canvas.addEventListener('mousedown', (event) => {
            mousePosition.current.x = event.clientX;
            mousePosition.current.y = event.clientY;
            isMouseClicked.current = true;
        });

        canvas.addEventListener('mouseup', () => {
            isMouseClicked.current = false;
            mousePosition.current.x = null;
            mousePosition.current.y = null;
        });

        canvas.addEventListener('mousemove', (event) => {
            if (isMouseClicked.current) {
                mousePosition.current.x = event.clientX;
                mousePosition.current.y = event.clientY;
            }
        });

        function drawBoid(ctx, x, y, color) {
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
        }

        function updateAndRenderBoids() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const boid of flockRef.current) {
                let xPosAvg = 0,
                    yPosAvg = 0,
                    xVelAvg = 0,
                    yVelAvg = 0,
                    neighboringBoids = 0,
                    closeDx = 0,
                    closeDy = 0;

                for (const otherBoid of flockRef.current) {
                    const dx = boid.x - otherBoid.x;
                    const dy = boid.y - otherBoid.y;
                    const squaredDistance = dx * dx + dy * dy;

                    if (Math.abs(dx) < visualRange && Math.abs(dy) < visualRange) {
                        if (squaredDistance < protectedRangeSquared) {
                            closeDx += boid.x - otherBoid.x;
                            closeDy += boid.y - otherBoid.y;
                        } else if (squaredDistance < visualRangeSquared) {
                            xPosAvg += otherBoid.x;
                            yPosAvg += otherBoid.y;
                            xVelAvg += otherBoid.vx;
                            yVelAvg += otherBoid.vy;
                            neighboringBoids++;
                        }
                    }
                }

                if (neighboringBoids > 0) {
                    xPosAvg /= neighboringBoids;
                    yPosAvg /= neighboringBoids;
                    xVelAvg /= neighboringBoids;
                    yVelAvg /= neighboringBoids;

                    boid.vx += (xPosAvg - boid.x) * centeringFactor + (xVelAvg - boid.vx) * matchingFactor;
                    boid.vy += (yPosAvg - boid.y) * centeringFactor + (yVelAvg - boid.vy) * matchingFactor;
                }

                boid.vx += closeDx * avoidFactor;
                boid.vy += closeDy * avoidFactor;

                if (isMouseClicked.current && mousePosition.current.x !== null && mousePosition.current.y !== null) {
                    const dx = mousePosition.current.x - boid.x;
                    const dy = mousePosition.current.y - boid.y;
                    boid.vx += dx * attractionFactor;
                    boid.vy += dy * attractionFactor;
                }

                if (boid.x < 0) boid.vx += turnFactor;
                if (boid.x > canvas.width) boid.vx -= turnFactor;
                if (boid.y < 0) boid.vy += turnFactor;
                if (boid.y > canvas.height) boid.vy -= turnFactor;

                const speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);

                if (speed < minSpeed) {
                    boid.vx = (boid.vx / speed) * minSpeed;
                    boid.vy = (boid.vy / speed) * minSpeed;
                }
                if (speed > maxSpeed) {
                    boid.vx = (boid.vx / speed) * maxSpeed;
                    boid.vy = (boid.vy / speed) * maxSpeed;
                }

                boid.x += boid.vx;
                boid.y += boid.vy;

                drawBoid(ctx, boid.x, boid.y, theme.palette.mode === 'dark' ? '#fffaf0' : 'black');
            }

            animationRef.current = requestAnimationFrame(updateAndRenderBoids);
        }

        // Initial render of static "Hi"
        for (const boid of flockRef.current) {
            drawBoid(ctx, boid.x, boid.y, theme.palette.mode === 'dark' ? '#fffaf0' : 'black');
        }

        if (isAnimationStarted) {
            updateAndRenderBoids();
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [theme.palette.mode, isAnimationStarted, initializeBoids]);

    const handleCanvasClick = () => {
        if (!isAnimationStarted) {
            setIsAnimationStarted(true);
        }
    };

    return <canvas ref={canvasRef} onClick={handleCanvasClick} style={{ cursor: isAnimationStarted ? 'default' : 'pointer' }} />;
}

export default Boids;