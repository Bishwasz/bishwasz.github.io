class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.distance = Infinity; // Used for Dijkstra's algorithm
        this.gScore = Infinity; // Used for A* algorithm
        this.fScore = Infinity; // Used for A* algorithm
        this.visited = false;
        this.color = '#EDF4F2';
        this.isWall = false;
        this.previousNode = null;
    }
}

export default Node;
