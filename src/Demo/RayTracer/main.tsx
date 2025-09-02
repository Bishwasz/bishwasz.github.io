import React, { useEffect, useRef, useState } from 'react';
import { Scene } from "./Model/scene";
import { Renderer } from "./renderer";
import { vec3 } from "gl-matrix";

const WebGPURayTracer = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [triangleCount, setTriangleCount] = useState(0);
    const [frameTime, setFrameTime] = useState(0);

    useEffect(() => {
        let rendererInstance: Renderer | null = null;
        let animationFrameId: number;

        const runTracer = async () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const scene = new Scene();
            try {
                await scene.loadStlMesh("./STD.stl", vec3.fromValues(0.8, 0.8, 0.0), 0.1, vec3.fromValues(-2, 0, 20), vec3.fromValues(-Math.PI / 2, 0, 0));
                await scene.loadObjMesh("./Dragon.obj", vec3.fromValues(0.4, 0.8, 0.4), 40, vec3.fromValues(-7, -1.3, 3), vec3.fromValues(0, Math.PI, 0));
                await scene.loadStlMesh("./STD.stl", vec3.fromValues(0.8, 0.0, 0.0), 0.1, vec3.fromValues(10, 0, -7), vec3.fromValues(-Math.PI / 2, 1.8*Math.PI, 0));
                await scene.loadObjMesh("./Dragon.obj", vec3.fromValues(0.7, 0.3, 1.0), 40, vec3.fromValues(-17, -1.3, 18), vec3.fromValues(0, -Math.PI/8, 0));

            } catch (error) {
                console.error("Failed to load OBJ file:", error);
                scene.createRandomPrimitives(150, 100);
            }
            
            setTriangleCount(scene.triangleCount);

            rendererInstance = new Renderer(canvas, scene);
            await rendererInstance.initialize();

            // --- Mouse Orbit Control (Full logic restored) ---
            let lastX = 0;
            let lastY = 0;
            let isMouseDown = false;
            const orbitRadius = 5;
            const targetPoint = [0, 0, 0];

            const handleMouseDown = (e: MouseEvent) => {
                isMouseDown = true;
                lastX = e.clientX;
                lastY = e.clientY;
            };

            const handleMouseUp = () => {
                isMouseDown = false;
            };

            const handleMouseMove = (e: MouseEvent) => {
                if (!isMouseDown) return;
                const deltaX = e.clientX - lastX;
                const deltaY = e.clientY - lastY;
                lastX = e.clientX;
                lastY = e.clientY;

                scene.camera.theta += deltaX * 0.005;
                scene.camera.phi += deltaY * 0.005;

                const maxPhi = Math.PI / 2 - 0.01;
                const minPhi = -Math.PI / 2 + 0.01;
                scene.camera.phi = Math.max(minPhi, Math.min(maxPhi, scene.camera.phi));

                scene.camera.position[0] = targetPoint[0] + orbitRadius * Math.cos(scene.camera.theta) * Math.cos(scene.camera.phi);
                scene.camera.position[1] = targetPoint[1] + orbitRadius * Math.sin(scene.camera.phi);
                scene.camera.position[2] = targetPoint[2] + orbitRadius * Math.sin(scene.camera.theta) * Math.cos(scene.camera.phi);

                scene.camera.recalculate_vectors();
            };
            
            canvas.addEventListener("mousedown", handleMouseDown);
            canvas.addEventListener("mouseup", handleMouseUp);
            canvas.addEventListener("mousemove", handleMouseMove);

            // --- Performance Monitoring Loop ---
            const monitorPerformance = () => {
                if (rendererInstance && typeof rendererInstance.lastFrameTimeMs === 'number') {
                    setFrameTime(rendererInstance.lastFrameTimeMs);
                }
                animationFrameId = requestAnimationFrame(monitorPerformance);
            };
            monitorPerformance();
        };

        runTracer();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div>
            <canvas ref={canvasRef} id="gfx-main" width="1000" height="550" />
            <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '5px', borderRadius: '5px', fontFamily: 'sans-serif' }}>
                <p style={{ margin: 0 }}>Triangles: {triangleCount.toLocaleString()}</p>
                <p style={{ margin: 0 }}>Frame Time: {frameTime.toFixed(2)} ms</p>
            </div>
        </div>
    );
};

export default WebGPURayTracer;