const canvas = document.querySelector('.game-panel');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;

const debug = {
    jumperWidth: 20,
    jumperHeight: 30,
    g: 100,
    tileWidth: 50,
    tileHeight: 10,
    tileGap: 100,
    firstTileY: canvas.height - 40,
    userDx: 10,       
}

const tiles = [];

let frame = 0;
let previousTime;

const gameloop = () => {
    frame++;
    clearCanvas(ctx);
    if(!previousTime) previousTime = Date.now();
    currentTime = Date.now();
    let elapsedTimeMillis = (currentTime - previousTime);
    let dt = elapsedTimeMillis/1000;
    previousTime = currentTime;
 
    handleKeyPresses();
    addTiles();

    tiles.forEach(tile => {
        tile.draw(ctx);
    })

    jumper.update(dt);
    jumper.draw(ctx);

    requestAnimationFrame(gameloop);
}

class Jumper {

    constructor(x, y, width, height, dx, dy, fill) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = dx;
        this.dy = dy;
        this.fill = fill;
    }

    update(dt) {
        this.x += this.dx;
        this.y += this.dy*dt;

        this.dy += debug.g*dt;

        let y = this.futureY(dt);
        for(let i = 0; i < tiles.length; i++) {
            let tile = tiles[i];
            let tileCeiling = tile.y;
            let tileFloor = tile.y + tile.height;
            if(y > tileCeiling) this.dy = -this.dy;
        }
    }

    futureY(dt) {
        return this.y + this.dy*dt;
    }

    draw(context) {
        context.fillStyle = this.fill;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Tile {

    constructor(x, y, width, height, fill) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fill = fill;
    }

    static builder() {
        return new TileBuilder();
    }

    static factory() { return tileFactory; }

    draw(context) {
        ctx.fillSyle = this.fill;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class TileBuilder {

    x(tileX) { this.tileX = tileX; return this }
    y(tileY) { this.tileY = tileY; return this }
    width(tileWidth) { this.tileWidth = tileWidth; return this; }
    height(tileHeight) { this.tileHeight = tileHeight; return this; }
    fill(tileFill) { this.tileFill = tileFill; return this; }

    build() { return new Tile(this.tileX, this.tileY, this.tileWidth, this.tileHeight, this.tileFill); }
}


class TileFactory {
    
    first() {
        return Tile.builder()
                    .x(10)
                    .y(debug.firstTileY)
                    .width(debug.tileWidth)
                    .height(debug.tileHeight)
                    .fill('black')
                    .build();
    }
    next() {
        return Tile.builder()
                    .x(randomInteger(0, canvas.width - debug.tileWidth))
                    .y(this.abovePrev())
                    .width(debug.tileWidth)
                    .height(debug.tileHeight)
                    .fill('black')
                    .build();
    }
    abovePrev() {
        let lastTile = tiles[tiles.length - 1];
        return lastTile ? lastTile.y -= debug.tileGap : debug.firstTileY;
    }
}
const tileFactory = new TileFactory();

class Collectible {

}

const userInput = {
    ArrowLeft: false,
    ArrowRight: false,
}

window.onkeydown = (e) => {
    if(e.key === 'ArrowLeft') userInput.ArrowLeft = true;
    if(e.key === 'ArrowRight') userInput.ArrowRight = true;
}

window.onkeyup = (e) => {
    if(e.key === 'ArrowLeft') userInput.ArrowLeft = false;
    if(e.key === 'ArrowRight') userInput.ArrowRight = false;
}

const handleKeyPresses = () => {
    if(userInput.ArrowLeft) {
        jumper.x -= debug.userDx;
    }
    if(userInput.ArrowLeft) {
        jumper.x += debug.userDx;
    }
}

const clearCanvas = (context) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

const jumper = new Jumper(
    canvas.width/2 - debug.jumperWidth/2,
    canvas.height/2 - debug.jumperHeight/2,
    debug.jumperWidth,
    debug.jumperHeight,
    0,
    0,
    'black'
    );


const addTiles = () => {
    if(tiles.length == 0) tiles.push(Tile.factory().first());

    let lastTile = tiles[tiles.length - 1];
    while(lastTile.y > 0) {
        tiles.push(Tile.factory().next());
        lastTile = tiles[tiles.length - 1];
    }
}

const randomInteger = (floor, ceiling) => {
    return Math.floor(Math.random()*(ceiling - floor) + floor);
}

gameloop();