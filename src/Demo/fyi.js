import React, { useRef, useEffect, useState } from 'react';

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.distance = Infinity;
        this.visited = false;
        this.color = 'grey'; // Default color
        this.isWall = false;
        this.previousNode = null; // To trace the shortest path
    }
}

class PriorityQueue {
    constructor() {
        this.values = [];
    }

    enqueue(node) {
        let flag = false;
        for (let i = 0; i < this.values.length; i++) {
            if (this.values[i].distance > node.distance) {
                this.values.splice(i, 0, node);
                flag = true;
                break;
            }
        }
        if (!flag) {
            this.values.push(node);
        }
    }

    dequeue() {
        return this.values.shift();
    }

    size() {
        return this.values.length;
    }
}

function dijkstra(nodes, startNode, endNode, visitCallback) {
    const pq = new PriorityQueue();
    startNode.distance = 0;
    pq.enqueue(startNode);

    while (pq.size() > 0) {
        const node = pq.dequeue();
        if (node.visited) continue;
        if (node === endNode) return node;

        node.visited = true;
        visitCallback(node); // Call the callback to update the node color

        const neighbors = getNeighbors(nodes, node);
        for (const neighbor of neighbors) {
            if (!neighbor.visited && !neighbor.isWall) {
                const newDistance = node.distance + 1;
                if (newDistance < neighbor.distance) {
                    neighbor.distance = newDistance;
                    neighbor.previousNode = node;
                    pq.enqueue(neighbor);
                }
            }
        }
    }

    return null;
}

function getNeighbors(nodes, node) {
    const neighbors = [];
    const rows = nodes.length;
    const cols = nodes[0].length;

    if (node.x > 0) neighbors.push(nodes[node.x - 1][node.y]); // Top
    if (node.y < cols - 1) neighbors.push(nodes[node.x][node.y + 1]); // Right
    if (node.x < rows - 1) neighbors.push(nodes[node.x + 1][node.y]); // Bottom
    if (node.y > 0) neighbors.push(nodes[node.x][node.y - 1]); // Left

    return neighbors;
}

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

        function updateAndRenderNodes() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            renderNodes(ctx, nodes, nodeWidth, nodeHeight);
        }

        updateAndRenderNodes();

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);

        return () => {
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

            const clickedRow = Math.floor(y / nodeHeight);
            const clickedCol = Math.floor(x / nodeWidth);

            if (clickedRow >= rows || clickedCol >= cols || clickedRow < 0 || clickedCol < 0) return;

            const node = nodesRef.current[clickedRow][clickedCol];
            if (node.color === 'green' || node.color === 'blue') return;
            node.color = 'white';
            node.isWall = true;

            drawNode(ctx, clickedCol * nodeWidth, clickedRow * nodeHeight, nodeWidth - 1, nodeHeight - 1, node.color);
        }
    }, []);

    const initializeNodes = (rows, cols) => {
        const nodes = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                row.push(new Node(i, j));
            }
            nodes.push(row);
        }
        return nodes;
    };

    const assignStartAndEndNodes = (nodes) => {
        const rows = nodes.length;
        const cols = nodes[0].length;
        const startNode = getRandomNode(rows, cols);
        nodes[startNode.x][startNode.y].color = 'green';

        let endNode;
        do {
            endNode = getRandomNode(rows, cols);
        } while (startNode.x === endNode.x && startNode.y === endNode.y);

        nodes[endNode.x][endNode.y].color = 'blue';
        return { startNode: nodes[startNode.x][startNode.y], endNode: nodes[endNode.x][endNode.y] };
    };

    const getRandomNode = (rows, cols) => {
        const x = Math.floor(Math.random() * rows);
        const y = Math.floor(Math.random() * cols);
        return { x, y };
    };

    const renderNodes = (ctx, nodes, nodeWidth, nodeHeight) => {
        nodes.forEach((row, i) => {
            row.forEach((node, j) => {
                const x = j * nodeWidth;
                const y = i * nodeHeight;
                drawNode(ctx, x, y, nodeWidth - 1, nodeHeight - 1, node.color);
            });
        });
    };

    const drawNode = (ctx, x, y, width, height, color) => {
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.fillStyle = color;
        ctx.fill();
    };

    const runDijkstra = () => {
        const { startNode, endNode } = startEndNodes;
        const visitedNodesInOrder = [];
        const resultNode = dijkstra(nodesRef.current, startNode, endNode, (node) => {
            visitedNodesInOrder.push(node);
        });

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
                    setTimeout(() => animateVisitedNodes(index + 1), 10); // Adjust the delay here
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
                                node.color = 'yellow';
                                drawNode(ctx, node.y * nodeWidth, node.x * nodeHeight, nodeWidth - 1, nodeHeight - 1, node.color);
                            }
                            setTimeout(() => animatePath(index + 1), 10); // Adjust the delay here
                        }
                    };

                    animatePath(0);
                }
            };

            animateVisitedNodes(0);
        }
    };

    return (
        <div style={{ position: "relative", width: '100%', height: '100%' }}>
            <canvas ref={canvasRef} />
            <button onClick={() => setMode(mode === 'draw' ? '' : 'draw')} style={{ position: 'absolute', top: 10, right: 10 }}>
                {mode === 'draw' ? 'Stop Drawing' : 'Draw Wall'}
            </button>
            <button onClick={runDijkstra} style={{ position: 'absolute', top: 50, right: 10 }}>
                Run Dijkstra
            </button>
        </div>
    );
}

export default PathFindingDemo;
