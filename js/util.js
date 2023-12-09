import { Chunk, chunkSize } from "./chunk.js";
import * as three from "./lib/three.js";

const textureLoader = new three.TextureLoader();
const generatedNoise = {};

/**
 * Loads a texture.
 * @param {string} url The url to load.
 * @returns {three.Texture}
 */
function loadTexture(url) {
    return textureLoader.load(url);
}

/**
 * A modified mod functions for negative values.
 * @param {number} x The number.
 * @param {number} y The other number.
 * @returns {number} The result.
 */
function modMod(x, y) {
    if (x >= 0) return x % y;
    else return y - Math.abs(x) % y;
}

/**
 * Determanistic noise.
 * @param {number} x The seed.
 * @returns {number}
 */
function noiseHelper(x) {
    if (generatedNoise[x] == undefined) {
        generatedNoise[x] = Math.random();
    }
    return generatedNoise[x];
}

/**
 * A lerp function.
 * @param {number} x The first number.
 * @param {number} y The second number.
 * @param {number} z The distance from x. 0 to 1.
 */
function lerp(x,y,z) {
    return (x*z) + (y*(1-z));
}

/**
 * Generate noise for x and z.
 * @param {number} x The x.
 * @param {number} z The z.
 * @returns {number}
 */
function noise(x, z) {
    let r = [x,z].map(v=>{
        let a = noiseHelper(Math.floor(v));
        let b = noiseHelper(Math.floor(v+1));
        let c = Math.abs(v-Math.floor(v));
        return lerp(a,b,1-c);
    })
    return (r[0] + r[1]) / 2;
}

/**
 * Generate noise for a chunk.
 * @param {Chunk} chunk The chunk.
 * @param {number} x The x position in the chunk.
 * @param {number} z The y position in the chunk.
 * @param {number} mag The bump magnatude.
 * @param {number} scale The xz size.
 */
function cNoise(chunk, x, z, mag, scale) {
    return noise(
        (chunk.x * chunkSize + x) / scale,
        (chunk.z * chunkSize + z) / scale
    ) * mag - chunk.y * chunkSize;
}

export { loadTexture, noise, cNoise, modMod }