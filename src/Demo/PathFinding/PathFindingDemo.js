import React, { useRef, useEffect, useState } from 'react';
import { initializeNodes, assignStartAndEndNodes, renderNodes, drawNode } from './Util/canvasUtils';
import { aStar } from './Util/aStar';
import { dijkstra } from './Util/dijkstra';

function PathFindingDemo() {
    const canvasRef = useRef(null);
    const nodesRef = useRef([]);
    const isDrawingRef = useRef(false);
    const modeRef = useRef('');
    const [mode, setMode] = useState('');
    const [startEndNodes, setStartEndNodes] = useState(null);

    useEffect(() => {
        modeRef.current = mode;
        console.log('Mode:', mode);
    }, [mode]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const initializeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const rows = 25;
            const cols = 40;
            const nodeWidth = canvas.width / cols;
            const nodeHeight = canvas.height / rows;

            const nodes = initializeNodes(rows, cols);
            const startAndEnd = assignStartAndEndNodes(nodes);

            nodesRef.current = nodes;
            setStartEndNodes(startAndEnd);

            updateAndRenderNodes(ctx, nodes, nodeWidth, nodeHeight);
        };

        initializeCanvas();

        window.addEventListener('resize', initializeCanvas);
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('resize', initializeCanvas);
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
        };

        function handleMouseDown(event) {
            if (modeRef.current !== 'draw') return;
            isDrawingRef.current = true;
            handleCanvasClick(event);
        }

        function handleMouseMove(event) {
            if (!isDrawingRef.current) return;
            handleCanvasClick(event);
        }

        function handleMouseUp() {
            isDrawingRef.current = false;
        }

        function handleCanvasClick(event) {
            if (modeRef.current !== 'draw') return;

            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const nodeWidth = canvas.width / 40; // Assuming cols = 40
            const nodeHeight = canvas.height / 25; // Assuming rows = 25
            const clickedRow = Math.floor(y / nodeHeight);
            const clickedCol = Math.floor(x / nodeWidth);

            if (clickedRow >= 25 || clickedCol >= 40 || clickedRow < 0 || clickedCol < 0) return;

            const node = nodesRef.current[clickedRow][clickedCol];
            if (node.color === '#375E97' || node.color === '#FB6542') return;
            node.color = '#101820';
            node.isWall = true;

            drawNode(ctx, clickedCol * nodeWidth, clickedRow * nodeHeight, nodeWidth - 1, nodeHeight - 1, node.color);
        }
    }, []);

    const updateAndRenderNodes = (ctx, nodes, nodeWidth, nodeHeight) => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        renderNodes(ctx, nodes, nodeWidth, nodeHeight);
    };

    const runDijkstra = () => {
        const { startNode, endNode } = startEndNodes;
        const visitedNodesInOrder = [];
        const resultNode = dijkstra(nodesRef.current, startNode, endNode, (node) => {
            visitedNodesInOrder.push(node);
        });

        animatePathfinding(resultNode, visitedNodesInOrder, startNode, endNode);
    };

    const runAStar = () => {
        const { startNode, endNode } = startEndNodes;
        const visitedNodesInOrder = [];
        const resultNode = aStar(nodesRef.current, startNode, endNode, (node) => {
            visitedNodesInOrder.push(node);
        });

        animatePathfinding(resultNode, visitedNodesInOrder, startNode, endNode);
    };

    const animatePathfinding = (resultNode, visitedNodesInOrder, startNode, endNode) => {
        if (resultNode) {
            const ctx = canvasRef.current.getContext('2d');
            const nodeWidth = canvasRef.current.width / nodesRef.current[0].length;
            const nodeHeight = canvasRef.current.height / nodesRef.current.length;

            const animateVisitedNodes = (index) => {
                if (index < visitedNodesInOrder.length) {
                    const node = visitedNodesInOrder[index];
                    if (node !== startNode && node !== endNode) {
                        node.color = 'lightblue';
                        drawNode(ctx, node.y * nodeWidth, node.x * nodeHeight, nodeWidth - 1, nodeHeight - 1, node.color);
                    }
                    setTimeout(() => animateVisitedNodes(index + 1), 10);
                } else {
                    const pathNodes = [];
                    let currentNode = resultNode;
                    while (currentNode.previousNode) {
                        pathNodes.push(currentNode);
                        currentNode = currentNode.previousNode;
                    }

                    const animatePath = (index) => {
                        if (index < pathNodes.length) {
                            const node = pathNodes[index];
                            if (node !== startNode && node !== endNode) {
                                node.color = '#6AB187';
                                drawNode(ctx, node.y * nodeWidth, node.x * nodeHeight, nodeWidth - 1, nodeHeight - 1, node.color);
                            }
                            setTimeout(() => animatePath(index + 1), 10);
                        }
                    };

                    animatePath(0);
                }
            };
            animateVisitedNodes(0);
        }
    };

    const clearGrid = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        initializeCanvas(ctx);
    };

    const initializeCanvas = (ctx) => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const rows = 25;
        const cols = 40;
        const nodeWidth = canvas.width / cols;
        const nodeHeight = canvas.height / rows;

        const nodes = initializeNodes(rows, cols);
        const startAndEnd = assignStartAndEndNodes(nodes);

        nodesRef.current = nodes;
        setStartEndNodes(startAndEnd);

        updateAndRenderNodes(ctx, nodes, nodeWidth, nodeHeight);
    };

    return (
        <div style={{ position: "relative", width: '100%', height: '100%' }}>
            <canvas ref={canvasRef} />
            <button onClick={() => setMode(mode === 'draw' ? '' : 'draw')} style={{ position: 'absolute', top: 10, left: 10 }}>
                {mode === 'draw' ? 'Stop Drawing' : 'Draw Wall'}
            </button>
            <button onClick={runDijkstra} style={{ position: 'absolute', top: 50, left: 10 }}>
                Run Dijkstra
            </button>
            <button onClick={runAStar} style={{ position: 'absolute', top: 90, left: 10 }}>
                Run A*
            </button>
            <button onClick={clearGrid} style={{ position: 'absolute', top: 130, left: 10 }}>
                Clear Grid
            </button>
        </div>
    );
}

export default PathFindingDemo;
