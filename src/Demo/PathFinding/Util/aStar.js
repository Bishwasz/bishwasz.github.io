import PriorityQueue from './PriorityQueue';
// import Node from './Node';
function heuristic(node, endNode) {
    return Math.abs(node.x - endNode.x) + Math.abs(node.y - endNode.y);
}

export function aStar(nodes, startNode, endNode, visitCallback) {
    const pq = new PriorityQueue();
    startNode.gScore = 0;
    startNode.fScore = heuristic(startNode, endNode);
    pq.enqueue(startNode, startNode.fScore);

    while (pq.size() > 0) {
        const node = pq.dequeue();
        if (node.visited) continue;
        if (node === endNode) return node;

        node.visited = true;
        visitCallback(node);

        const neighbors = getNeighbors(nodes, node);
        for (const neighbor of neighbors) {
            if (!neighbor.visited && !neighbor.isWall) {
                const tentativeGScore = node.gScore + 1;

                if (tentativeGScore < neighbor.gScore) {
                    neighbor.previousNode = node;
                    neighbor.gScore = tentativeGScore;
                    neighbor.fScore = tentativeGScore + heuristic(neighbor, endNode);
                    pq.enqueue(neighbor, neighbor.fScore);
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

    if (node.x > 0) neighbors.push(nodes[node.x - 1][node.y]);
    if (node.y < cols - 1) neighbors.push(nodes[node.x][node.y + 1]);
    if (node.x < rows - 1) neighbors.push(nodes[node.x + 1][node.y]);
    if (node.y > 0) neighbors.push(nodes[node.x][node.y - 1]);

    return neighbors;
}
