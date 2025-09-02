import { vec3, vec2 } from "gl-matrix";
import { Triangle } from "./triangle";
import type { BVHPrimitive } from "./BVHObjects";

export class Quad implements BVHPrimitive {
    triangles: Triangle[] = [];
    min: vec3 = vec3.create();
    max: vec3 = vec3.create();
    centroid: vec3 = vec3.create();

    build_from_center_and_offsets(
        center: vec3,
        offsets: vec3[],
        color: vec3,
        uvs?: vec2[],
        hasTexture: boolean = false
    ): void {
        const tri1 = new Triangle();
        const tri2 = new Triangle();
        const vertices = offsets.map(offset => vec3.add(vec3.create(), center, offset));
        tri1.build(
            vertices[0],
            vertices[1],
            vertices[2],
            color,
            uvs ? [uvs[0], uvs[1], uvs[2]] : undefined,
            hasTexture
        );
        tri2.build(
            vertices[0],
            vertices[2],
            vertices[3],
            color,
            uvs ? [uvs[0], uvs[2], uvs[3]] : undefined,
            hasTexture
        );
        this.triangles = [tri1, tri2];
        // Compute bounding box
        this.min = vec3.fromValues(Infinity, Infinity, Infinity);
        this.max = vec3.fromValues(-Infinity, -Infinity, -Infinity);
        for (const vertex of vertices) {
            vec3.min(this.min, this.min, vertex);
            vec3.max(this.max, this.max, vertex);
        }
        vec3.add(this.centroid, this.min, this.max);
        vec3.scale(this.centroid, this.centroid, 0.5);
    }

    getBoundingBox(): { min: vec3; max: vec3 } {
        return { min: this.min, max: this.max };
    }

    getCentroid(): vec3 {
        return this.centroid;
    }
}