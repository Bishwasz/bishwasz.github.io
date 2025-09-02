import { vec3 } from "gl-matrix";
import { Triangle } from "./SceneObjects/triangle";

export class StlMesh {
    v: vec3[]
    vn: vec3[]
    scale: number = 2.0;
    translate: vec3 | null = null;
    rotation: vec3 | null = null; // Rotation angles in radians (x, y, z)

    triangles: Triangle[]
    color: vec3

    constructor() {
        this.v = [];
        this.vn = [];
        this.triangles = [];
    }

    async initialize(color: vec3, url: string, scale: number = 2.0, translation?: vec3, rotation?: vec3) {
        this.color = color;
        this.scale = scale;
        this.translate = translation || null;
        this.rotation = rotation || null; // Store rotation angles in radians (x, y, z)
        await this.readFile(url);
    }

    async readFile(url: string) {
        const response: Response = await fetch(url);
        const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
        
        // Check if it's binary or ASCII STL
        const uint8Array = new Uint8Array(arrayBuffer);
        const header = new TextDecoder().decode(uint8Array.slice(0, 80));
        
        if (header.toLowerCase().includes('solid') && this.isAsciiStl(arrayBuffer)) {
            await this.readAsciiStl(arrayBuffer);
        } else {
            await this.readBinaryStl(arrayBuffer);
        }
    }

    private isAsciiStl(arrayBuffer: ArrayBuffer): boolean {
        const text = new TextDecoder().decode(arrayBuffer);
        return text.includes('facet normal') && text.includes('vertex') && text.includes('endsolid');
    }

    private async readAsciiStl(arrayBuffer: ArrayBuffer) {
        const text = new TextDecoder().decode(arrayBuffer);
        const lines = text.split('\n').map(line => line.trim());
        
        let i = 0;
        while (i < lines.length) {
            const line = lines[i];
            
            if (line.startsWith('facet normal')) {
                const normal = this.parseVector(line.substring(12));
                i++;
                
                // Skip "outer loop"
                i++;
                
                const vertices: vec3[] = [];
                
                // Read 3 vertices
                for (let v = 0; v < 3; v++) {
                    if (lines[i].startsWith('vertex')) {
                        const vertex = this.parseVector(lines[i].substring(6));
                        vertices.push(vertex);
                        i++;
                    }
                }
                
                // Skip "endloop" and "endfacet"
                i += 2;
                
                // Create triangle
                this.createTriangle(vertices, normal);
            } else {
                i++;
            }
        }
    }

    private async readBinaryStl(arrayBuffer: ArrayBuffer) {
        const dataView = new DataView(arrayBuffer);
        
        // Skip 80-byte header
        let offset = 80;
        
        // Read number of triangles (4 bytes)
        const triangleCount = dataView.getUint32(offset, true);
        offset += 4;
        
        for (let i = 0; i < triangleCount; i++) {
            // Read normal vector (12 bytes)
            const normal: vec3 = [
                dataView.getFloat32(offset, true),
                dataView.getFloat32(offset + 4, true),
                dataView.getFloat32(offset + 8, true)
            ];
            offset += 12;
            
            // Read 3 vertices (36 bytes total)
            const vertices: vec3[] = [];
            for (let v = 0; v < 3; v++) {
                const vertex: vec3 = [
                    dataView.getFloat32(offset, true),
                    dataView.getFloat32(offset + 4, true),
                    dataView.getFloat32(offset + 8, true)
                ];
                vertices.push(vertex);
                offset += 12;
            }
            
            // Skip attribute byte count (2 bytes)
            offset += 2;
            
            // Create triangle
            this.createTriangle(vertices, normal);
        }
    }

    private parseVector(vectorString: string): vec3 {
        const components = vectorString.trim().split(/\s+/);
        return [
            Number(components[0]),
            Number(components[1]),
            Number(components[2])
        ];
    }

    private createTriangle(vertices: vec3[], normal: vec3) {
        // Apply scale and transformations to vertices
        const transformedVertices: vec3[] = vertices.map(vertex => {
            const scaledVertex: vec3 = [
                vertex[0] * this.scale,
                vertex[1] * this.scale,
                vertex[2] * this.scale
            ];
            
            // Apply rotation if specified
            if (this.rotation) {
                this.rotateVertex(scaledVertex, this.rotation);
            }
            
            // Apply translation if specified
            if (this.translate) {
                vec3.add(scaledVertex, scaledVertex, this.translate);
            }
            
            return scaledVertex;
        });

        // Also transform the normal vector if rotation is applied
        let transformedNormal = vec3.clone(normal);
        if (this.rotation) {
            this.rotateVertex(transformedNormal, this.rotation);
        }

        // Store vertices and normal
        transformedVertices.forEach(vertex => this.v.push(vertex));
        this.vn.push(transformedNormal);
        
        // Create triangle
        const tri = new Triangle();
        tri.corners.push(transformedVertices[0]);
        tri.corners.push(transformedVertices[1]);
        tri.corners.push(transformedVertices[2]);
        tri.color = this.color;
        tri.make_centroid();
        this.triangles.push(tri);
    }

    // Rotation helper method
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

    // Keep the translate method for post-loading transformations
    translateMesh(offset: vec3) {
        this.v.forEach((vertex) => {
            vec3.add(vertex, vertex, offset);
        });
        
        // Update triangle centroids
        this.triangles.forEach((triangle) => {
            triangle.make_centroid();
        });
    }

    // Additional utility method to get mesh bounds
    getBounds(): { min: vec3, max: vec3 } {
        if (this.v.length === 0) {
            return { min: [0, 0, 0], max: [0, 0, 0] };
        }

        const min: vec3 = [...this.v[0]];
        const max: vec3 = [...this.v[0]];

        this.v.forEach(vertex => {
            min[0] = Math.min(min[0], vertex[0]);
            min[1] = Math.min(min[1], vertex[1]);
            min[2] = Math.min(min[2], vertex[2]);
            max[0] = Math.max(max[0], vertex[0]);
            max[1] = Math.max(max[1], vertex[1]);
            max[2] = Math.max(max[2], vertex[2]);
        });

        return { min, max };
    }
}
