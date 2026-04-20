// ===== SCENE =====
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 20, 0);

// ===== LIGHT =====
const sun = new THREE.DirectionalLight(0xffffff, 1);
scene.add(sun);
scene.background = new THREE.Color(0x87ceeb);

// ===== CONTROLS =====
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

let yaw = 0, pitch = 0;

document.body.onclick = () => document.body.requestPointerLock();

document.addEventListener("mousemove", e => {
    if (document.pointerLockElement) {
        yaw -= e.movementX * 0.002;
        pitch -= e.movementY * 0.002;
        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
    }
});

// ===== PERLIN NOISE =====
const perm = new Uint8Array(512);
for (let i = 0; i < 256; i++) perm[i] = i;
perm.sort(() => Math.random() - 0.5);
for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];

function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a, b, t) { return a + t * (b - a); }
function grad(h, x, z) { return (h & 1) ? x : -x + (h & 2) ? z : -z; }

function perlin(x, z) {
    let X = Math.floor(x) & 255;
    let Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    z -= Math.floor(z);

    let u = fade(x);
    let v = fade(z);

    let A = perm[X] + Z;
    let B = perm[X + 1] + Z;

    return lerp(
        lerp(grad(perm[A], x, z), grad(perm[B], x - 1, z), u),
        lerp(grad(perm[A + 1], x, z - 1), grad(perm[B + 1], x - 1, z - 1), u),
        v
    );
}

// ===== WORLD =====
const CHUNK_SIZE = 16;
const HEIGHT = 16;
const RENDER_DISTANCE = 2;
const WATER_LEVEL = 4;

let chunks = {};

function chunkKey(cx, cz) { return cx + "," + cz; }

function getHeight(x, z) {
    return Math.floor((perlin(x * 0.05, z * 0.05) + 1) * 6);
}

function generateChunk(cx, cz) {
    const key = chunkKey(cx, cz);
    if (chunks[key]) return;

    const group = new THREE.Group();

    for (let x = 0; x < CHUNK_SIZE; x++) {
        for (let z = 0; z < CHUNK_SIZE; z++) {

            let wx = cx * CHUNK_SIZE + x;
            let wz = cz * CHUNK_SIZE + z;
            let h = getHeight(wx, wz);

            for (let y = 0; y < HEIGHT; y++) {
                let solid = y < h;

                // caves
                if (perlin(wx * 0.1 + y * 0.1, wz * 0.1) > 0.3) solid = false;

                if (!solid && y < WATER_LEVEL) {
                    let water = new THREE.Mesh(
                        new THREE.BoxGeometry(),
                        new THREE.MeshLambertMaterial({ color: 0x3399ff, transparent: true, opacity: 0.6 })
                    );
                    water.position.set(wx, y, wz);
                    group.add(water);
                    continue;
                }

                if (solid) {
                    let color = 0x888888;
                    if (y === h - 1) color = 0x55aa55;
                    if (y < h - 2) color = 0x777777;

                    let cube = new THREE.Mesh(
                        new THREE.BoxGeometry(),
                        new THREE.MeshLambertMaterial({ color })
                    );

                    cube.position.set(wx, y, wz);
                    group.add(cube);
                }
            }
        }
    }

    scene.add(group);
    chunks[key] = group;
}

// ===== CHUNK LOADING =====
function updateChunks() {
    let cx = Math.floor(camera.position.x / CHUNK_SIZE);
    let cz = Math.floor(camera.position.z / CHUNK_SIZE);

    for (let x = -RENDER_DISTANCE; x <= RENDER_DISTANCE; x++) {
        for (let z = -RENDER_DISTANCE; z <= RENDER_DISTANCE; z++) {
            generateChunk(cx + x, cz + z);
        }
    }

    for (let key in chunks) {
        let [x, z] = key.split(",").map(Number);
        if (Math.abs(x - cx) > RENDER_DISTANCE || Math.abs(z - cz) > RENDER_DISTANCE) {
            scene.remove(chunks[key]);
            delete chunks[key];
        }
    }
}

// ===== PHYSICS =====
let velocity = 0;
let grounded = false;

document.addEventListener("keydown", e => {
    if (e.code === "Space" && grounded) {
        velocity = 0.3;
        grounded = false;
    }
});

// ===== UPDATE =====
let time = 0;

function update() {
    const speed = 0.1;

    const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    const right = new THREE.Vector3(forward.z, 0, -forward.x);

    if (keys["w"]) camera.position.add(forward.clone().multiplyScalar(speed));
    if (keys["s"]) camera.position.add(forward.clone().multiplyScalar(-speed));
    if (keys["a"]) camera.position.add(right.clone().multiplyScalar(-speed));
    if (keys["d"]) camera.position.add(right.clone().multiplyScalar(speed));

    // gravity
    velocity -= 0.01;
    camera.position.y += velocity;

    if (camera.position.y < 3) {
        camera.position.y = 3;
        velocity = 0;
        grounded = true;
    }

    // day/night
    time += 0.002;
    sun.position.set(Math.sin(time) * 50, Math.cos(time) * 50, 0);
    sun.intensity = Math.max(0.2, Math.cos(time));

    camera.rotation.set(pitch, yaw, 0);

    updateChunks();
}

// ===== LOOP =====
function animate() {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}
animate();