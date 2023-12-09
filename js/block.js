/**
 * Represents a block.
 */
class Block {
    constructor() {}
    get top() {
        return 1;
    }
    get side() {
        return 1;
    }
    get bottom() {
        return 1;
    }
    get isAir() {
        return false;
    }
}

class GrassBlock extends Block {
    get top() {
        return 0;
    }
    get side() {
        return 1;
    }
    get bottom() {
        return 2;
    }
}

class StoneBlock extends Block {
    get top() {
        return 3;
    }
    get side() {
        return 3;
    }
    get bottom() {
        return 3;
    }
}

class DirtBlock extends Block {
    get top() {
        return 2;
    }
    get side() {
        return 2;
    }
    get bottom() {
        return 2;
    }
}

class AirBlock extends Block {
    get isAir() {
        return true;
    }
}

export { Block, AirBlock, DirtBlock, GrassBlock, StoneBlock }