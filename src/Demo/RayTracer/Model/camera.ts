import { vec3 } from "gl-matrix";

export class Camera {
    position: vec3;
    target: vec3;
    theta: number; // yaw around Y axis
    phi: number;   // pitch around X axis
    radius: number;

    forwards: vec3;
    right: vec3;
    up: vec3;

    constructor(position: [number, number, number], target: [number, number, number]) {
        this.position = vec3.fromValues(...position);
        this.target = vec3.fromValues(...target);

        // Offset vector from target to position
        const offset = vec3.create();
        vec3.subtract(offset, this.position, this.target);
        this.radius = vec3.length(offset);

        // Horizontal distance in XZ plane
        const horizontalDist = Math.sqrt(offset[0] ** 2 + offset[2] ** 2);

        // Yaw: angle in XZ plane
        this.theta = Math.atan2(offset[0], offset[2]);

        // Pitch: angle from XZ plane toward Y
        this.phi = Math.atan2(offset[1], horizontalDist);

        this.forwards = vec3.create();
        this.right = vec3.create();
        this.up = vec3.create();

        this.recalculate_vectors();
    }

    recalculate_vectors() {
        const cosPhi = Math.cos(this.phi);
        const sinPhi = Math.sin(this.phi);
        const cosTheta = Math.cos(this.theta);
        const sinTheta = Math.sin(this.theta);

        // Position in Y-up coordinates
        this.position[0] = this.target[0] + this.radius * cosPhi * sinTheta; // X
        this.position[1] = this.target[1] + this.radius * sinPhi;            // Y (up)
        this.position[2] = this.target[2] + this.radius * cosPhi * cosTheta; // Z (depth)

        // Forward vector
        vec3.subtract(this.forwards, this.target, this.position);
        vec3.normalize(this.forwards, this.forwards);

        // Right vector (perpendicular to forward, Y-up)
        vec3.cross(this.right, this.forwards, [0, 1, 0]);
        vec3.normalize(this.right, this.right);

        // Up vector
        vec3.cross(this.up, this.right, this.forwards);
        vec3.normalize(this.up, this.up);
    }

handleMouseMovement(deltaX: number, deltaY: number) {
    const sensitivity = 0.005;
    
    // Rotate around Y axis (yaw)
    this.theta += deltaX * sensitivity;

    // Rotate around X axis (pitch) with restriction
    this.phi -= deltaY * sensitivity;
    
    // Clamp pitch to prevent flipping
    const maxPitch = Math.PI / 4;   // 45 degrees
    const minPitch = -Math.PI / 4;  // -45 degrees
    this.phi = Math.max(minPitch, Math.min(maxPitch, this.phi));

    // Optional: keep theta in [0, 2π]
    this.theta = this.theta % (2 * Math.PI);
    if (this.theta < 0) this.theta += 2 * Math.PI;

    this.recalculate_vectors();
}

}
