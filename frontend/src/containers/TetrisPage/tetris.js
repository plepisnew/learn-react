
// ToDo:
// clean-up code
// document code
// make nice html layout
// collision logic with other objects
// [DONE] fix opacity & colors
// [DONE] add UI for controls (maybe configuring)
// high scores
// timer
// pause, restart and lose game logic

const main = {
    rows: 20,
    cols: 10,
}

const held = {
    rows: 4,
    cols: 4,
}

const next = {
    rows: 4,
    cols: 4,
}

var defaultDebug = {
    cancer: false,
    shadowMode: false,
    placeOnMoveDown: false,
    projectionOpacity: 0.4,
    playerDownFrameDelay: 100, // frames to delay moving down
    keyPressFrameDelay: 10, // frames to delay after key press
    framesPerKeyHandle: 2, // nubmer of frames per every keypress handle
    timePerDownMoveMillis: 2000,
    moveRightOnSpawn: 3,
}

var debug = {}

const controls = {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    down: 'ArrowDown',
    rotate: 'ArrowUp',
    drop: ' ',
    hold: 'c',
    restart: 'r',
    pause: 'p',
}

const description = new Map([
    ['cancer', 'Point of rotation for each piece is incorrect'],
    ['shadowMode', 'All pieces are colored black'],
    ['placeOnMoveDown', 'Moving a block down when unable to, will place the block'],
    ['projectionOpacity', 'Alpha level (opacity) of piece projections'],
    ['playerDownFrameDelay', 'Number of frames until piece moves down after rotation'],
    ['keyPressFrameDelay', 'Number of frames until piece continues to move after initial press'],
    ['framesPerKeyHandle', 'Number of frames after which key events are handled'],
    ['timePerDownMoveMillis', 'Interval in miliseconds between constant block falls'],
    ['moveRightOnSpawn', 'Number of tiles to move pieces to the right upon spawn']
])

const colors = new Map([
    ['red', 'rgb(255, 0, 0)'],
    ['lime', 'rgb(27, 255, 8)'],
    ['yellow', 'rgb(255, 255, 0)'],
    ['cyan', 'rgb(0, 229, 255)'],
    ['blue', 'rgb(48, 79, 254)'],
    ['orange', 'rgb(245, 124, 0)'],
    ['purple', 'rgb(142, 36, 170)']
])

// Code starts here ____________

const canvas = document.querySelector('.tetris-canvas');
const context = canvas.getContext('2d');
const scoreSpan = document.querySelector('.score-number');

const heldCanvas = document.querySelector('.held-canvas');
const heldContext = heldCanvas.getContext('2d');

const nextCanvas = document.querySelector('.next-canvas');
const nextContext = nextCanvas.getContext('2d');

const CELL_SIZE = 30;
var blocks = [];
var currentPiece;
var projection;
var heldPiece;
var nextPiece;
var score = 0;
var frame = 0;
var frameToMoveDown = 0;
var paused = false;

canvas.width = main.cols*CELL_SIZE;
canvas.height = main.rows*CELL_SIZE;

heldCanvas.width = CELL_SIZE * held.cols;
heldCanvas.height = CELL_SIZE * held.rows;

nextCanvas.width = CELL_SIZE * next.cols;
nextCanvas.height = CELL_SIZE * next.rows;

const init = () => {
    initDebug();
    setupKeyBinds();
    setupConfigurables();
    keyBindConfig();

    spawnPiece(getRandomPiece());
    nextPiece = getRandomPiece();
    gameloop();
}

var previousTime = 0;

const gameloop = () => {
    frame++;
    var currentTime = Date.now();
    
    clearCanvas(context, canvas);
    drawGrid(context, canvas, main.cols, main.rows);

    clearCanvas(heldContext, heldCanvas);
    // drawGrid(heldContext, heldCanvas, held.cols, held.rows);
    drawPiece(heldPiece, heldContext);

    clearCanvas(nextContext, nextCanvas);
    // drawGrid(nextContext, nextCanvas, next.cols, next.rows);
    drawPiece(nextPiece, nextContext);

    handlePausing();
    checkTetri();
    drawBlocks(blocks, context);
    drawPiece(currentPiece, context);
    drawCurrentPieceProjection();
    updateScore();
    if(!paused) {
        handleKeyPresses(frame);
        if(currentTime - previousTime > debug.timePerDownMoveMillis && frame > frameToMoveDown) {
            currentPiece.try('down');
            previousTime = currentTime;
        }
    }

    requestAnimationFrame(gameloop);
}

