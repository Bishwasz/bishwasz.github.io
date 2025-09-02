import { vec3 } from "gl-matrix";
import { Camera } from "./camera";
import { Node } from "./node";
import type { BVHPrimitive } from "../SceneObjects/BVHObjects";
import { Sphere } from "../SceneObjects/sphere";
import { Triangle } from "../SceneObjects/triangle";
import { ObjMesh } from "../obj_mesh";
import { Quad } from "../SceneObjects/Quad";
import { StlMesh } from "../stl_mesh";

export class Scene {
    camera: Camera;
    spheres: Sphere[] = [];
    triangles: Triangle[] = [];
    quads: Quad[] = [];
    primitives: BVHPrimitive[] = [];
    nodes: Node[] = [];
    primitiveIndices: number[] = [];

    quadCount: number = 0;
    sphereCount: number = 0;
    triangleCount: number = 0;
    totalCount: number = 0;
    floorTriangles: Triangle[] = []; 
    objMeshes: ObjMesh[] = [];
    stlMeshes: StlMesh[] = [];
    nodesUsed: number = 0;
    pointLights: { position: vec3, intensity: number, color: vec3 }[] = [];
    pointLightCount: number = 1;

    constructor() {
    this.camera = new Camera([0.0, 40.0, -15.0], [0.0, 0.0, 0.0]);
        this.objMeshes = [];
        this.stlMeshes = [];
        this.pointLights = [
            { position: vec3.fromValues(3, 9, -4), intensity: 5.4, color: vec3.fromValues(1, 1, 1) }
        ];
           // --- START: ADD FLOOR GEOMETRY ---

        const floorSize = 100.0;
        const y = 0.0; // The height of the floor

        // 1. Define the four corners of the floor quad
        const v1 = vec3.fromValues(-floorSize, y, -floorSize);
        const v2 = vec3.fromValues( floorSize, y, -floorSize);
        const v3 = vec3.fromValues( floorSize, y,  floorSize);
        const v4 = vec3.fromValues(-floorSize, y,  floorSize);

        // This unique color is a "key" to identify the floor in the shader.
        const floorColorKey = vec3.fromValues(1, 1, 1);

        // 2. Create two Triangle objects to form the floor quad.
        // The winding order (v1, v2, v4) ensures the normal points up.
        const floorTriangle1 = new Triangle();
        floorTriangle1.build_from_corners([v1, v2, v4], floorColorKey);
        const floorTriangle2 = new Triangle();
        floorTriangle2.build_from_corners([v2, v3, v4], floorColorKey);

        // 3. Add the floor triangles to our scene's list of triangles
        this.floorTriangles.push(floorTriangle1, floorTriangle2);
        // console.log("Floor triangles created:", this.triangles.length);

        // 4. Update the counts
        this.triangleCount = this.triangles.length;
        this.totalCount = this.sphereCount + this.triangleCount;
        // console.log("Total primitives in scene:", this.totalCount);

        // 5. Add floor triangles to the main primitives list for the BVH
        this.primitives.push(floorTriangle1, floorTriangle2);
        // console.log("Floor triangles added to primitives:", this.primitives.length);

        // 6. Build the BVH so the floor is included.
        this.buildBVH();
    }
private _rebuildScene() {
    this.triangles = [...this.floorTriangles];
    for (const mesh of this.objMeshes) {
        this.triangles.push(...mesh.triangles);
    }
    for (const mesh of this.stlMeshes) {
        this.triangles.push(...mesh.triangles);
    }
    this.primitives = [...this.spheres, ...this.triangles];

    this.sphereCount = this.spheres.length;
    this.triangleCount = this.triangles.length;
    this.totalCount = this.primitives.length;
    
    // console.log(`Scene rebuilt with ${this.totalCount} total primitives (${this.triangleCount} triangles).`);

    // 6. Rebuild the BVH
    this.buildBVH();
}

createRandomPrimitives(sphereCount: number, triangleCount: number) {

    this.spheres = []; // Clear previous spheres

    // 2. Make new random spheres
    for (let i = 0; i < sphereCount; i++) {
        const center: number[] = [
            -25.0 + 50.0 * Math.random(),
            -25.0 + 50.0 * Math.random(),
            -25.0 + 50.0 * Math.random(),
        ];
        const radius: number = 0.1 + 1.9 * Math.random();
        const color: number[] = [
            0.3 + 0.7 * Math.random(),
            0.3 + 0.7 * Math.random(),
            0.3 + 0.7 * Math.random(),
        ];
        const sphere = new Sphere(center, radius, color);
        this.spheres.push(sphere);
    }

    // 3. Make new random triangles
    for (let i = 0; i < triangleCount; i++) {
        const tri = new Triangle();
        const center = vec3.fromValues(
            -50 + 100.0 * Math.random(),
            -50.0 + 100.0 * Math.random(),
            -50.0 + 100.0 * Math.random()
        );
        const size = 0.5 + Math.random() * 2.0;
        const size2 = Math.random() * 0.5 + 0.5; // Random size for the third corner
        const offsets = [
            vec3.fromValues(-size, -size, size2),
            vec3.fromValues(size2, -size, Math.random() * size),
            vec3.fromValues(size, size2, size),
        ];
        const color = vec3.fromValues(
            0.3 + 0.7 * Math.random(),
            0.3 + 0.7 * Math.random(),
            0.3 + 0.7 * Math.random()
        );
        tri.build_from_center_and_offsets(center, offsets, color);
        this.triangles.push(tri);
    }

    // 4. Update counts and rebuild the master primitives list from the clean arrays.
    this.sphereCount = this.spheres.length;
    this.triangleCount = this.triangles.length;
    this.totalCount = this.sphereCount + this.triangleCount;

    // This is the key fix: create a new, correctly-sized primitives array.
    this.primitives = [...this.spheres, ...this.triangles];

    console.log("Scene rebuilt with:", this.totalCount, "total primitives.");
    console.log("Total triangles:", this.triangleCount);
    console.log("Total spheres:", this.sphereCount);

    // 5. Finally, build the BVH with the correct data.
    this.buildBVH();
    
    // --- END: MODIFIED CODE ---
}
// Replace the old loadObjMesh method with this one
async loadObjMesh(filePath: string, color: vec3, scale: number, translation?: vec3, rotation?: vec3): Promise<void> {
    try {
        const newMesh = new ObjMesh();
        await newMesh.initialize(color, filePath, scale, translation, rotation);

        if (newMesh.triangles.length > 0) {
            this.objMeshes.push(newMesh); // Add to the array of meshes
            this._rebuildScene(); // Rebuild everything
        } else {
            console.error("No triangles loaded from .obj file:", filePath);
        }
    } catch (error) {
        console.error("Failed to load .obj mesh:", error);
    }
}

// Replace the old loadStlMesh method with this one
async loadStlMesh(filePath: string, color: vec3, scale: number, translation?: vec3, rotation?: vec3): Promise<void> {
    try {
        const newMesh = new StlMesh();
        await newMesh.initialize(color, filePath, scale, translation, rotation);

        if (newMesh.triangles.length > 0) {
            this.stlMeshes.push(newMesh); // Add to the array of meshes
            this._rebuildScene(); // Rebuild everything
        } else {
            console.error("No triangles loaded from .stl file:", filePath);
        }
    } catch (error) {
        console.error("Failed to load .stl mesh:", error);
    }
}

buildBVH() {
    // --- START: ADD THIS FIX ---
    // If there are no primitives, there's nothing to build.
    if (this.totalCount === 0) {
        this.nodes = [];
        this.primitiveIndices = [];
        this.nodesUsed = 0;
        return; // Exit the function early
    }
    // --- END: ADD THIS FIX ---

    // Initialize the primitiveIndices array with global indices
    this.primitiveIndices = new Array(this.totalCount);
    for (let i = 0; i < this.totalCount; i++) {
        this.primitiveIndices[i] = i;
    }

    // The maximum number of nodes is 2n-1, where n is the number of primitives
    // This line is now safe because we've already handled the totalCount = 0 case.
    this.nodes = new Array(2 * this.totalCount - 1);
    for (let i = 0; i < this.nodes.length; i++) {
        this.nodes[i] = new Node();
    }

    // Set up the root node
    const root: Node = this.nodes[0];
    root.leftChild = 0;
    root.primitiveCount = this.totalCount;
    this.nodesUsed = 1;

    this.updateBounds(0);
    this.subdivide(0);
}

