import Node from './Node';

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
    nodes[startNode.x][startNode.y].color = '#375E97';

    let endNode;
    do {
        endNode = getRandomNode(rows, cols);
    } while (startNode.x === endNode.x && startNode.y === endNode.y);

    nodes[endNode.x][endNode.y].color = '#FB6542';
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

export { initializeNodes, assignStartAndEndNodes, renderNodes, drawNode };
