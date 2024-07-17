import React, { useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

function Boids() {
    const canvasRef = useRef(null);
    const mousePosition = useRef({ x: null, y: null });
    const isMouseClicked = useRef(false);
    const theme = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const flock = [];
        const numBoids = 600;
        for (let i = 0; i < numBoids; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const vx = Math.random() * 2 - 1;
            const vy = Math.random() * 2 - 1;
            flock.push({ x, y, vx, vy });
        }

        const visualRange = 50;
        const protectedRangeSquared = 50;
        const visualRangeSquared = visualRange ** 2;
        const centeringFactor = 0.01;
        const matchingFactor = 0.125;
        const avoidFactor = 10;
        const turnFactor = 0.05;
        const minSpeed = 1;
        const maxSpeed = 4;
        const attractionFactor = 0.05;

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

            for (const boid of flock) {
                let xPosAvg = 0,
                    yPosAvg = 0,
                    xVelAvg = 0,
                    yVelAvg = 0,
                    neighboringBoids = 0,
                    closeDx = 0,
                    closeDy = 0;

                for (const otherBoid of flock) {
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

                drawBoid(ctx, boid.x, boid.y, theme.palette.mode === 'dark' ? 'white' : 'black');
            }

            requestAnimationFrame(updateAndRenderBoids);
        }

        updateAndRenderBoids();
    }, [theme.palette.mode]);

    return <canvas ref={canvasRef} />;
}

export default Boids;
