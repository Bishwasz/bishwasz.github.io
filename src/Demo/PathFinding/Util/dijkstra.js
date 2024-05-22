import PriorityQueue from './PriorityQueue';
// src/utils/dijkstra.js
// import PriorityQueue from './PriorityQueue';

export function dijkstra(nodes, startNode, endNode, visitCallback) {
    const pq = new PriorityQueue();
    startNode.distance = 0;
    pq.enqueue(startNode);

    while (pq.size() > 0) {
        const node = pq.dequeue();
        if (node.visited) continue;
        if (node === endNode) return node;

        node.visited = true;
        visitCallback(node);

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

    if (node.x > 0) neighbors.push(nodes[node.x - 1][node.y]);
    if (node.y < cols - 1) neighbors.push(nodes[node.x][node.y + 1]);
    if (node.x < rows - 1) neighbors.push(nodes[node.x + 1][node.y]);
    if (node.y > 0) neighbors.push(nodes[node.x][node.y - 1]);

    return neighbors;
}
