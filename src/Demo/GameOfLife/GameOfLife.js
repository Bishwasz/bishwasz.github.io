import React, { useRef, useEffect, useState } from 'react';

const CELL_SIZE = 20;
const INTERVAL_TIME = 100; // Interval time between iterations

class Cell {
    constructor(x, y, isAlive = false) {
        this.x = x;
        this.y = y;
        this.isAlive = isAlive;
    }
}

function GameOfLife() {
    const canvasRef = useRef(null);
    const [grid, setGrid] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const rows = Math.floor(canvas.height / CELL_SIZE);
        const cols = Math.floor(canvas.width / CELL_SIZE);

        const initialGrid = initializeGrid(rows, cols);
        setGrid(initialGrid);
        drawGrid(ctx, initialGrid);

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleResize = () => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const rows = Math.floor(canvas.height / CELL_SIZE);
        const cols = Math.floor(canvas.width / CELL_SIZE);

        const initialGrid = initializeGrid(rows, cols);
        setGrid(initialGrid);
        drawGrid(canvas.getContext('2d'), initialGrid);
    };

    const initializeGrid = (rows, cols) => {
        const grid = [];
        for (let row = 0; row < rows; row++) {
            const rowArray = [];
            for (let col = 0; col < cols; col++) {
                rowArray.push(new Cell(col, row));
            }
            grid.push(rowArray);
        }
        return grid;
    };

    const drawGrid = (ctx, grid) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        grid.forEach(row => {
            row.forEach(cell => {
                ctx.beginPath();
                ctx.rect(cell.x * CELL_SIZE, cell.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                ctx.fillStyle = cell.isAlive ? 'black' : 'white';
                ctx.fill();
            });
        });
    };

    const handleMouseDown = event => {
        setIsMouseDown(true);
        toggleCellState(event);
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
    };

    const handleMouseMove = event => {
        if (isMouseDown) {
            toggleCellState(event);
        }
    };

    const toggleCellState = event => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / CELL_SIZE);
        const y = Math.floor((event.clientY - rect.top) / CELL_SIZE);

        const updatedGrid = [...grid];
        if (updatedGrid[y] && updatedGrid[y][x]) {
            updatedGrid[y][x].isAlive = !updatedGrid[y][x].isAlive;
            setGrid(updatedGrid);
            drawGrid(canvas.getContext('2d'), updatedGrid);
        }
    };

    const getNextGeneration = grid => {
        const newGrid = [];
        for (let y = 0; y < grid.length; y++) {
            const newRow = [];
            for (let x = 0; x < grid[y].length; x++) {
                const aliveNeighbors = getAliveNeighbors(grid, x, y);
                if (grid[y][x].isAlive) {
                    if (aliveNeighbors === 2 || aliveNeighbors === 3) {
                        newRow.push(new Cell(x, y, true));
                    } else {
                        newRow.push(new Cell(x, y, false));
                    }
                } else {
                    if (aliveNeighbors === 3) {
                        newRow.push(new Cell(x, y, true));
                    } else {
                        newRow.push(new Cell(x, y, false));
                    }
                }
            }
            newGrid.push(newRow);
        }
        return newGrid;
    };

    const getAliveNeighbors = (grid, x, y) => {
        let count = 0;
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            for (let xOffset = -1; xOffset <= 1; xOffset++) {
                const neighborX = x + xOffset;
                const neighborY = y + yOffset;
                if (neighborX >= 0 && neighborX < grid[0].length && neighborY >= 0 && neighborY < grid.length && !(xOffset === 0 && yOffset === 0)) {
                    if (grid[neighborY][neighborX].isAlive) {
                        count++;
                    }
                }
            }
        }
        return count;
    };

    const handleStartStop = () => {
        setIsRunning(!isRunning);
    };

    useEffect(() => {
        let intervalId;
        if (isRunning) {
            intervalId = setInterval(() => {
                setGrid(prevGrid => {
                    const nextGrid = getNextGeneration(prevGrid);
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext('2d');
                    drawGrid(ctx, nextGrid);
                    return nextGrid;
                });
            }, INTERVAL_TIME);
        } else {
            clearInterval(intervalId);
        }
        return () => clearInterval(intervalId);
    }, [isRunning]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            />
            <button
                style={{ position: 'absolute', top: 10, right: 10 }}
                onClick={handleStartStop}
            >
                {isRunning ? 'Stop' : 'Start'}
            </button>
        </div>
    );
}

export default GameOfLife;
