class PriorityQueue {
    constructor() {
        this.values = [];
    }

    enqueue(element, priority) {
        this.values.push({ element, priority });
        this.sort();
    }

    dequeue() {
        return this.values.shift().element;
    }

    size() {
        return this.values.length;
    }

    sort() {
        this.values.sort((a, b) => a.priority - b.priority);
    }
}

export default PriorityQueue;