class Point { 
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
    }
    equals(coords) {
        return this.x === coords.x && this.y === coords;
    }
}

class TetrisPiece {
    constructor(p1, p2, p3, p4, color) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.p4 = p4;
        this.p1.color = color;
        this.p2.color = color;
        this.p3.color = color;
        this.p4.color = color;
        this.color = color;
        this.rotation = 0;
    }

    moveDown() {
        this.p1.y++;
        this.p2.y++;
        this.p3.y++;
        this.p4.y++;
    }
    moveLeft() {
        this.p1.x--;
        this.p2.x--;
        this.p3.x--;
        this.p4.x--;
    }
    moveRight() {
        this.p1.x++;
        this.p2.x++;
        this.p3.x++;
        this.p4.x++;
    }
    moveUp() {
        this.p1.y--;
        this.p2.y--;
        this.p3.y--;
        this.p4.y--;
    }
    dropDown() {
        while(this.try('down')) {
        }
    }
    rotate() {
        switch(this.color) {
            case 'blue':
                switch(this.rotation % 4) {
                    case 0:
                        this.p1.x += 2;
                        this.p1.y += 0;
                        this.p2.x += 1;
                        this.p2.y -= 1;
                        this.p3.x += 0;
                        this.p3.y += 0;
                        this.p4.x -= 1;
                        this.p4.y += 1;
                        break;
                    case 1:
                        this.p1.x += 0;
                        this.p1.y += 2;
                        this.p2.x += 1;
                        this.p2.y += 1;
                        this.p3.x += 0;
                        this.p3.y += 0;
                        this.p4.x -= 1;
                        this.p4.y -= 1;
                        break;
                    case 2:
                        this.p1.x -= 2;
                        this.p1.y += 0;
                        this.p2.x -= 1;
                        this.p2.y += 1;
                        this.p3.x += 0;
                        this.p3.y += 0;
                        this.p4.x += 1;
                        this.p4.y -= 1;
                        break;
                    case 3:
                        this.p1.x += 0;
                        this.p1.y -= 2;
                        this.p2.x -= 1;
                        this.p2.y -= 1;
                        this.p3.x += 0;
                        this.p3.y += 0;
                        this.p4.x += 1;
                        this.p4.y += 1;
                        break;
                }
                break;
            case 'orange':
                switch(this.rotation % 4) {
                    case 0:
                        this.p1.x += 1;
                        this.p1.y += -1;
                        this.p2.x += 0;
                        this.p2.y += 0;
                        this.p3.x -= 1;
                        this.p3.y += 1;
                        this.p4.x += 0;
                        this.p4.y += 2;
                        break;
                    case 1:
                        this.p1.x += 1;
                        this.p1.y += 1;
                        this.p2.x += 0;
                        this.p2.y += 0;
                        this.p3.x -= 1;
                        this.p3.y -= 1;
                        this.p4.x -= 2;
                        this.p4.y += 0;
                        break;
                    case 2:
                        this.p1.x -= 1;
                        this.p1.y += 1;
                        this.p2.x += 0;
                        this.p2.y += 0;
                        this.p3.x += 1;
                        this.p3.y -= 1;
                        this.p4.x += 0;
                        this.p4.y -= 2;
                        break;
                    case 3:
                        this.p1.x -= 1;
                        this.p1.y -= 1;
                        this.p2.x += 0;
                        this.p2.y += 0;
                        this.p3.x += 1;
                        this.p3.y += 1;
                        this.p4.x += 2;
                        this.p4.y += 0;
                        break;
                }
                break;
            case 'lime':
                switch(this.rotation % 4) {
                    case 0:
                        this.p1.x += 1;
                        this.p1.y -= 1;
                        this.p2.x += 0;
                        this.p2.y += 0;
                        this.p3.x += 1;
                        this.p3.y += 1;
                        this.p4.x += 0;
                        this.p4.y += 2;
                        break;
                    case 1:
                        this.p1.x += 1;
                        this.p1.y += 1;
                        this.p2.x += 0;
                        this.p2.y += 0;
                        this.p3.x -= 1;
                        this.p3.y += 1;
                        this.p4.x -= 2;
                        this.p4.y += 0;
                        break;
                    case 2:
                        this.p1.x -= 1;
                        this.p1.y += 1;
                        this.p2.x += 0;
                        this.p2.y += 0;
                        this.p3.x -= 1;
                        this.p3.y -= 1;
                        this.p4.x += 0;
                        this.p4.y -= 2;
                        break;
                    case 3:
                        this.p1.x -= 1;
                        this.p1.y -= 1;
                        this.p2.x += 0;
                        this.p2.y += 0;
                        this.p3.x += 1;
                        this.p3.y -= 1;
                        this.p4.x += 2;
                        this.p4.y += 0;
                        break;
                }
                break;
            case 'purple':
                switch(this.rotation % 4) {
                    case 0:
                        this.p1.x += 1;
                        this.p1.y -= 1;
                        this.p2.x += 1;
                        this.p2.y += 1;
                        this.p3.x += 0;
                        this.p3.y += 0;
                        this.p4.x -= 1;
                        this.p4.y += 1;
                        break;
                    case 1:
                        this.p1.x += 1;
                        this.p1.y += 1;
                        this.p2.x -= 1;
                        this.p2.y += 1;
                        this.p3.x += 0;
                        this.p3.y += 0;
                        this.p4.x -= 1;
                        this.p4.y -= 1;
                        break;
                    case 2:
                        this.p1.x -= 1;
                        this.p1.y += 1;
                        this.p2.x -= 1;
                        this.p2.y -= 1;
                        this.p3.x += 0;
                        this.p3.y += 0;
                        this.p4.x += 1;
                        this.p4.y -= 1;
                        break;
                    case 3:
                        this.p1.x -= 1;
                        this.p1.y -= 1;
                        this.p2.x += 1;
                        this.p2.y -= 1;
                        this.p3.x += 0;
                        this.p3.y += 0;
                        this.p4.x += 1;
                        this.p4.y += 1;
                        break;
                }
                break;
            case 'red':
                switch(this.rotation % 4) {
                    case 0:
                        this.p1.x += 2;
                        this.p1.y += 0;
                        this.p2.x += 1;
                        this.p2.y += 1;
                        this.p3.x += 0;
                        this.p3.y += 0;
                        this.p4.x -= 1;
                        this.p4.y += 1;
                        break;
                    case 1:
                        this.p1.x += 0;
                        this.p1.y += 2;
                        this.p2.x -= 1;
                        this.p2.y += 1;
                        this.p3.x += 0;
                        this.p3.y += 0;
                        this.p4.x -= 1;
                        this.p4.y -= 1;
                        break;
                    case 2:
                        this.p1.x -= 2;
                        this.p1.y += 0;
                        this.p2.x -= 1;
                        this.p2.y -= 1;
                        this.p3.x += 0;
                        this.p3.y += 0;
                        this.p4.x += 1;
                        this.p4.y -= 1;
                        break;
                    case 3:
                        this.p1.x += 0;
                        this.p1.y -= 2;
                        this.p2.x += 1;
                        this.p2.y -= 1;
                        this.p3.x += 0;
                        this.p3.y += 0;
                        this.p4.x += 1;
                        this.p4.y += 1;
                        break;
                }
                break;
            case 'cyan':
                switch(this.rotation % 4) {
                    case 0:
                        this.p1.x += 2;
                        this.p1.y -= 1;
                        this.p2.x += 1
                        this.p2.y += 0;
                        this.p3.x += 0;
                        this.p3.y += 1;
                        this.p4.x -= 1;
                        this.p4.y += 2;
                        break;
                    case 1:
                        this.p1.x += 1;
                        this.p1.y += 2;
                        this.p2.x += 0;
                        this.p2.y += 1;
                        this.p3.x -= 1;
                        this.p3.y += 0;
                        this.p4.x -= 2;
                        this.p4.y -= 1;
                        break;
                    case 2:
                        this.p1.x -= 2;
                        this.p1.y += 1;
                        this.p2.x -= 1;
                        this.p2.y += 0;
                        this.p3.x += 0;
                        this.p3.y -= 1;
                        this.p4.x += 1;
                        this.p4.y -= 2;
                        break;
                    case 3:
                        this.p1.x -= 1;
                        this.p1.y -= 2;
                        this.p2.x += 0;
                        this.p2.y -= 1;
                        this.p3.x += 1;
                        this.p3.y += 0;
                        this.p4.x += 2;
                        this.p4.y += 1;
                        break;
                }
                break;
        }
        this.rotation++;
    }
    try(toDo) {
        let copy;
        switch(toDo) {
            case 'left': // trying to move left
                copy = clone(this);
                copy.moveLeft();
                if(collides(copy, blocks)){
                    return false;
                } else {
                    this.moveLeft();
                    return true;
                }
            case 'right': // trying to move right
                copy = clone(this);
                copy.moveRight();
                if(collides(copy, blocks)) {
                    return false;
                } else {
                    this.moveRight();
                    return true;
                } 
            case 'down': // trying to move down
                copy = clone(this);
                copy.moveDown();
                if(collides(copy, blocks)) {
                    placeBlock();
                    return false;
                } else {
                    this.moveDown();
                    return true;
                }
            case 'up': // tryin to move up
                copy = clone(this);
                copy.moveUp();
                if(collides(copy, blocks)) {
                    return false;
                } else {
                    this.moveUp();
                    return true;
                }
            case 'leftRotate':
                copy = clone(this);
                copy.moveLeft();
                copy.rotate();
                if(collides(copy, blocks)) {
                    return false;
                } else {
                    this.moveLeft();
                    this.rotate();
                    return true;
                }
            case 'rightRotate':
                copy = clone(this);
                copy.moveRight();
                copy.rotate();
                if(collides(copy, blocks)) {
                    return false;
                } else {
                    this.moveRight();
                    this.rotate();
                    return true;
                }
            case 'upRotate':
                copy = clone(this);
                copy.moveUp();
                copy.rotate();
                if(collides(copy, blocks)) {
                    return false;
                } else {
                    this.moveUp();
                    this.rotate();
                    return true;
                }
            case 'doubleRightRotate':
                copy = clone(this);
                copy.moveRight();
                copy.moveRight();
                copy.rotate();
                if(collides(copy, blocks)) {
                    return false;
                } else {
                    this.moveRight();
                    this.moveRight();
                    this.rotate();
                    return true;
                }
            case 'doubleLeftRotate':
                copy = clone(this);
                copy.moveLeft();
                copy.moveLeft();
                copy.rotate();
                if(collides(copy, blocks)) {
                    return false;
                } else {
                    this.moveLeft();
                    this.moveLeft();
                    this.rotate();
                    return true;
                }
            case 'doubleUpRotate':
                copy = clone(this);
                copy.moveUp();
                copy.moveUp();
                copy.rotate();
                if(collides(copy, blocks)) {
                    return false;
                } else {
                    this.moveUp();
                    this.moveUp();
                    this.rotate();
                    return true;
                }
            case 'rotate': // trying to rotate
                copy = clone(this);
                copy.rotate();
                frameToMoveDown = frame + debug.playerDownFrameDelay;
                switch(collides(copy, blocks)) {
                    case 'left': // rotate into left wall
                        if(!this.try('rightRotate')) {
                            if(!this.try('doubleRightRotate')) {
                                if(!this.try('upRotate')) {
                                    return false;
                                }
                            }
                        }
                        return true;
                    case 'right': // rotate into right wall
                        if(!this.try('leftRotate')) {
                            if(!this.try('doubleLeftRotate')) {
                                if(!this.try('upRotate')) {
                                    return false;
                                }
                            }
                        }
                        return true;
                    case 'floor': // rotate into floor
                        if(!this.try('upRotate')) {
                            if(!this.try('doubleUpRotate')) {
                                return false;
                            }
                        }
                        return true;
                    case 'other':






                        break;
                    default:
                        this.rotate();
                        return true;
                }
            case 'downPlayer':
                copy = clone(this);
                copy.moveDown();
                if(collides(copy, blocks)) {
                    if(debug.placeBlockOnMoveDown) placeBlock();
                    return false;
                } else {
                    this.moveDown();
                    return true;
                }
        }
    }
}

