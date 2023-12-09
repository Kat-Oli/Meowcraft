import { Block, AirBlock } from "./block.js";
import { scene } from "./display.js";
import * as three from "./lib/three.js";
import { loadTexture, noise } from "./util.js";
import { wgenLayers } from "./wgen.js";

/**
 * The number of textures in the atlas.
 * @type {number}
 */
const chunkTextureAtlasSize = 4;

/**
 * The texture atlas for the chunks
 */
const chunkTextureAtlas = loadTexture("./img/chunk.png");
chunkTextureAtlas.magFilter = three.NearestFilter;
chunkTextureAtlas.minFilter = three.NearestFilter;

/**
 * The threejs material for all chunks.
 * @type {three.Material}
 */
const chunkMaterial = new three.MeshBasicMaterial({
    map: chunkTextureAtlas,
    side: three.DoubleSide
});

/**
 * The length of each axes for all chunks.
 * @type {number}
 */
const chunkSize = 16;

/**
 * Represents a chunk in the game world.
 */
class Chunk {
    /**
     * @param {number} x The x position of the chunk.
     * @param {number} y The y position of the chunk.
     * @param {number} z The z position of the chunk.
     */
    constructor(x, y, z) {
        /**
         * The x position of the chunk.
         * @type {number}
         * @readonly
         */
        this.x = x;

        /**
         * The y position of the chunk.
         * @type {number}
         * @readonly
         */
        this.y = y;

        /**
         * The z position of the chunk.
         * @type {number}
         * @readonly
         */
        this.z = z;

        /**
         * The threejs mesh of the chunk.
         * @type {three.Mesh}
         */
        this.mesh = new three.Mesh(
            new three.BufferGeometry(),
            chunkMaterial
        );
        this.mesh.position.set(
            this.x * chunkSize,
            this.y * chunkSize,
            this.z * chunkSize
        )
        this.mesh.frustumCulled = false;
        scene.add(this.mesh);

        /**
         * The block data of the chunk.
         * @type {Block[]}
         */
        this.blockData = new Array(chunkSize**3);
        this.blockData.fill(new AirBlock());
    }

    /**
     * The geometry of the chunk's mesh.
     * @type {three.BufferGeometry}
     */
    get geometry() {
        return this.mesh.geometry;
    }

    /**
     * Build the geometry of the chunk.
     */
    async build() {
        /**
         * The result attributes in an array of objects.
         * @type {{position: number[], uv: number[]}[]}
         */
        let result = [];

        /**
         * The first x position.
         * @type {number}
         */
        let x;

        /**
         * The first y position.
         * @type {number}
         */
        let y;

        /**
         * The first z position.
         * @type {number}
         */
        let z;
        
        for (x = 0; x < chunkSize; x++)
        for (y = 0; y < chunkSize; y++)
        for (z = 0; z < chunkSize; z++) {
            let ti = this.blockData[
                Chunk.indexOfBlock(x,y,z)
            ].side;
            let ti_top = this.blockData[
                Chunk.indexOfBlock(x,y,z)
            ].top;
            let ti_bottom = this.blockData[
                Chunk.indexOfBlock(x,y,z)
            ].bottom;
            // Up
            result.push(
                this.getFaceDataIfNeeded(x,y,z,x,y+1,z,[
                    0, 1, 0,
                    1, 1, 0,
                    1, 1, 1,
                    1, 1, 1,
                    0, 1, 1,
                    0, 1, 0
                ], [
                    0, 0,
                    1, 0,
                    1, 1,
                    1, 1,
                    0, 1,
                    0, 0
                ], ti_top)
            )
            // Down
            result.push(
                this.getFaceDataIfNeeded(x,y,z,x,y-1,z,[
                    0, 0, 0,
                    1, 0, 0,
                    1, 0, 1,
                    1, 0, 1,
                    0, 0, 1,
                    0, 0, 0
                ], [
                    0, 0,
                    1, 0,
                    1, 1,
                    1, 1,
                    0, 1,
                    0, 0
                ], ti_bottom)
            );
            // X+
            result.push(
                this.getFaceDataIfNeeded(x,y,z,x+1,y,z,[
                    1, 0, 0,
                    1, 1, 0,
                    1, 1, 1,
                    1, 1, 1,
                    1, 0, 1,
                    1, 0, 0
                ], [
                    1, 0,
                    1, 1,
                    0, 1,
                    0, 1,
                    0, 0,
                    1, 0
                ], ti)
            );
            // X-
            result.push(
                this.getFaceDataIfNeeded(x,y,z,x-1,y,z,[
                    0, 0, 0,
                    0, 1, 0,
                    0, 1, 1,
                    0, 1, 1,
                    0, 0, 1,
                    0, 0, 0
                ], [
                    1, 0,
                    1, 1,
                    0, 1,
                    0, 1,
                    0, 0,
                    1, 0
                ], ti)
            );
            // Z-
            result.push(
                this.getFaceDataIfNeeded(x,y,z,x,y,z-1,[
                    0, 0, 0,
                    1, 0, 0,
                    1, 1, 0,
                    1, 1, 0,
                    0, 1, 0,
                    0, 0, 0
                ], [
                    0, 0,
                    1, 0,
                    1, 1,
                    1, 1,
                    0, 1,
                    0, 0
                ], ti)
            );
            // Z+
            result.push(
                this.getFaceDataIfNeeded(x,y,z,x,y,z+1,[
                    0, 0, 1,
                    1, 0, 1,
                    1, 1, 1,
                    1, 1, 1,
                    0, 1, 1,
                    0, 0, 1
                ], [
                    0, 0,
                    1, 0,
                    1, 1,
                    1, 1,
                    0, 1,
                    0, 0
                ], ti)
            );
        }

        /**
         * The result attributes.
         * @type {{position: number[],uv: number[]}}
         */
        let resultAttr = {
            position: [],
            uv: []
        };

        result.forEach(element=>{
            resultAttr.position.push(...element.position);
            resultAttr.uv.push(...element.uv);
        })

        this.geometry.setAttribute(
            "position",
            new three.BufferAttribute(
                new Float32Array(resultAttr.position),
                3
            )
        )
        this.geometry.attributes.position.needsUpdate = true;

        this.geometry.setAttribute(
            "uv",
            new three.BufferAttribute(
                new Float32Array(resultAttr.uv),
                2
            )
        )
        this.geometry.attributes.uv.needsUpdate = true;
    }

