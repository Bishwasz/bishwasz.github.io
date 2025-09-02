// renderer.ts

import { GpuManager } from "./gpuManager";
import { SceneManager } from "./sceneManager";
import { Scene } from "./Model/scene";
import { compShader } from "./shader";
import { screen_shader } from "./screen_shader";

export class Renderer {
    private gpuManager: GpuManager;
    private sceneManager: SceneManager;

    // Assets
    private colorBuffer: GPUTexture;
    private colorBufferView: GPUTextureView;
    private sampler: GPUSampler;

    // Pipelines & Bind Groups
    private rayTracingPipeline: GPUComputePipeline;
    private rayTracingBindGroup: GPUBindGroup;
    private screenPipeline: GPURenderPipeline;
    private screenBindGroup: GPUBindGroup;
    frametime: number
    public lastFrameTimeMs: number = 0; 
    


    constructor(private canvas: HTMLCanvasElement, private scene: Scene) {
        this.gpuManager = new GpuManager(canvas);
        // The SceneManager needs the device, so we pass it in after it's initialized.
    }

    async initialize(): Promise<void> {
        try {
            await this.gpuManager.initialize();
            // Now that the device exists, we can create the scene manager
            this.sceneManager = new SceneManager(this.gpuManager.device, this.scene);
            
            this.createAssets();
            this.sceneManager.createBuffers();
            this.sceneManager.updateBuffers(); // Initial data upload
            await this.createPipelines();
            this.frametime=16;
            
            this.render(); // Start the render loop
        } catch (error) {
            console.error("Renderer initialization failed:", error);
        }
    }

    private createAssets(): void {
        const device = this.gpuManager.device;
        this.colorBuffer = device.createTexture({
            size: { width: this.canvas.width, height: this.canvas.height },
            format: "rgba8unorm",
            usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING
        });
        this.colorBufferView = this.colorBuffer.createView();

        this.sampler = device.createSampler({
            magFilter: "linear",
            minFilter: "linear",
        });
    }

    private async createPipelines(): Promise<void> {
        const device = this.gpuManager.device;

        // --- Ray Tracing Pipeline ---
        const computeLayout = device.createBindGroupLayout({
            entries: [
                { binding: 0, visibility: GPUShaderStage.COMPUTE, storageTexture: { access: "write-only", format: "rgba8unorm" } },
                { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: "uniform" } },
                { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } }, // Spheres
                { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } }, // Nodes
                { binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } }, // Triangles
                { binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } }, // Primitive Indices
                { binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } }, // Point Lights
                // **Future Addition:**
                // { binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } }, // Meshes
            ]
        });

        this.rayTracingBindGroup = device.createBindGroup({
            layout: computeLayout,
            entries: [
                { binding: 0, resource: this.colorBufferView },
                { binding: 1, resource: { buffer: this.sceneManager.sceneParameters } },
                { binding: 2, resource: { buffer: this.sceneManager.sphereBuffer } },
                { binding: 3, resource: { buffer: this.sceneManager.nodeBuffer } },
                { binding: 4, resource: { buffer: this.sceneManager.triangleBuffer } },
                { binding: 5, resource: { buffer: this.sceneManager.primitiveLookupBuffer } },
                { binding: 6, resource: { buffer: this.sceneManager.pointLightBuffer } },
                // **Future Addition:**
                // { binding: 7, resource: { buffer: this.sceneManager.meshBuffer } },
            ]
        });

        this.rayTracingPipeline = await device.createComputePipelineAsync({
            layout: device.createPipelineLayout({ bindGroupLayouts: [computeLayout] }),
            compute: {
                module: device.createShaderModule({ code: compShader }),
                entryPoint: 'main',
            },
        });

        // --- Screen Quad Pipeline ---
        const screenLayout = device.createBindGroupLayout({
            entries: [
                { binding: 0, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
                { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: {} },
            ]
        });
        
        this.screenBindGroup = device.createBindGroup({
            layout: screenLayout,
            entries: [
                { binding: 0, resource: this.sampler },
                { binding: 1, resource: this.colorBufferView },
            ]
        });

        this.screenPipeline = await device.createRenderPipelineAsync({
            layout: device.createPipelineLayout({ bindGroupLayouts: [screenLayout] }),
            vertex: {
                module: device.createShaderModule({ code: screen_shader }),
                entryPoint: 'vert_main',
            },
            fragment: {
                module: device.createShaderModule({ code: screen_shader }),
                entryPoint: 'frag_main',
                targets: [{ format: this.gpuManager.format }]
            },
            primitive: { topology: "triangle-list" }
        });
    }

private render = (): void => {
    const start: number = performance.now();

    const device = this.gpuManager.device;
    const context = this.gpuManager.context;

    // Update scene data if needed (e.g., for animation)
    // this.sceneManager.updateBuffers();
    this.sceneManager.updateBuffers(); 
    const commandEncoder = device.createCommandEncoder();

    // Ray Tracing Pass
    const computePass = commandEncoder.beginComputePass();
    computePass.setPipeline(this.rayTracingPipeline);
    computePass.setBindGroup(0, this.rayTracingBindGroup);
    computePass.dispatchWorkgroups(Math.ceil(this.canvas.width / 8), Math.ceil(this.canvas.height / 8));
    computePass.end();

    // Screen Render Pass
    const textureView = context.getCurrentTexture().createView();
    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
            view: textureView,
            clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
            loadOp: "clear",
            storeOp: "store"
        }]
    });
    renderPass.setPipeline(this.screenPipeline);
    renderPass.setBindGroup(0, this.screenBindGroup);
    renderPass.draw(6);
    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);

    // This is the corrected line
    device.queue.onSubmittedWorkDone().then(
        () => {
            const end: number = performance.now();
            this.frametime = end - start;
            this.lastFrameTimeMs = end - start; // <--- MAKE SURE YOU'RE ASSIGNING TO this.lastFrameTimeMs

            const performanceLabel = document.getElementById("render-time") as HTMLElement;
            if (performanceLabel) {
                performanceLabel.innerText = this.frametime.toFixed(2); // .toFixed() is nice for display
            }
        }
    );

    requestAnimationFrame(this.render);
}
}