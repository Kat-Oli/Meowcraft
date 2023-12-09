import * as three from "./lib/three.js";

/**
 * The threejs scene.
 * @type {three.Scene}
 */
const scene = new three.Scene();

/**
 * The threejs renderer.
 * @type {three.WebGLRenderer}
 */
const renderer = new three.WebGLRenderer({antialias: true});

/**
 * The threejs camera.
 * @type {three.PerspectiveCamera}
 */
const camera = new three.PerspectiveCamera(70, 1, 0.1, 500);

export {scene, renderer, camera};