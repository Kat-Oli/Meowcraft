import { Block } from "./block.js";
import { chunkSize } from "./chunk.js";
import { camera } from "./display.js";
import { Vector3 } from "./lib/three.js";
import { World } from "./world.js";

/**
 * Represents a player.
 */
class Player {
    constructor() {
        this.position = new Vector3(0,18,0);
        this.speed = new Vector3(0,0,0);
        this.dt = 0;
        this.keys = [];
        this.setup();
    }
    tick(dt) {
        this.dt = dt;
        camera.position.set(...this.position);
        this.position.add(
            new Vector3(
                this.speed.x * dt,
                this.speed.y * dt,
                this.speed.z * dt
            )
        );
        /**
         * The block below the player.
         * @type {Block}
         */
        if ([
            [-0.5,-0.5],
            [-0.5,0],
            [-0.5,0.5],
            [0,-0.5],
            [0,0],
            [0,0.5],
            [0.5,-0.5],
            [0.5,0],
            [0.5,0.5]
        ].map(val=>{
            const fx = Math.floor(this.position.x + val[0]);
            const fz = Math.floor(this.position.z + val[1]);
            const fy = Math.floor(this.position - 1.5);
            const b = World.inst.getGlobalBlock(fx, fy, fz);
            return b.isAir;
        }).includes(false)) {
            this.speed.y = 0;
            this.position.y += 1;
        }
        else
            this.speed.y -= 0.1;
        if (this.keys.includes("w")) {
            camera.translateZ(-this.dt*5);
            this.position = camera.position;
        }
        if (this.keys.includes("a")) {
            camera.translateX(-this.dt*5);
            this.position = camera.position;
        }
        if (this.keys.includes("s")) {
            camera.translateZ(this.dt*5);
            this.position = camera.position;
        }
        if (this.keys.includes("d")) {
            camera.translateX(this.dt*5);
            this.position = camera.position;
        }
    }
    /**
     * Setup player controls.
     */
    setup() {
        addEventListener("keydown",ev=>{
            if (ev.key == " ") {
                const floorPos = this.floorPosition;
                const down = World.inst.getGlobalBlock(
                    floorPos.x,
                    Math.floor(floorPos.y - 1.501),
                    floorPos.z
                );
                if (!down.isAir)
                this.speed.y = 5;
            }
            if (!this.keys.includes(ev.key))
            this.keys.push(ev.key)
        })
        addEventListener("keyup",ev=>{
            if (this.keys.includes(ev.key))
            this.keys.pop(this.keys.indexOf(ev.key)) 
        })
    }
    /**
     * The position rounded down on each axis.
     * @type {Vector3}
     */
    get floorPosition() {
        return new Vector3(
            Math.floor(this.position.x),
            Math.floor(this.position.y),
            Math.floor(this.position.z)
        );
    }
}

export {Player}