    updateBounds(nodeIndex: number) {
        const node = this.nodes[nodeIndex];
        node.minCorner = vec3.fromValues(Infinity, Infinity, Infinity);
        node.maxCorner = vec3.fromValues(-Infinity, -Infinity, -Infinity);

        // Iterate through all primitives assigned to this node
        for (let i = 0; i < node.primitiveCount; i++) {
            const primitive = this.primitives[this.primitiveIndices[node.leftChild + i]];
            const bounds = primitive.getBoundingBox();
            vec3.min(node.minCorner, node.minCorner, bounds.min);
            vec3.max(node.maxCorner, node.maxCorner, bounds.max);
        }
    }

    subdivide(nodeIndex: number) {
        const node: Node = this.nodes[nodeIndex];

        // Base case: Stop subdividing if the node has 2 or fewer primitives
        if (node.primitiveCount <= 2) {
            return;
        }

        // Find the longest axis of the node's bounding box
        const extent = vec3.create();
        vec3.subtract(extent, node.maxCorner, node.minCorner);
        let axis = 0;
        if (extent[1] > extent[axis]) axis = 1;
        if (extent[2] > extent[axis]) axis = 2;

        const splitPosition = node.minCorner[axis] + extent[axis] / 2;

        // Partition the primitives around the split position using a two-pointer approach
        let i = node.leftChild;
        let j = i + node.primitiveCount - 1;
        while (i <= j) {
            const primitive = this.primitives[this.primitiveIndices[i]];
            if (primitive.getCentroid()[axis] < splitPosition) {
                i++;
            } else {
                const temp = this.primitiveIndices[i];
                this.primitiveIndices[i] = this.primitiveIndices[j];
                this.primitiveIndices[j] = temp;
                j--;
            }
        }

        let leftCount = i - node.leftChild;
        if (leftCount === 0 || leftCount === node.primitiveCount) {
            leftCount = Math.floor(node.primitiveCount / 2);
            i = node.leftChild + leftCount;
            if (leftCount === 0) {
                return;
            }
        }

        // Create new child nodes
        const leftChildIndex = this.nodesUsed++;
        const rightChildIndex = this.nodesUsed++;

        // Configure the new child nodes
        this.nodes[leftChildIndex].leftChild = node.leftChild;
        this.nodes[leftChildIndex].primitiveCount = leftCount;

        this.nodes[rightChildIndex].leftChild = i;
        this.nodes[rightChildIndex].primitiveCount = node.primitiveCount - leftCount;

        // Configure the current node to be an internal node pointing to its children
        node.leftChild = leftChildIndex;
        node.primitiveCount = 0;

        // Update the bounds for the new children
        this.updateBounds(leftChildIndex);
        this.updateBounds(rightChildIndex);

        // Recursively subdivide the children
        this.subdivide(leftChildIndex);
        this.subdivide(rightChildIndex);
    }
}