const collides = (piece, grid, rotation='false') => {
    for(const property in piece) {
        if(typeof piece[property] == 'object') {
            if(piece[property].x < 0) return 'left'; // left wall
            if(piece[property].x > main.cols-1) return 'right'; // right wall
            if(piece[property].y > main.rows-1) return 'floor'; // floor
            for(const block of blocks) {
                if(block.x == piece[property].x && block.y == piece[property].y) return 'other';
            }
        }
    }
}

/**
 * DRAWING
 */

const clearCanvas = (ctx, canv) => {
    ctx.clearRect(0, 0, canv.width, canv.height);
}

const drawGrid = (ctx, canv, width, height, color='rgb(230, 230, 230)') => {
    for(let x = 0; x < width; x++) {
        drawLine(new Point(x*CELL_SIZE, 0), new Point(x*CELL_SIZE, canv.height), ctx, color); // left end
        // drawLine(new Point((x+1)*CELL_SIZE-1, 0), new Point((x+1)*CELL_SIZE, canvas.height), color); // right end
    }
    for(let y = 0; y < height+1; y++ ) {
        drawLine(new Point(0, y*CELL_SIZE), new Point(canv.width, y*CELL_SIZE), ctx, color); // upper end
        // drawLine(new Point(0, (y+1)*CELL_SIZE-1), new Point(canvas.width, (y+1)*CELL_SIZE-1), color); // lower end
    }
}

