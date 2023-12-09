import { chunkSize } from "./chunk.js";
import { World } from "./world.js";
import { camera, renderer, scene } from "./display.js";
import { Player } from "./player.js";

const player = new Player();

/**
 * The world.
 * @type {World}
 */
const world = new World();

/**
 * Load and setup everything.
 */
async function start() {
    document.body.appendChild(renderer.domElement);
}

let od = Date.now()

/**
 * Run every frame to simulate etc.
 */
async function tick() {
    let dt = (Date.now() - od) / 1000;
    od = Date.now();
    player.tick(dt);
    world.tick(
        Math.floor(player.position.x / chunkSize),
        Math.floor(player.position.y / chunkSize),
        Math.floor(player.position.z / chunkSize)
    );
    await draw();
    await new Promise(resolve=>setTimeout(resolve,10));
}

/**
 * Run every frame to draw things.
 */
async function draw() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}

/**
 * Run everything in the app.
 */
async function run() {
    await start();
    while (true) {
        await tick();
    }
}

export { run }