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

export default PriorityQueue;
