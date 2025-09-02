// gpuManager.ts

export class GpuManager {
    adapter!: GPUAdapter;
    device!: GPUDevice;
    context!: GPUCanvasContext;
    format!: GPUTextureFormat;

    constructor(private canvas: HTMLCanvasElement) {}

    async initialize(): Promise<void> {
        // Request adapter
        const adapter = await navigator.gpu?.requestAdapter();
        if (!adapter) {
            throw new Error("WebGPU not supported: Failed to get GPU adapter.");
        }
        this.adapter = adapter;

        // Request device
        const device = await this.adapter.requestDevice();
        if (!device) {
            throw new Error("WebGPU not supported: Failed to get GPU device.");
        }
        this.device = device;

        // Get WebGPU context
        const context = this.canvas.getContext("webgpu");
        if (!context) {
            throw new Error("Failed to get WebGPU context.");
        }
        this.context = context;

        // Get preferred format
        this.format = navigator.gpu.getPreferredCanvasFormat();

        // Configure canvas
        this.context.configure({
            device: this.device,
            format: this.format,
            alphaMode: "opaque",
        });
    }
}
