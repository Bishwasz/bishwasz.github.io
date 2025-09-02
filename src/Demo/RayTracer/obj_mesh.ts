import { vec3, vec2 } from "gl-matrix";
import { Triangle } from "./SceneObjects/triangle";

export class ObjMesh {
    v: vec3[];
    vt: vec2[];
    vn: vec3[];
    scale: number = 2.0;
    translate: vec3 | null = null; 
    rotation: vec3 | null = null; // Rotation angles in radians (x, y, z)

    triangles: Triangle[];
    color: vec3;

    constructor() {
        this.v = [];
        this.vt = [];
        this.vn = [];
        this.triangles = [];
    }

    async initialize(color: vec3, url: string, scale: number = 2.0, translation?: vec3, rotation?: vec3) {
        this.color = color;
        this.scale = scale;
        this.translate = translation || null;
        this.rotation = rotation || null;
        await this.readFile(url);
    }

    async readFile(url: string) {
        const result: number[] = [];

        const response: Response = await fetch(url);
        const blob: Blob = await response.blob();
        const file_contents = await blob.text();
        const lines = file_contents.split("\n");

        lines.forEach(line => {
            if (line.startsWith("v ")) {
                this.read_vertex_data(line);
            }
            else if (line.startsWith("vt")) {
                this.read_texcoord_data(line);
            }
            else if (line.startsWith("vn")) {
                this.read_normal_data(line);
            }
            else if (line.startsWith("f")) {
                this.read_face_data(line, result);
            }
        });
    }

    read_vertex_data(line: string) {
        const components = line.trim().split(/\s+/);
        const new_vertex: vec3 = [
            Number(components[1]) * this.scale,
            Number(components[2]) * this.scale,
            Number(components[3]) * this.scale
        ];

        // Apply rotation first (if any)
        if (this.rotation) {
            this.rotateVertex(new_vertex, this.rotation);
        }

        // Apply translation (if any)
        if (this.translate) {
            vec3.add(new_vertex, new_vertex, this.translate);
        }

        this.v.push(new_vertex);
    }

    read_texcoord_data(line: string) {
        const components = line.split(/\s+/);
        const new_texcoord: vec2 = [
            Number(components[1]),
            Number(components[2])
        ];
        this.vt.push(new_texcoord);
    }

    read_normal_data(line: string) {
        const components = line.split(/\s+/);
        const new_normal: vec3 = [
            Number(components[1]),
            Number(components[2]),
            Number(components[3])
        ];

        // Rotate normals if mesh is rotated
        if (this.rotation) {
            this.rotateVertex(new_normal, this.rotation);
        }

        this.vn.push(new_normal);
    }

    read_face_data(line: string, result: number[]) {
        const vertex_descriptions = line.trim().split(/\s+/);
        const triangle_count = vertex_descriptions.length - 3;

        for (let i = 0; i < triangle_count; i++) {
            const tri = new Triangle();
            tri.corners.push(this.read_corner(vertex_descriptions[1], result));
            tri.corners.push(this.read_corner(vertex_descriptions[2 + i], result));
            tri.corners.push(this.read_corner(vertex_descriptions[3 + i], result));
            tri.color = this.color;
            tri.make_centroid();
            this.triangles.push(tri);
        }
    }

    read_corner(vertex_description: string, result: number[]): vec3 {
        const v_vt_vn = vertex_description.split("/");
        const v = this.v[Number(v_vt_vn[0]) - 1];
        return v;
    }

    // Rotation helper (same as in StlMesh)
    private rotateVertex(vertex: vec3, rotation: vec3) {
        const [rx, ry, rz] = rotation;

        // Rotate around X-axis
        if (rx !== 0) {
            const cos_rx = Math.cos(rx);
            const sin_rx = Math.sin(rx);
            const y = vertex[1] * cos_rx - vertex[2] * sin_rx;
            const z = vertex[1] * sin_rx + vertex[2] * cos_rx;
            vertex[1] = y;
            vertex[2] = z;
        }

        // Rotate around Y-axis
        if (ry !== 0) {
            const cos_ry = Math.cos(ry);
            const sin_ry = Math.sin(ry);
            const x = vertex[0] * cos_ry + vertex[2] * sin_ry;
            const z = -vertex[0] * sin_ry + vertex[2] * cos_ry;
            vertex[0] = x;
            vertex[2] = z;
        }

        // Rotate around Z-axis
        if (rz !== 0) {
            const cos_rz = Math.cos(rz);
            const sin_rz = Math.sin(rz);
            const x = vertex[0] * cos_rz - vertex[1] * sin_rz;
            const y = vertex[0] * sin_rz + vertex[1] * cos_rz;
            vertex[0] = x;
            vertex[1] = y;
        }
    }

    translateMesh(offset: vec3) {
        this.v.forEach(vertex => {
            vec3.add(vertex, vertex, offset);
        });
        this.triangles.forEach(triangle => {
            triangle.make_centroid();
        });
    }
}
