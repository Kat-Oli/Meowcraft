import { AirBlock, Block } from "./block.js";
import { Chunk, chunkSize } from "./chunk.js";
import {modMod} from "./util.js";

/**
 * Represents a bunch of chunks.
 */
class World {
    /**
     * @type {World}
     * The world.
     */
    static inst;

    constructor() {
        /**
         * An object of all the chunks.
         * @type {Object<string,Chunk>}
         */
        this.chunks = {};
        /**
         * The render distance.
         * @type {number}
         */
        this.renderDistance = 3;
        World.inst = this;
    }

    tick(ox,oy,oz) {
        let chunksLeft = 3;
        for (let x = -this.renderDistance; x < this.renderDistance; x++)
        for (let y = -this.renderDistance; y < this.renderDistance; y++)
        for (let z = -this.renderDistance; z < this.renderDistance; z++) {
            if (!Object.keys(this.chunks).includes(this.nameChunk(x+ox,y+oy,z+oz))) {
                if (chunksLeft > 0) {
                    chunksLeft--;
                    this.chunks[this.nameChunk(x+ox,y+oy,z+oz)] = new Chunk(
                        x+ox,y+oy,z+oz
                    );
                    this.chunks[this.nameChunk(x+ox,y+oy,z+oz)].setup();
                }
            }
        }
    }

    /**
     * Name the chunk.
     * @param {number} x The x position in chunks.
     * @param {number} y The y position in chunks.
     * @param {number} z The z position in chunks.
     * @returns {string} The name.
     */
    nameChunk(x,y,z) {
        return `(${x},${y},${z})`
    }

    /**
     * Get the block at a global position.
     * @param {number} x The global x position in blocks.
     * @param {number} y The global y position in blocks.
     * @param {number} z The global z position in blocks.
     * @returns {Block} The block or air.
     */
    getGlobalBlock(x, y, z) {
        const chunkX = Math.floor(x / chunkSize);
        const chunkY = Math.floor(y / chunkSize);
        const chunkZ = Math.floor(z / chunkSize);
        const blockX = modMod(x, chunkSize);
        const blockY = modMod(y, chunkSize);
        const blockZ = modMod(z, chunkSize);
        const chunk = this.chunks[this.nameChunk(chunkX, chunkY, chunkZ)];
        if (chunk != undefined) {
            const result = chunk.blockData[Chunk.indexOfBlock(
                blockX,
                blockY,
                blockZ
            )];
            if (result != undefined)
                return result;
        }
        return new AirBlock();
    }
}

export { World }