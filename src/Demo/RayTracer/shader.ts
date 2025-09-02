
export const compShader = `
/**
 * The WGSL compute shader code, exported as a string constant.
 * This can be imported directly into your main application file to create a GPUShaderModule.
 */
// Struct for sphere data
struct SphereData {
    center: vec3<f32>,
    radius: f32,
    color: vec3<f32>,
    _padding: f32,
}
struct PointLight {
    position: vec3<f32>,
    intensity: f32,
    color: vec3<f32>,
    _padding: f32,
}


struct TriangleData {
    corner_a: vec3<f32>,
    _pad1: f32,
    corner_b: vec3<f32>,
    _pad2: f32,
    corner_c: vec3<f32>,
    _pad3: f32,
    color: vec3<f32>,
    _pad4: f32,
}

// Struct for the BVH nodes. leftChild and primitiveCount are now u32 for indices.
struct Node {
    minCorner: vec3<f32>,
    leftChild: u32,
    maxCorner: vec3<f32>,
    primitiveCount: u32,
}

// Scene data from the Uniform Buffer
@group(0) @binding(1) var<uniform> scene: SceneData;

struct SceneData {
    cameraPos: vec4<f32>,
    cameraForwards: vec4<f32>,
    cameraRight: vec4<f32>,
    cameraUp: vec4<f32>,
    maxBounces: f32,
    sphereCount: f32,
    triangleCount: f32,
    lightCount: f32, // Add this line

}

// Struct to hold the state of a ray-primitive intersection
struct RenderState {
    t: f32,
    color: vec3<f32>,
    hit: bool,
    position: vec3<f32>,
    normal: vec3<f32>,
}

// Struct for ray data
struct Ray {
    origin: vec3<f32>,
    direction: vec3<f32>,
}

// Bindings for the compute pipeline
@group(0) @binding(0) var color_buffer: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(2) var<storage, read> spheres: array<SphereData>;
@group(0) @binding(3) var<storage, read> tree: array<Node>;
@group(0) @binding(4) var<storage, read> triangles: array<TriangleData>;
@group(0) @binding(5) var<storage, read> primitiveLookup: array<u32>;
@group(0) @binding(6) var<storage, read> lights: array<PointLight>;

// Main compute shader entry point
@compute @workgroup_size(8,8,1)
fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
    let screen_size = vec2<f32>(textureDimensions(color_buffer));
    let screen_pos = vec2<i32>(i32(GlobalInvocationID.x), i32(GlobalInvocationID.y));

    // Anti-aliasing: Use center of the pixel
    let frag_coord = vec2<f32>(GlobalInvocationID.xy) + vec2<f32>(0.5);

    let horizontal_coefficient = -(frag_coord.x - screen_size.x / 2.0) / screen_size.x;
    let vertical_coefficient = (screen_size.y / 2.0 - frag_coord.y) / screen_size.x; // already flipped Y

    let forwards = scene.cameraForwards.xyz;
    let right = scene.cameraRight.xyz;
    let up = scene.cameraUp.xyz;

    var myRay: Ray;
    myRay.direction = normalize(forwards + horizontal_coefficient * right + vertical_coefficient * up);
    myRay.origin = scene.cameraPos.xyz;

    // Pass the pixel coordinates to rayColor:
    let pixel_color = rayColor(myRay, GlobalInvocationID.xy);
    textureStore(color_buffer, screen_pos, vec4<f32>(pixel_color, 1.0));
}

fn hash(p: u32) -> u32 {
    var x = p;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return x;
}

fn random(seed: ptr<function, u32>) -> f32 {
    *seed = hash(*seed);
    return f32(*seed) / 4294967296.0; // 2^32
}

fn randomUnitVector(seed: ptr<function, u32>) -> vec3<f32> {
    let z = random(seed) * 2.0 - 1.0; // -1 to 1
    let a = random(seed) * 6.28318530718; // 0 to 2π
    let r = sqrt(1.0 - z * z);
    return vec3<f32>(r * cos(a), r * sin(a), z);
}
fn rayColor(ray: Ray, pixelCoords: vec2<u32>) -> vec3<f32> {
    var seed = pixelCoords.x + pixelCoords.y * 1920u; // Adjust 1920u to your screen width

    var currentRay = ray;
    var finalColor = vec3<f32>(0.0);
    var throughput = vec3<f32>(0.3);
    var backgroundColor = vec3<f32>(0.0, 0.0, 0.0);

    for (var bounce: i32 = 0; bounce < i32(scene.maxBounces); bounce++) {

        var result = trace(currentRay); 

        if (!result.hit) {
            finalColor += throughput * backgroundColor;
            break;
        }
        
        let directLight = calculateDirectLighting(result);
        finalColor += throughput * directLight;

        // let reflectionDirection = normalize(result.normal + randomUnitVector(&seed));
        let reflectionDirection = reflect(currentRay.direction, result.normal);


        throughput *= result.color * vec3(0.9, 0.8, 0.3);

        currentRay.origin = result.position + result.normal * 0.001;
        currentRay.direction = reflectionDirection;

        let maxComponent = max(throughput.r, max(throughput.g, throughput.b));
        if (maxComponent < 0.01) {
            break;
        }
    }

    return finalColor;
}

fn calculateDirectLighting(renderState: RenderState) -> vec3<f32> {
    var lighting = vec3<f32>(0.0);
    
    // Ambient lighting
    lighting += renderState.color * 0.01;
    let viewDir = normalize(-renderState.position);
    
    // Point light contributions
    for (var i: u32 = 0u; i < u32(scene.lightCount); i++) {
        let light = lights[i];
        let lightDir = normalize(light.position - renderState.position);
        let distance = length(light.position - renderState.position);
        
        // Check if light is occluded (shadow ray)
        var shadowRay: Ray;
        shadowRay.origin = renderState.position + renderState.normal * 0.001;
        shadowRay.direction = lightDir;
        
        let shadowResult = trace(shadowRay);
        let lightDistance = distance;
        
        if (!shadowResult.hit || shadowResult.t > lightDistance) {
            // Not in shadow - calculate lighting
            let ndotl = max(0.0, dot(renderState.normal, lightDir));

            let halfVector = normalize(lightDir + viewDir);
            let ndotH = max(0.0, dot(renderState.normal, halfVector));
            let shininess = 0.10; // Adjust shininess factor
            let specularStrength = 0.9; // Adjust specular strength
            let specular = specularStrength * pow(ndotH, shininess);
            let attenuation = 1.0 / (1.0 + 0.1 * distance + 0.01 * distance * distance);

            let diffuseTerm=renderState.color * ndotl;
            let specularTerm = vec3<f32>(specular, specular, specular);
            lighting += (diffuseTerm + specularTerm) * light.color * light.intensity * attenuation;
            // lighting += renderState.color * light.color * light.intensity * ndotl * attenuation;
        }
    }
    
    return lighting;
}



// Traces a single ray through the BVH
fn trace(ray: Ray) -> RenderState {
    var renderState: RenderState;
    renderState.color = vec3(1.0,1.0,1.0);
    renderState.hit = false;
    var nearestHit: f32 = 99999.0;

    var stack: array<u32, 32>;
    var stackPtr: i32 = 0;
    stack[0] = 0u; // Start with root node

    while (stackPtr >= 0) {
        let nodeIdx = stack[stackPtr];
        stackPtr = stackPtr - 1;
        let node = tree[nodeIdx];

        if (hit_aabb(ray, node) >= nearestHit) {
            continue;
        }

        if (node.primitiveCount > 0u) { // Is a leaf node
            for (var i: u32 = 0u; i < node.primitiveCount; i = i + 1u) {
                var newRenderState: RenderState;
                let global_index = primitiveLookup[node.leftChild + i];

                if (global_index < u32(scene.sphereCount)) {
                    let sphere = spheres[global_index];
                    newRenderState = hit_sphere(ray, sphere, 0.001, nearestHit);
                } else {
                    let triangle_index = global_index - u32(scene.sphereCount);
                    let triangle = triangles[triangle_index];
                    newRenderState = hit_triangle(ray, triangle, 0.001, nearestHit, renderState);

                }

                if (newRenderState.hit) {
                    nearestHit = newRenderState.t;
                    renderState = newRenderState;
                }
            }
        } else { // Is an internal node
            // --- START: MODIFIED TRAVERSAL LOGIC ---
            let leftChildIdx = node.leftChild;
            let rightChildIdx = node.leftChild + 1u;

            let leftNode = tree[leftChildIdx];
            let rightNode = tree[rightChildIdx];

            let hitTLeft = hit_aabb(ray, leftNode);
            let hitTRight = hit_aabb(ray, rightNode);

            // We want to process the closer node first, which means we push
            // the farther node onto the stack first.
            if (hitTLeft < hitTRight) {
                // Left child is closer. Push Right, then Left.
                if (hitTRight < nearestHit) {
                    stackPtr = stackPtr + 1;
                    stack[stackPtr] = rightChildIdx;
                }
                if (hitTLeft < nearestHit) {
                    stackPtr = stackPtr + 1;
                    stack[stackPtr] = leftChildIdx;
                }
            } else {
                // Right child is closer. Push Left, then Right.
                if (hitTLeft < nearestHit) {
                    stackPtr = stackPtr + 1;
                    stack[stackPtr] = leftChildIdx;
                }
                if (hitTRight < nearestHit) {
                    stackPtr = stackPtr + 1;
                    stack[stackPtr] = rightChildIdx;
                }
            }
        }
    }

  
    return renderState;
}

// Checks for intersection with a triangle
fn hit_triangle(ray: Ray, tri: TriangleData, tMin: f32, tMax: f32, oldRenderState: RenderState) -> RenderState {
    
    //Set up a blank renderstate,
    //right now this hasn't hit anything
    var renderState: RenderState;
    renderState.color = oldRenderState.color;
    renderState.hit = false;

    //Direction vectors
    let edge_ab: vec3<f32> = tri.corner_b - tri.corner_a;
    let edge_ac: vec3<f32> = tri.corner_c - tri.corner_a;
    //Normal of the triangle
    var n: vec3<f32> = normalize(cross(edge_ab, edge_ac));
    var ray_dot_tri: f32 = dot(ray.direction, n);
    //backface reversal
    if (ray_dot_tri > 0.0) {
        ray_dot_tri = ray_dot_tri * -1;
        n = n * -1;
    }
    //early exit, ray parallel with triangle surface
    if (abs(ray_dot_tri) < 0.00001) {
        return renderState;
    }

    var system_matrix: mat3x3<f32> = mat3x3<f32>(
        ray.direction,
        tri.corner_a - tri.corner_b,
        tri.corner_a - tri.corner_c
    );
    let denominator: f32 = determinant(system_matrix);
    if (abs(denominator) < 0.00001) {
        return renderState;
    }

    system_matrix = mat3x3<f32>(
        ray.direction,
        tri.corner_a - ray.origin,
        tri.corner_a - tri.corner_c
    );
    let u: f32 = determinant(system_matrix) / denominator;
    
    if (u < 0.0 || u > 1.0) {
        return renderState;
    }

    system_matrix = mat3x3<f32>(
        ray.direction,
        tri.corner_a - tri.corner_b,
        tri.corner_a - ray.origin,
    );
    let v: f32 = determinant(system_matrix) / denominator;
    if (v < 0.0 || u + v > 1.0) {
        return renderState;
    }

    system_matrix = mat3x3<f32>(
        tri.corner_a - ray.origin,
        tri.corner_a - tri.corner_b,
        tri.corner_a - tri.corner_c
    );
    let t: f32 = determinant(system_matrix) / denominator;

    if (t > tMin && t < tMax) {

        renderState.position = ray.origin + t * ray.direction;
        renderState.normal = n;
        renderState.color = tri.color;
        renderState.t = t;
        renderState.hit = true;
        return renderState;
    }

    return renderState;
}


// Checks for intersection with a sphere
fn hit_sphere(ray: Ray, primitive: SphereData, tMin: f32, tMax: f32) -> RenderState {
    let co = ray.origin - primitive.center;
    let a = dot(ray.direction, ray.direction);
    let b = 2.0 * dot(ray.direction, co);
    let c = dot(co, co) - primitive.radius * primitive.radius;
    let discriminant = b * b - 4.0 * a * c;
    
    var renderState: RenderState;
    renderState.hit = false;

    if (discriminant >= 0.0) {
        let sqrt_d = sqrt(discriminant);
        var t = (-b - sqrt_d) / (2.0 * a);
        if (t < tMin) {
            t = (-b + sqrt_d) / (2.0 * a);
        }

        if (t > tMin && t < tMax) {
            renderState.position = ray.origin + t * ray.direction;
            renderState.normal = normalize(renderState.position - primitive.center);
            renderState.t = t;
            renderState.color = primitive.color;
            renderState.hit = true;
            return renderState;
        }
    }
    return renderState;
}

// Checks for intersection with an axis-aligned bounding box (AABB)
fn hit_aabb(ray: Ray, node: Node) -> f32 {
    let inverseDir = 1.0 / ray.direction;
    let t1 = (node.minCorner - ray.origin) * inverseDir;
    let t2 = (node.maxCorner - ray.origin) * inverseDir;
    let tMinVec = min(t1, t2);
    let tMaxVec = max(t1, t2);
    let t_min = max(tMinVec.x, max(tMinVec.y, tMinVec.z));
    let t_max = min(tMaxVec.x, min(tMaxVec.y, tMaxVec.z));
    if (t_min > t_max || t_max < 0.0) {
        return 99999.0;
    }
    return t_min;
}


`;