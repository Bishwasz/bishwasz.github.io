// sceneManager.ts

import { Scene } from "./Model/scene";
import { Sphere } from "./SceneObjects/sphere";
import { Triangle } from "./SceneObjects/triangle";

export class SceneManager {
    // Scene Data Buffers
    maxBounce:number;
    sceneParameters: GPUBuffer;
    sphereBuffer: GPUBuffer;
    triangleBuffer: GPUBuffer;
    nodeBuffer: GPUBuffer;
    primitiveLookupBuffer: GPUBuffer;
    pointLightBuffer: GPUBuffer;
    // Future buffer: public meshBuffer: GPUBuffer;

    constructor(private device: GPUDevice, private scene: Scene) {
        this.maxBounce=2;
    }

    createBuffers(): void {
        // --- Create Buffers ---
        // You only define the size and usage here.
        this.sceneParameters = this.device.createBuffer({
            size: 80, // Stays the same as your struct
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        // Use a default size or check for count > 0 to avoid creating 0-sized buffers
        const sphereBufferSize = this.scene.sphereCount > 0 ? 32 * this.scene.sphereCount : 32;
        this.sphereBuffer = this.device.createBuffer({
            size: sphereBufferSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        const triangleBufferSize = this.scene.triangleCount > 0 ? 64 * this.scene.triangleCount : 64;
        this.triangleBuffer = this.device.createBuffer({
            size: triangleBufferSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        const nodeBufferSize = this.scene.nodesUsed > 0 ? 32 * this.scene.nodesUsed : 32;
        this.nodeBuffer = this.device.createBuffer({
            size: nodeBufferSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        const primitiveLookupBufferSize = this.scene.totalCount > 0 ? 4 * this.scene.totalCount : 4;
        this.primitiveLookupBuffer = this.device.createBuffer({
            size: primitiveLookupBufferSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        const pointLightCount = 1; // For now, we have one point light
        const pointLightBufferSize = 32 * pointLightCount; // Each PointLight takes 32 bytes
        this.pointLightBuffer = this.device.createBuffer({
            size: pointLightBufferSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        // **Future Addition:**
        // if (this.scene.meshCount > 0) {
        //     this.meshBuffer = this.device.createBuffer({...});
        // }
    }

    updateBuffers(): void {
        // --- Write Data to Buffers ---
        this.writeSceneParameters();
        if (this.scene.sphereCount > 0) this.writeSphereData();
        if (this.scene.triangleCount > 0) this.writeTriangleData();
        if (this.scene.nodesUsed > 0) this.writeBvhNodeData();
        if (this.scene.totalCount > 0) this.writePrimitiveLookupData();
        if (this.scene.pointLightCount > 0) this.writePointLightData();

        // **Future Addition:**
        // if (this.scene.meshCount > 0) {
        //     this.writeMeshData();
        // }
    }
    private writePointLightData(): void {
        const pointLights = this.scene.pointLights;
        const pointLightData = new Float32Array(8 * pointLights.length);
        for (let i = 0; i < pointLights.length; i++) {
            const light = pointLights[i];
            pointLightData.set([...light.position, light.intensity, ...light.color, 0.0], i * 8);
        }
        this.device.queue.writeBuffer(this.pointLightBuffer, 0, pointLightData);
    }

    private writeSceneParameters(): void {

        const sceneDataArray = new Float32Array([
            ...this.scene.camera.position, 0,
            ...this.scene.camera.forwards, 0,
            ...this.scene.camera.right, 0,
            ...this.scene.camera.up, 0,
            this.maxBounce, // maxBounces
            this.scene.sphereCount,
            this.scene.triangleCount,
            1 // lightCount
        ]);
        this.device.queue.writeBuffer(this.sceneParameters, 0, sceneDataArray);
    }

private writeSphereData(): void {
    const sphereData = new Float32Array(8 * this.scene.sphereCount);
    
    // Filter primitives to get only spheres
    const spheres = this.scene.primitives.filter(p => p.constructor.name === 'Sphere') as Sphere[];
    
    for (let i = 0; i < spheres.length; i++) {
        const sphere = spheres[i];
        
        if (!sphere.center || !sphere.color) {
            console.error(`Sphere ${i} missing properties`);
            continue;
        }
        
        const offset = i * 8;
        
        sphereData[offset + 0] = sphere.center[0];
        sphereData[offset + 1] = sphere.center[1];
        sphereData[offset + 2] = sphere.center[2];
        sphereData[offset + 3] = sphere.radius;
        sphereData[offset + 4] = sphere.color[0];
        sphereData[offset + 5] = sphere.color[1];
        sphereData[offset + 6] = sphere.color[2];
        sphereData[offset + 7] = 0.0;
    }
    
    this.device.queue.writeBuffer(this.sphereBuffer, 0, sphereData);
}

    private writeTriangleData(): void {
        const triangleData = new Float32Array(16 * this.scene.triangleCount);
        for (let i = 0; i < this.scene.triangleCount; i++) {
            const triangle = this.scene.triangles[i] as Triangle;
            const baseIndex = 16 * i;
            triangleData.set([...triangle.corners[0], 0.0], baseIndex);
            triangleData.set([...triangle.corners[1], 0.0], baseIndex + 4);
            triangleData.set([...triangle.corners[2], 0.0], baseIndex + 8);
            triangleData.set([...triangle.color, 0.0], baseIndex + 12);
        }
        this.device.queue.writeBuffer(this.triangleBuffer, 0, triangleData);
    }

    private writeBvhNodeData(): void {
        const bvhNodeData = new Uint32Array(this.scene.nodesUsed * 8);
        const floatView = new Float32Array(bvhNodeData.buffer);
        for (let i = 0; i < this.scene.nodesUsed; i++) {
            const node = this.scene.nodes[i];
            const offset = i * 8;
            floatView.set(node.minCorner, offset);
            bvhNodeData[offset + 3] = node.leftChild;
            floatView.set(node.maxCorner, offset + 4);
            bvhNodeData[offset + 7] = node.primitiveCount;
        }
        this.device.queue.writeBuffer(this.nodeBuffer, 0, bvhNodeData);
    }

    private writePrimitiveLookupData(): void {
        const primitiveLookupData = new Uint32Array(this.scene.primitiveIndices);
        this.device.queue.writeBuffer(this.primitiveLookupBuffer, 0, primitiveLookupData);
    }
}