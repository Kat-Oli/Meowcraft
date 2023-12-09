import * as block from "./block.js";
import { Chunk, chunkSize } from "./chunk.js";
import { cNoise } from "./util.js";

/**
 * An array of functions to generate the world.
 * @type {((ch: Chunk)=>block.Block[])[]}
 */
let wgenLayers = [];

wgenLayers.push(chunk=>{
    let res = chunk.blockData.slice();
    res.fill(new block.AirBlock());
    for (let x = 0; x < chunkSize; x++)
    for (let z = 0; z < chunkSize; z++) {
        let h = 
            cNoise(chunk, x, z, 5, 5) +
            cNoise(chunk, x, z, 15, 12);
        for (let y = 0; y < chunkSize; y++) {
            let i = Chunk.indexOfBlock(x,y,z);
            if (h >= y) {
                if (h < y + 1)
                    res[i] = new block.GrassBlock();
                else if (h < y + 5)
                    res[i] = new block.DirtBlock();
                else
                    res[i] = new block.StoneBlock();
            }
        }
    }
    return res;
})

export {
    wgenLayers
}