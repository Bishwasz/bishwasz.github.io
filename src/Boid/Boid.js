import React, { useRef, useEffect } from 'react';

function Boids() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const flock = [];
        const numBoids = 200;
        for (let i = 0; i < numBoids; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const vx = Math.random() * 2 - 1;
            const vy = Math.random() * 2 - 1;
            flock.push({ x, y, vx, vy });
        }

        const visual_range = 50;
        const protected_range_squared = 50;
        const visual_range_squared = visual_range ** 2;
        const centering_factor = 0.01;
        const matching_factor = 0.125;
        const avoidfactor = 5;
        const turnfactor = 0.05;
        const minspeed = 1;
        const maxspeed = 4;

        function drawNode(ctx, x, y, angle) {
          ctx.beginPath();
          ctx.arc(x, y,5, 0, 2 * Math.PI);
          ctx.fillStyle = 'black';
          ctx.fill();

      
        }

        function updateAndRenderBoids() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const boid of flock) {
                let xpos_avg = 0,
                    ypos_avg = 0,
                    xvel_avg = 0,
                    yvel_avg = 0,
                    neighboring_boids = 0,
                    close_dx = 0,
                    close_dy = 0;

                for (const otherboid of flock) {
                    const dx = boid.x - otherboid.x;
                    const dy = boid.y - otherboid.y;
                    const squared_distance = dx * dx + dy * dy;

                    if (Math.abs(dx) < visual_range && Math.abs(dy) < visual_range) {
                        if (squared_distance < protected_range_squared) {
                            close_dx += boid.x - otherboid.x;
                            close_dy += boid.y - otherboid.y;
                        } else if (squared_distance < visual_range_squared) {
                            xpos_avg += otherboid.x;
                            ypos_avg += otherboid.y;
                            xvel_avg += otherboid.vx;
                            yvel_avg += otherboid.vy;
                            neighboring_boids++;
                        }
                    }
                }

                if (neighboring_boids > 0) {
                    xpos_avg /= neighboring_boids;
                    ypos_avg /= neighboring_boids;
                    xvel_avg /= neighboring_boids;
                    yvel_avg /= neighboring_boids;

                    boid.vx += (xpos_avg - boid.x) * centering_factor + (xvel_avg - boid.vx) * matching_factor;
                    boid.vy += (ypos_avg - boid.y) * centering_factor + (yvel_avg - boid.vy) * matching_factor;
                }

                boid.vx += close_dx * avoidfactor;
                boid.vy += close_dy * avoidfactor;

                if (boid.x < 0) boid.vx += turnfactor;
                if (boid.x > canvas.width) boid.vx -= turnfactor;
                if (boid.y < 0) boid.vy += turnfactor;
                if (boid.y > canvas.height) boid.vy -= turnfactor;

                const speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);

                if (speed < minspeed) {
                    boid.vx = (boid.vx / speed) * minspeed;
                    boid.vy = (boid.vy / speed) * minspeed;
                }
                if (speed > maxspeed) {
                    boid.vx = (boid.vx / speed) * maxspeed;
                    boid.vy = (boid.vy / speed) * maxspeed;
                }

                boid.x += boid.vx;
                boid.y += boid.vy;

                drawNode(ctx, boid.x, boid.y, Math.atan2(boid.vy, boid.vx));
            }

            requestAnimationFrame(updateAndRenderBoids);
        }

        updateAndRenderBoids();

    }, []);

    return <canvas ref={canvasRef} />;
}

export default Boids;
