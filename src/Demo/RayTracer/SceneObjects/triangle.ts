import { vec3, vec2 } from "gl-matrix";
import type { BVHPrimitive } from "./BVHObjects";

export class Triangle implements BVHPrimitive {
    corners: vec3[];
    color: vec3;
    centroid: vec3;
    uvs?: vec2[];              // texture coordinates (optional)
    hasTexture: boolean = false;

    constructor() {
        this.corners = [];
        this.centroid = vec3.create();
        this.color = vec3.create();
    }

    build(
        v0: vec3,
        v1: vec3,
        v2: vec3,
        color: vec3,
        uvs?: vec2[],
        hasTexture: boolean = false
    ) {
        this.build_from_corners([v0, v1, v2], color);

        if (uvs) {
            this.uvs = uvs.map(uv => vec2.clone(uv));
        }
        this.hasTexture = hasTexture;
    }

    build_from_corners(corners: vec3[], color: vec3) {
        if (corners.length !== 3) {
            throw new Error("Triangle must be built from exactly 3 corners.");
        }
        this.corners = corners.map(corner => vec3.clone(corner));
        this.make_centroid();
        this.color = vec3.clone(color);
    }

    build_from_center_and_offsets(center: vec3, offsets: vec3[], color: vec3) {
        this.corners = [];
        offsets.forEach((offset: vec3) => {
            let corner = vec3.create();
            vec3.add(corner, center, offset);
            this.corners.push(corner);
        });
        
        this.make_centroid();
        this.color = vec3.clone(color);
    }

    make_centroid() {
        this.centroid = vec3.fromValues(
            (this.corners[0][0] + this.corners[1][0] + this.corners[2][0]) / 3,
            (this.corners[0][1] + this.corners[1][1] + this.corners[2][1]) / 3,
            (this.corners[0][2] + this.corners[1][2] + this.corners[2][2]) / 3
        );
    }

    getBoundingBox(): { min: vec3, max: vec3 } {
        const min = vec3.fromValues(Infinity, Infinity, Infinity);
        const max = vec3.fromValues(-Infinity, -Infinity, -Infinity);
        
        this.corners.forEach(corner => {
            vec3.min(min, min, corner);
            vec3.max(max, max, corner);
        });
        
        return { min, max };
    }

    getCentroid(): vec3 {
        return this.centroid;
    }
}