    /**
     * Generate the data of the chunk.
     */
    async generate() {
        let _this = this;
        wgenLayers.forEach(fn=>{
            _this.blockData = fn(_this);
        });
    }
    
    /**
     * Setup the chunk.
     */
    async setup() {
        await this.generate();
        await this.build();
    }

    /**
     * Returns vertex data to add if needed, otherwise each attribute is returned empty.
     * @param {number} x1 The x position of the first block.
     * @param {number} y1 The y position of the first block.
     * @param {number} z1 The z position of the first block.
     * @param {number} x2 The x position of the second block.
     * @param {number} y2 The y position of the second block.
     * @param {number} z2 The z position of the second block.
     * @param {number[]} positionData The array of position data to add if needed.
     * @param {number[]} uvData The array of position data to add if needed.
     * @param {number} textureId The id of the texture.
     * @returns {{position: number[],uv: number[]}}
     * @private
     */
    getFaceDataIfNeeded(x1, y1, z1, x2, y2, z2, positionData, uvData, textureId) {
        /**
         * Map the position data with the offsets.
         * @param {number} value The value.
         * @param {number} index The index.
         * @returns {number}
         */
        function vertexMapPosition(value, index) {
            return [x1, y1, z1][index % 3] + value;
        }

        /**
         * Map the uv data with the offsets.
         * @param {number} value The value.
         * @param {number} index The index.
         */
        function vertexMapUv(value, index) {
            if (index % 2 == 0) {
                const xSize = 1 / chunkTextureAtlasSize;
                const xOffset = xSize * textureId;
                return value * xSize + xOffset;
            }
            return value;
        }

        /**
         * The result position.
         * @type {number[]}
         */
        let resultPosition = [];

        /**
         * The result uv.
         * @type {number[]}
         */
        let resultUv = [];

        /** 
         * The first index.
         * @type {number}
         */
        const i1 = Chunk.indexOfBlock(x1, y1, z1);

        /**
         * The second index.
         * @type {number}
         */
        const i2 = Chunk.indexOfBlock(x2, y2, z2);

        if (Chunk.isBlockInBounds(x2,y2,z2)) {
            if (!Chunk.isBlockTransparent(this.blockData[i1])) {
                if (Chunk.isBlockTransparent(this.blockData[i2])) {
                    resultPosition = positionData;
                    resultUv = uvData;
                }
            }
        }
        else {
            if (!Chunk.isBlockTransparent(this.blockData[i1])) {
                resultPosition = positionData;
                resultUv = uvData;
            }
        }
        return {
            position: resultPosition.map(vertexMapPosition),
            uv: resultUv.map(vertexMapUv)
        }
    }

    /**
     * Get the index of a block with local position.
     * @param {number} x The local x position.
     * @param {number} y The local y position.
     * @param {number} z The local z position.
     * @returns {number} The index of the block.
     */
    static indexOfBlock(x, y, z) {
        return x + y * chunkSize + z * chunkSize * chunkSize;
    }

    /**
     * Get if a block position is in bounds.
     * @returns {boolean} If it is in bounds.
     */
    static isBlockInBounds(x,y,z) {
        return (
            (x >= 0) &&
            (y >= 0) &&
            (z >= 0) &&
            (x < chunkSize) &&
            (y < chunkSize) &&
            (z < chunkSize)
        );
    }

    /**
     * Get if a block needs to be seen through this block.
     * @param {number} block The block value.
     * @returns {boolean} If the block should be see-through.
     */
    static isBlockTransparent(block) {
        return block.isAir;
    }
}

export { Chunk, chunkMaterial, chunkSize }