const drawBlocks = (arr, ctx, isProjection) => {
    arr.forEach(block => {        
        ctx.beginPath();
        ctx.fillStyle = debug.shadowMode ? 'black' : isProjection ? colors.get(block.color).split(')')[0] + `, ${debug.projectionOpacity})` : colors.get(block.color);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        if(ctx == context || block.color == 'cyan') {
            ctx.rect(block.x*CELL_SIZE, block.y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
        } else {
            ctx.rect((block.x + 0.5)*CELL_SIZE, (block.y + 0.5)*CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    })
}

const drawPiece = (piece, ctx, isProjection=false) => {
    if(piece == null) return;
    let pieces = [piece.p1, piece.p2, piece.p3, piece.p4];
    drawBlocks(pieces, ctx, isProjection);
}

// Sexy ass QoL feature
const drawCurrentPieceProjection = () => {
    projection = getProjection(clone(currentPiece));
    drawPiece(projection, context, true);
}

const getProjection = (piece) => {
    let copy = clone(piece);
    copy.moveDown();
    if(!collides(copy, blocks)) {
        piece.moveDown();
        return getProjection(piece);
    } else {
        return piece;
    }
}

const updateScore = () => {
    scoreSpan.innerText = score;
}

/**
 * Draws a Line from a Start point to an End point with a given stroke color, which defaults to black
 * @param {Point} fromPoint - point (tuple) of line start 
 * @param {Point} toPoint - point (tuple) of line end
 * @param {String} color - fill style of the line
 */
const drawLine = (fromPoint, toPoint, ctx, color='black') => {
    ctx.beginPath();
    ctx.moveTo(fromPoint.x, fromPoint.y);
    ctx.lineTo(toPoint.x, toPoint.y);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
}

/** 
 * TETRIS LOGIC
 */

const spawnPiece = (piece) => {
    if(debug.printOnPieceSpawn) console.log(`Spawned ${piece.color} piece`);
    currentPiece = nextPiece == null ? centerPiece(getRandomPiece()) : centerPiece(nextPiece);
    nextPiece = getRandomPiece();
    projection = null;
    if(collides(currentPiece, blocks)) gameOver();
    if(debug.cancer) currentPiece.color = 'orange'
}

const placeBlock = () => {
    blocks.push(currentPiece.p1);
    blocks.push(currentPiece.p2);
    blocks.push(currentPiece.p3);
    blocks.push(currentPiece.p4);
    spawnPiece(getRandomPiece());
}

const getRandomPiece = () => {
    return clone(pieces[randomInteger(0, pieces.length-1)]);
}

const centerPiece = (piece) => {
    exec(() => piece.moveRight(), debug.moveRightOnSpawn);
    return piece;
}

const getPiece = (color) => {
    for(let i=0; i<pieces.length; i++) {
        if(pieces[i].color == color) return clone(pieces[i]);
    }
}

const checkTetri = () => {
    let tetri = 0;
    let sortedBlocks = blocks.sort((p1, p2) => {
        if(p1.y == p2.y) return 0;
        if(p1.y > p2.y) return 1;
        return -1;
    })
    for(let layer = 0; layer < main.rows; layer++) {
        let likeHeightCounter = 0;
        sortedBlocks.forEach(block => {
            if(block.y == layer) likeHeightCounter++;
        })
        if(likeHeightCounter == 10) {
            tetri++;
            blocks = blocks.filter(block => block.y != layer);
            for(let i = 0; i < blocks.length; i++) {
                if(blocks[i].y < layer) blocks[i].y ++;
            }
        }
    }
    switch(tetri) {
        case 1:
            score += 40;
            break;
        case 2:
            score += 100;
            break;
        case 3:
            score += 300;
            break;
        case 4:
            score += 1200;
            break;
    }
}

/**
 * UTILITY FUNCTIONS
 */

const randomInteger = (from, to) => {
    return Math.floor(Math.random()*(to-from+1) + from);
}

// FUCKING FINALLY THIS WORKS HOLY FUCKING SHIT
const clone = (instance) => {
  return Object.assign(
    Object.create(
      Object.getPrototypeOf(instance),
    ),
    JSON.parse(JSON.stringify(instance)),
  );
}

const exec = (func, times) => {
    for(let i=0; i<times; i++) func();
}

/**
 * WINDOW
 */

const initDebug = () => {
    for(const property in defaultDebug) {
        debug[property] = defaultDebug[property];
    }
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var rotating = false;
var dropping = false;
var holding = false;
var restarting = false;
var pausing = false;

const frameToStart = {
    left: 0,
    right: 0,
    down: 0,
}

const configurablesContainer = document.querySelector('.configurables')

const insertConfigurable = (name, description, defaultValue) => {
    const configurable = document.createElement('div');
    configurable.className = 'configurable';

    const configurableName = document.createElement('p');
    configurableName.className = 'configurable-name';
    configurableName.innerText = `${name} (${typeof defaultValue})`
    configurable.appendChild(configurableName);

    const configurableDescription = document.createElement('p');
    configurableDescription.className = 'configurable-description';
    configurableDescription.innerText = description;
    configurable.appendChild(configurableDescription);

    if(typeof defaultValue == 'number') {
        const numberInput = document.createElement('input')
        numberInput.type = 'number';
        numberInput.className = 'configurable-number'
        numberInput.value = defaultValue;
        configurable.appendChild(numberInput);
    } else if (typeof defaultValue == 'boolean') {
        const booleanInput = document.createElement('input')
        booleanInput.type = 'checkbox'
        configurable.appendChild(booleanInput);
    }

    configurablesContainer.appendChild(configurable);
    return configurable;
}

const setupConfigurables = () => {
    for(const property in debug) {
        // console.log(`${property}: ${typeof debug[property]}`);
        const cfg = insertConfigurable(property, description.get(property), debug[property])
    }

    const saveChangesButton = document.querySelector('.save-changes');
    saveChangesButton.onclick = () => {
        const cfgs = document.querySelectorAll('.configurable');
        cfgs.forEach(cfg => {
            let prop = cfg.children[0].innerText.split(" ")[0] // shadowMode
            let inputElement = cfg.children[2];
            let val = inputElement.type == 'number' ? parseFloat(inputElement.value) : inputElement.checked;
            console.log(prop, val);
            debug[prop] = val;
        })
    }
    const restoreDefaultsButton = document.querySelector('.restore-defaults');
    restoreDefaultsButton.onclick = () => {
        const cfgs = document.querySelectorAll('.configurable');
        cfgs.forEach(cfg => {
            let prop = cfg.children[0].innerText.split(" ")[0] // shadowMode
            let inputElement = cfg.children[2];
            if(inputElement.type == 'number') {
                inputElement.value = parseFloat(defaultDebug[prop]);
            } else {
                inputElement.checked = defaultDebug[prop] == 'true' ? true : false;
            }
            debug[prop] = defaultDebug[prop];
        })
    }
}

const handleKeyPresses = (frame) => {
    if(keyPresses.left == 1) {
        currentPiece.try('left');
        frameToStart.left = frame + debug.keyPressFrameDelay;
        keyPresses.left++;
    } else if(keyPresses.left > 1 && frame > frameToStart.left) {
        if(frame % debug.framesPerKeyHandle == 0) currentPiece.try('left');
    }
    if(keyPresses.right == 1) {
        currentPiece.try('right');
        frameToStart.right = frame + debug.keyPressFrameDelay;
        keyPresses.right++;
    } else if(keyPresses.right > 1 && frame > frameToStart.right) {
        if(frame % debug.framesPerKeyHandle == 0) currentPiece.try('right');
    }
    if(keyPresses.down == 1) {
        currentPiece.try('down');
        frameToStart.down = frame + debug.keyPressFrameDelay;
        keyPresses.down++;
    } else if(keyPresses.down > 1 && frame > frameToStart.down) {
        if(frame % debug.framesPerKeyHandle == 0) currentPiece.try('downPlayer');
    }
    
    if(keyPresses.rotate && !rotating) {
        rotating = true;
        currentPiece.try('rotate');
    }
    if(keyPresses.drop && !dropping) {
        dropping = true;
        currentPiece.dropDown();
    }
    if(keyPresses.hold && !holding) {
        holding = true;
        holdCurrentPiece();
    }
    if(keyPresses.restart && !restarting) {
        restarting = true;
        restartConfirmation();
    }
}

const handlePausing = () => {
    if(keyPresses.pause && !pausing) {
        pausing = true;
        pauseGame();
    }
}

const keyPresses = {
    left: 0,
    right: 0,
    down: 0,
    rotate: 0,
    drop: 0,
    hold: 0,
    restart: 0,
    pause: 0,
}

const setupKeyBinds = () => {
    window.onkeydown = (e) => {
        switch(e.key) {
            case controls.left:
                keyPresses.left = keyPresses.left == 0 ? 1 : 2;
                break;
            case controls.right:
                keyPresses.right = keyPresses.right == 0 ? 1 : 2;
                break;
            case controls.down:
                keyPresses.down = keyPresses.down == 0 ? 1 : 2;
                break;
            case controls.rotate:
                keyPresses.rotate = 1;
                break;
            case controls.drop:
                keyPresses.drop = 1;
                break;
            case controls.hold:
                keyPresses.hold = 1;
                break;
            case controls.restart:
                keyPresses.restart = 1;
                break;
            case controls.pause:
                keyPresses.pause = 1;
                break;
            case 't':
                restartCounter = 2;
                restartConfirmation();
        }
    }
    window.onkeyup = (e) => {
        switch(e.key) {
            case controls.left:
                keyPresses.left = 0;
                break;
            case controls.right:
                keyPresses.right = 0;
                break;
            case controls.down:
                keyPresses.down = 0;
                break;
            case controls.rotate:
                rotating = false;
                keyPresses.rotate = 0;
                break;
            case controls.drop:
                dropping = false;
                keyPresses.drop = 0;
                break;
            case controls.hold:
                holding = false;
                keyPresses.hold = 0;
                break;
            case controls.restart:
                restarting = false;
                keyPresses.restart = 0;
                break;
            case controls.pause:
                pausing = false;
                keyPresses.pause = 0;
                break;
        }
    }
}

const keyBindConfig = () => {
    const leftInput = document.querySelector('.left-input')
    const rightInput = document.querySelector('.right-input')
    const downInput = document.querySelector('.down-input')
    const rotateInput = document.querySelector('.rotate-input')
    const dropInput = document.querySelector('.drop-input')
    const holdInput = document.querySelector('.hold-input')
    const restartInput = document.querySelector('.restart-input')
    const pauseInput = document.querySelector('.pause-input')

    leftInput.value = controls.left;
    rightInput.value = controls.right;
    downInput.value = controls.down;
    rotateInput.value = controls.rotate;
    dropInput.value = controls.drop;
    holdInput.value = controls.hold;
    restartInput.value = controls.restart;
    pauseInput.value = controls.pause;
    
    leftInput.onkeyup = (e) => {
        leftInput.value = e.key;
        controls.left = e.key;
    }
    rightInput.onkeyup = (e) => {
        rightInput.value = e.key;
        controls.right = e.key;
    }
    downInput.onkeyup = (e) => {
        downInput.value = e.key;
        controls.down = e.key;
    }
    rotateInput.onkeyup = (e) => {
        rotateInput.value = e.key;
        controls.rotate = e.key;
    }
    dropInput.onkeyup = (e) => {
        dropInput.value = e.key;
        controls.drop = e.key;
    }
    holdInput.onkeyup = (e) => {
        holdInput.value = e.key;
        controls.hold = e.key;
    }
    restartInput.onkeyup = (e) => {
        restartInput.value = e.key;
        controls.restart = e.key;
    }
    pauseInput.onkeyup = (e) => {
        pauseInput.value = e.key;
        controls.pause = e.key;
    }
}

const holdCurrentPiece = () => {
    if(heldPiece == null) {
        let color = currentPiece.color;
        heldPiece = getPiece(color);
        spawnPiece(getRandomPiece());
    } else {
        let tempPiece = heldPiece;
        let color = currentPiece.color;
        heldPiece = getPiece(color);
        currentPiece = tempPiece;
    }
}

var restartCounter = 0;

const restartConfirmation = () => {
    switch(restartCounter) {
        case 0:
            restartCounter = 1;
            pausedScreen.style.display = 'flex';
            pauseText.innerText = 'REALLY?';
            restartText.style.display = 'inline-block';
            break;
        case 1:
            restartCounter = 0;
            pausedScreen.style.display = 'none';
            restartText.style.display = 'none';
            restartGame();
            break;
        case 2:
            restartCounter = 0;
            pausedScreen.style.display = 'none';
            restartText.style.display = 'none';
            break;
    }
}

const restartGame = () => {
    spawnPiece(getRandomPiece());
    score = 0;
    blocks = [];
    heldPiece = null;
}

const pausedScreen = document.querySelector('.pause');
const pauseText = document.querySelector('.pause-text');
const restartText = document.querySelector('.restart-text');
var pauseAnimation = false;

const pauseGame = () => {
    if(!pauseAnimation && restartCounter == 0) {
        if(!paused) {
            pauseText.innerText = 'PAUSED'
            pausedScreen.style.display = 'flex';
            paused = true;
        } else {
            pauseAnimation = true;
            pauseText.innerText = '3';
            sleep(1000).then(() => {
                pauseText.innerText = '2';
                return sleep(1000);
            }).then(() => {
                pauseText.innerText = '1';
                return sleep(1000);
            }).then(() => {
                pausedScreen.style.display = 'none';
                pauseAnimation = false;
                paused = false;
            })
        }
    }
    
}

const gameOver = () => {
    console.log('Game over')
}

const pieces = [
    new TetrisPiece(
        new Point(0, 0),
        new Point(1, 0),
        new Point(1, 1),
        new Point(2, 1),
        'red'
    ),
    new TetrisPiece(
        new Point(0, 1),
        new Point(1, 1),
        new Point(1, 0),
        new Point(2, 0),
        'lime'
    ),
    new TetrisPiece(
        new Point(0, 1),
        new Point(1, 1),
        new Point(2, 1),
        new Point(2, 0),
        'orange'
    ),
    new TetrisPiece(
        new Point(0, 0),
        new Point(0, 1),
        new Point(1, 1),
        new Point(2, 1),
        'blue'
    ),
    new TetrisPiece(
        new Point(0, 0),
        new Point(0, 1),
        new Point(1, 0),
        new Point(1, 1),
        'yellow'
    ),
    new TetrisPiece(
        new Point(0, 1),
        new Point(1, 0),
        new Point(1, 1),
        new Point(2, 1),
        'purple'
    ),
    new TetrisPiece(
        new Point(0, 1),
        new Point(1, 1),
        new Point(2, 1),
        new Point(3, 1),
        'cyan'
    ),
]

init();