import type { BVHPrimitive } from "./BVHObjects";
import { vec3 } from "gl-matrix";
export class Sphere implements BVHPrimitive {
    center: Float32Array;
    radius: number;
    color: Float32Array;

    constructor(center: number[], radius: number, color: number[]) {
        this.center = new Float32Array(center);
        this.radius = radius;
        this.color = new Float32Array(color);
    }

    getBoundingBox(): { min: vec3, max: vec3 } {
        const min = vec3.fromValues(
            this.center[0] - this.radius,
            this.center[1] - this.radius,
            this.center[2] - this.radius
        );
        const max = vec3.fromValues(
            this.center[0] + this.radius,
            this.center[1] + this.radius,
            this.center[2] + this.radius
        );
        return { min, max };
    }

    getCentroid(): vec3 {
        return vec3.fromValues(this.center[0], this.center[1], this.center[2]);
    }
}