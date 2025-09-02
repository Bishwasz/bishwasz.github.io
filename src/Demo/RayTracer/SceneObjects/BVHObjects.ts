import { vec3 } from "gl-matrix";

// Generic interface for any object that can be put in a BVH
export interface BVHPrimitive {
    getBoundingBox(): { min: vec3, max: vec3 };
    getCentroid(): vec3;
}