
const COLUMNS = 10;
const ROWS = 20;
const CELLS = COLUMNS * ROWS;
const PIECES = 7;
const CELL_SIZE = 32;


var currentPiece;
var currentCells;
var currentGrid = [];
var paused = false;
var keyPresses = [];

class Shape {
    constructor(color, pos) {
        this.color = color;
        this.pos = pos;
        this.rotation = 0;
    }

    moveDown() {
        this.pos.forEach(position => {
            position[1] ++;
        })
        return this;
    }

    async moveLeft() {
        await this.pos.forEach(position => {
            position[0] --;
        })
        return this;
    }

    moveRight() {
        this.pos.forEach(position => {
            position[0] ++;
        })
        return this;
    }
    rotate() {
        
        switch(this.color) {
            case 'cyan':
                switch(this.rotation % 4) {
                    case 0:
                        this.pos[0][0] += 2;
                        this.pos[0][1] -= 1;
                        this.pos[1][0] += 1;
                        this.pos[1][1] += 0;
                        this.pos[2][0] += 0;
                        this.pos[2][1] += 1;
                        this.pos[3][0] -= 1;
                        this.pos[3][1] += 2;
                        break;
                    case 1:
                        this.pos[0][0] += 1;
                        this.pos[0][1] += 2;
                        this.pos[1][0] += 0;
                        this.pos[1][1] += 1;
                        this.pos[2][0] -= 1;
                        this.pos[2][1] += 0;
                        this.pos[3][0] -= 2;
                        this.pos[3][1] -= 1;
                        break;
                    case 2:
                        this.pos[0][0] -= 2;
                        this.pos[0][1] += 1;
                        this.pos[1][0] -= 1;
                        this.pos[1][1] += 0;
                        this.pos[2][0] += 0;
                        this.pos[2][1] -= 1;
                        this.pos[3][0] += 1;
                        this.pos[3][1] -= 2;
                        break;
                    case 3:
                        this.pos[0][0] -= 1;
                        this.pos[0][1] -= 2;
                        this.pos[1][0] += 0;
                        this.pos[1][1] -= 1;
                        this.pos[2][0] += 1;
                        this.pos[2][1] += 0;
                        this.pos[3][0] += 2;
                        this.pos[3][1] += 1;
                        break;
                }
                break;
            case 'blue':
                switch(this.rotation % 4) {
                    case 0:
                        this.pos[0][0] += 2;
                        this.pos[0][1] += 0;
                        this.pos[1][0] += 1;
                        this.pos[1][1] -= 1;
                        this.pos[2][0] += 0;
                        this.pos[2][1] += 0;
                        this.pos[3][0] -= 1;
                        this.pos[3][1] += 1;
                        break; 
                    case 1:
                        this.pos[0][0] += 0;
                        this.pos[0][1] += 2;
                        this.pos[1][0] += 1;
                        this.pos[1][1] += 1;
                        this.pos[2][0] += 0;
                        this.pos[2][1] += 0;
                        this.pos[3][0] -= 1;
                        this.pos[3][1] -= 1;
                        break; 
                    case 2:
                        this.pos[0][0] -= 2;
                        this.pos[0][1] += 0;
                        this.pos[1][0] -= 1;
                        this.pos[1][1] += 1;
                        this.pos[2][0] += 0;
                        this.pos[2][1] += 0;
                        this.pos[3][0] += 1;
                        this.pos[3][1] -= 1;
                        break; 
                    case 3:
                        this.pos[0][0] += 0;
                        this.pos[0][1] -= 2;
                        this.pos[1][0] -= 1;
                        this.pos[1][1] -= 1;
                        this.pos[2][0] += 0;
                        this.pos[2][1] += 0;
                        this.pos[3][0] += 1;
                        this.pos[3][1] += 1;
                        break; 
                }
                break;
            case 'orange':
                switch(this.rotation % 4) {
                    case 0:
                        this.pos[0][0] += 1;
                        this.pos[0][1] -= 1;
                        this.pos[1][0] += 0;
                        this.pos[1][1] += 0;
                        this.pos[2][0] -= 1;
                        this.pos[2][1] += 1;
                        this.pos[3][0] += 0;
                        this.pos[3][1] += 2;
                        break; 
                    case 1:
                        this.pos[0][0] += 1;
                        this.pos[0][1] += 1;
                        this.pos[1][0] += 0;
                        this.pos[1][1] += 0;
                        this.pos[2][0] -= 1;
                        this.pos[2][1] -= 1;
                        this.pos[3][0] -= 2;
                        this.pos[3][1] += 0;
                        break; 
                    case 2:
                        this.pos[0][0] -= 1;
                        this.pos[0][1] += 1;
                        this.pos[1][0] += 0;
                        this.pos[1][1] += 0;
                        this.pos[2][0] += 1;
                        this.pos[2][1] -= 1;
                        this.pos[3][0] += 0;
                        this.pos[3][1] -= 2;
                        break; 
                    case 3:
                        this.pos[0][0] -= 1;
                        this.pos[0][1] -= 1;
                        this.pos[1][0] += 0;
                        this.pos[1][1] += 0;
                        this.pos[2][0] += 1;
                        this.pos[2][1] += 1;
                        this.pos[3][0] += 2;
                        this.pos[3][1] += 0;
                        break;
                }
                break;
            case 'yellow':
                switch(this.rotation % 4) {
                    case 0:
                        this.pos[0][0] += 0;
                        this.pos[0][1] += 0;
                        this.pos[1][0] += 0;
                        this.pos[1][1] += 0;
                        this.pos[2][0] += 0;
                        this.pos[2][1] += 0;
                        this.pos[3][0] += 0;
                        this.pos[3][1] += 0;
                        break; 
                    case 1:
                        this.pos[0][0] += 0;
                        this.pos[0][1] += 0;
                        this.pos[1][0] += 0;
                        this.pos[1][1] += 0;
                        this.pos[2][0] += 0;
                        this.pos[2][1] += 0;
                        this.pos[3][0] += 0;
                        this.pos[3][1] += 0;
                        break; 
                    case 2:
                        this.pos[0][0] += 0;
                        this.pos[0][1] += 0;
                        this.pos[1][0] += 0;
                        this.pos[1][1] += 0;
                        this.pos[2][0] += 0;
                        this.pos[2][1] += 0;
                        this.pos[3][0] += 0;
                        this.pos[3][1] += 0;
                        break; 
                    case 3:
                        this.pos[0][0] += 0;
                        this.pos[0][1] += 0;
                        this.pos[1][0] += 0;
                        this.pos[1][1] += 0;
                        this.pos[2][0] += 0;
                        this.pos[2][1] += 0;
                        this.pos[3][0] += 0;
                        this.pos[3][1] += 0;
                        break; 
                }
                break;
            case 'lime':
                switch(this.rotation % 4) {
                    case 0:
                        this.pos[0][0] += 1;
                        this.pos[0][1] -= 1;
                        this.pos[1][0] += 0;
                        this.pos[1][1] += 0;
                        this.pos[2][0] += 1;
                        this.pos[2][1] += 1;
                        this.pos[3][0] += 0;
                        this.pos[3][1] += 2;
                        break; 
                    case 1:
                        this.pos[0][0] += 1;
                        this.pos[0][1] += 1;
                        this.pos[1][0] += 0;
                        this.pos[1][1] += 0;
                        this.pos[2][0] -= 1;
                        this.pos[2][1] += 1;
                        this.pos[3][0] -= 2;
                        this.pos[3][1] += 0;
                        break; 
                    case 2:
                        this.pos[0][0] -= 1;
                        this.pos[0][1] += 1;
                        this.pos[1][0] += 0;
                        this.pos[1][1] += 0;
                        this.pos[2][0] -= 1;
                        this.pos[2][1] -= 1;
                        this.pos[3][0] += 0;
                        this.pos[3][1] -= 2;
                        break; 
                    case 3:
                        this.pos[0][0] -= 1;
                        this.pos[0][1] -= 1;
                        this.pos[1][0] += 0;
                        this.pos[1][1] += 0;
                        this.pos[2][0] += 1;
                        this.pos[2][1] -= 1;
                        this.pos[3][0] += 2;
                        this.pos[3][1] += 0;
                        break; 
                }
                break;
            case 'purple':
                switch(this.rotation % 4) {
                    case 0:
                        this.pos[0][0] += 1;
                        this.pos[0][1] -= 1;
                        this.pos[1][0] += 1;
                        this.pos[1][1] += 1;
                        this.pos[2][0] += 0;
                        this.pos[2][1] += 0;
                        this.pos[3][0] -= 1;
                        this.pos[3][1] += 1;
                        break; 
                    case 1:
                        this.pos[0][0] += 1;
                        this.pos[0][1] += 1;
                        this.pos[1][0] -= 1;
                        this.pos[1][1] += 1;
                        this.pos[2][0] += 0;
                        this.pos[2][1] += 0;
                        this.pos[3][0] -= 1;
                        this.pos[3][1] -= 1;
                        break; 
                    case 2:
                        this.pos[0][0] -= 1;
                        this.pos[0][1] += 1;
                        this.pos[1][0] -= 1;
                        this.pos[1][1] -= 1;
                        this.pos[2][0] += 0;
                        this.pos[2][1] += 0;
                        this.pos[3][0] += 1;
                        this.pos[3][1] -= 1;
                        break; 
                    case 3:
                        this.pos[0][0] -= 1;
                        this.pos[0][1] -= 1;
                        this.pos[1][0] += 1;
                        this.pos[1][1] -= 1;
                        this.pos[2][0] += 0;
                        this.pos[2][1] += 0;
                        this.pos[3][0] += 1;
                        this.pos[3][1] += 1;
                        break; 
                }
                break;
            case 'red':
                switch(this.rotation % 4) {
                    case 0:
                        this.pos[0][0] += 2;
                        this.pos[0][1] += 0;
                        this.pos[1][0] += 1;
                        this.pos[1][1] += 1;
                        this.pos[2][0] += 0;
                        this.pos[2][1] += 0;
                        this.pos[3][0] -= 1;
                        this.pos[3][1] += 1;
                        break; 
                    case 1:
                        this.pos[0][0] += 0;
                        this.pos[0][1] += 2;
                        this.pos[1][0] -= 1;
                        this.pos[1][1] += 1;
                        this.pos[2][0] += 0;
                        this.pos[2][1] += 0;
                        this.pos[3][0] -= 1;
                        this.pos[3][1] -= 1;
                        break; 
                    case 2:
                        this.pos[0][0] -= 2;
                        this.pos[0][1] += 0;
                        this.pos[1][0] -= 1;
                        this.pos[1][1] -= 1;
                        this.pos[2][0] += 0;
                        this.pos[2][1] += 0;
                        this.pos[3][0] += 1;
                        this.pos[3][1] -= 1;
                        break; 
                    case 3:
                        this.pos[0][0] += 0;
                        this.pos[0][1] -= 2;
                        this.pos[1][0] += 1;
                        this.pos[1][1] -= 1;
                        this.pos[2][0] += 0;
                        this.pos[2][1] += 0;
                        this.pos[3][0] += 1;
                        this.pos[3][1] += 1;
                        break; 
                }
                break;
        }
        this.rotation++;
    }

    rotated() {
        let copyPos = [];
        
        switch(this.color) {
            case 'cyan':
                switch(this.rotation % 4) {
                    case 0:
                        copyPos.push([
                            [this.pos[0][0] + 2, this.pos[0][1] - 1],
                            [this.pos[1][0] + 1, this.pos[1][1] + 0],
                            [this.pos[2][0] + 0, this.pos[2][1] + 1],
                            [this.pos[3][0] - 1, this.pos[3][1] + 2]
                        ])
                        break;
                    case 1:
                        copyPos.push([
                            [this.pos[0][0] + 1, this.pos[0][1] + 2],
                            [this.pos[1][0] + 0, this.pos[1][1] + 1],
                            [this.pos[2][0] - 1, this.pos[2][1] + 0],
                            [this.pos[3][0] - 2, this.pos[3][1] - 1]
                        ])
                        break;
                    case 2:
                        copyPos.push([
                            [this.pos[0][0] - 2, this.pos[0][1] + 1],
                            [this.pos[1][0] - 1, this.pos[1][1] + 0],
                            [this.pos[2][0] + 0, this.pos[2][1] - 1],
                            [this.pos[3][0] + 1, this.pos[3][1] - 2]
                        ])
                        break;
                    case 3:
                        copyPos.push([
                            [this.pos[0][0] - 1, this.pos[0][1] - 2],
                            [this.pos[1][0] + 0, this.pos[1][1] - 1],
                            [this.pos[2][0] + 1, this.pos[2][1] + 0],
                            [this.pos[3][0] + 2, this.pos[3][1] + 1]
                        ])
                        break;
                }
                break;
            case 'blue':
                switch(this.rotation % 4) {
                    case 0:
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                }
                break;
            case 'orange':
                switch(this.rotation % 4) {
                    case 0:
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                }
                break;
            case 'yellow':
                switch(this.rotation % 4) {
                    case 0:
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                }
                break;
            case 'green':
                switch(this.rotation % 4) {
                    case 0:
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                }
                break;
            case 'purple':
                switch(this.rotation % 4) {
                    case 0:
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                }
                break;
            case 'red':
                switch(this.rotation % 4) {
                    case 0:
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                }
                break;
        }
        return new Shape(this.color, copyPos);
    }

    left() {
        let copyPos = [];
        this.pos.forEach(position => {
            copyPos.push([position[0]-1, position[1]]);
        })
        return new Shape(this.color, copyPos);
    }
    right() {
        let copyPos = [];
        this.pos.forEach(position => {
            copyPos.push([position[0]+1, position[1]]);
        })
        return new Shape(this.color, copyPos);
    }
    down() {
        let copyPos = [];
        this.pos.forEach(position => {
            copyPos.push([position[0], position[1]+1]);
        })
        return new Shape(this.color, copyPos);
    }

}

const pieceCollides = async (newPiece, currentGrid) => {
    for(let i=0; i<currentGrid.length; i++) {
        for(let j=0; j<newPiece.length; j++) {
            if(newPiece[j][0] < 0) { // out of bounds left
                console.log('stuff')
                return 'left';
            }
            if(newPiece[j][0] > COLUMNS-1) { // out of bounds right
                return 'right';
            }
            if(newPiece[j][1] > ROWS-1) { // out of bounds bottom
                return 'bottom';
            }
            if(newPiece[j][0] == currentGrid[i][0] && newPiece[j][1] == currentGrid[i][1]){
                return 'piece';
            };
        }
    }
}

const init = () => {

    drawBoard();
    drawPiece(buildRandomPiece());

    document.onkeydown = (e) => {
       switch(e.key) {
            case ' ':
                dropDown();
                break;
            case 'p':
                togglePause();
                break;
            case 'r':
                restartGame();
                break;
            case 'ArrowUp':
                rotatePiece();
                break;
            default:
                if(!keyPresses.includes(e.key)) keyPresses.push(e.key);
        }
    }

    document.onkeyup = (e) => {
        keyPresses.pop(e.key);
    }

    gameloop();

}

var previousTime = 0;

const gameloop = () => {

    
    if(!paused) {

        currentTime = performance.now();
        if(currentTime - previousTime >= 1000) {
            moveDownBind();
            previousTime = currentTime;
        }

        if(keyPresses.includes('ArrowLeft')) {
            moveLeftBind();
        }
        if(keyPresses.includes('ArrowRight')) {
            moveRightBind();
        }
        if(keyPresses.includes('ArrowDown')) {
            moveDownBind();
        }
    }
    setTimeout(gameloop, 100);
}

constantlyMoveDown = () => {
    moveDownBind();
}

const restartGame = () => {
    const board = document.querySelector('.tetris-board')
    var elements = board.getElementsByClassName('filled-cell');
    while(elements[0]) {
        elements[0].parentNode.removeChild(elements[0]);
    }
    currentCells = null;
    currentGrid = [];
    drawPiece(buildRandomPiece());
}

const rotatePiece = async () => {
    let piece = await currentPiece.rotated();
    let grid = await calculateGrid();
    let res = await pieceCollides(piece.pos, grid);
    // console.log(piece);
    // console.log(grid);
    // console.log(res);
    switch(res) {
        case 'left':
            console.log('rotation into left')
            currentPiece.moveRight();
            break;
        case 'right':
            currentPiece.moveLeft();
            break;
        case 'bottom':
            break;
        case 'piece':
            break;
        case false:
            break;
    }
    currentPiece.rotate();
    drawPiece(currentPiece);
}

const dropDown = async () => {
    while(await moveDownBind()) {

    }
}

const moveDownBind = async () => {
    let piece = await currentPiece.down();
    let grid = await calculateGrid();
    if(! await pieceCollides(piece.pos, grid)){
            currentPiece.moveDown();
            drawPiece(currentPiece);
            return true;
        }else{
            checkTetris();
            drawPiece(buildRandomPiece());
            return false;
    }
}

const moveRightBind = async () => {
    let piece = await currentPiece.right();
    let grid = await calculateGrid();
    if(! await pieceCollides(piece.pos, grid)){
            currentPiece.moveRight();
            drawPiece(currentPiece);
    }
}

const moveLeftBind = async () => {
    let piece = await currentPiece.left();
    let grid = await calculateGrid();
    if(! await pieceCollides(piece.pos, grid)){
        currentPiece.moveLeft();
        drawPiece(currentPiece);
    }
}

const drawBoard = () => {
    const tetrisBoard = document.querySelector('.tetris-board');

    for(let i=0; i < CELLS; i++) {
        const cell = document.createElement('div');
        cell.classList.add('tetris-cell');
        tetrisBoard.appendChild(cell);
    }
}

const drawPiece = async (piece) => {
    const board = document.querySelector('.tetris-board');
    if(piece != currentPiece) {
        if(currentCells) currentCells.forEach(cell => cell.classList.remove('current-cell'))
        currentPiece = piece;
        currentCells = [
            document.createElement('div'),
            document.createElement('div'),
            document.createElement('div'),
            document.createElement('div')
        ];
        currentCells.forEach(cell => {
            cell.classList.add('filled-cell', 'current-cell');
            board.appendChild(cell)
        });
    }
    for(let i=0; i < currentCells.length; i++) {
        const cell = currentCells[i];
        const position = piece.pos[i];

        cell.style.background = piece.color;
        cell.style.position = 'absolute';
        cell.style.height = `${CELL_SIZE}px`;
        cell.style.width = `${CELL_SIZE}px`;
        cell.style.left = position[0]*CELL_SIZE + 'px';
        cell.style.top = position[1]*CELL_SIZE + 'px';
    }

}

const buildRandomPiece = () => {
    let index = Math.floor(Math.random() * PIECES);
    switch(index) {
        case 0:
            return new Shape('yellow', [[0,0], [0,1], [1,0], [1,1]]);
        case 1:
            return new Shape('cyan', [[0, 1], [1, 1], [2, 1], [3, 1]]);
        case 2:
            return new Shape('purple', [[0, 1], [1, 0], [1, 1], [2, 1]]);
        case 3:
            return new Shape('blue', [[0, 0], [0, 1], [1, 1], [2, 1]]);
        case 4:
            return new Shape('orange', [[0, 1], [1, 1], [2, 1], [2, 0]]);
        case 5:
            return new Shape('lime', [[0, 1], [1,1], [1, 0], [2, 0]]);
        case 6:
            return new Shape('red', [[0, 0], [1, 0], [1, 1], [2, 1]]);
        default:
            console.log('bro how tf')
    }
}

const calculateGrid = async () => {
    const board = document.querySelector('.tetris-board');
    const filled = [...board.querySelectorAll('.filled-cell:not(.current-cell)')];
    const filledGrid = [[-69, -69]];
    filled.forEach(fill => {
        let x_coordinate = window.getComputedStyle(fill).left;
        let y_coordinate = window.getComputedStyle(fill).top;
        filledGrid.push([parseInt(x_coordinate)/32, parseInt(y_coordinate)/32])
    })
    return filledGrid;
}

const checkTetris = () => {
    const filledCells = [...document.querySelectorAll('.filled-cell')]

    // find row to remove
    // get all items above that row
    // move those items down by 1 cell
    var pixelMap = new Map();
    filledCells.forEach(cell => {
        let test = parseInt(window.getComputedStyle(cell).top);
        if(pixelMap.has(test)) {
            pixelMap.set(test, pixelMap.get(test) + 1);
        } else {
            pixelMap.set(test, 1);
        }
    })
    const board = document.querySelector('.tetris-board')
    pixelMap = new Map([...pixelMap].sort((a, b) => {
        if(a[0] == b[0]) return 0
        if(a[0] > b[0]) return 1
        if(a[0] < b[0]) return -1;
    }));
    pixelMap.forEach((value, key) => {
        if(value == 10) {
            let toRemove = []
            let toMoveDown = []
            filledCells.forEach(cell => {
                let y_coordinate = parseInt(window.getComputedStyle(cell).top);
                if(y_coordinate == key) {
                    toRemove.push(cell);
                } else if (y_coordinate < key) {
                    toMoveDown.push(cell);
                }
            })
            toRemove.forEach(cell => {
                board.removeChild(cell);
            })
            toMoveDown.forEach(cell => {
                cell.style.top = `${parseInt(window.getComputedStyle(cell).top) + CELL_SIZE}px`
                
            })
        }
    })
}

const togglePause = () => {
    const board = document.querySelector('.tetris-board');
    if(paused) {
        board.style.filter = 'brightness(100%)';
        board.removeChild(document.querySelector('.pause-para'))
    } else {
        board.style.filter = 'brightness(45%)';
        const pausedParagraph = document.createElement('p')
        pausedParagraph.classList.add('pause-para')
        pausedParagraph.innerText = 'PAUSED';
        pausedParagraph.style.color = 'black';
        pausedParagraph.style.fontSize = '30px';
        pausedParagraph.style.position = 'absolute'
        pausedParagraph.style.gridColumnStart = 4;
        pausedParagraph.style.gridColumnEnd = 8;
        pausedParagraph.style.gridRowStart = 9;
        pausedParagraph.style.fontFamily = 'Arial';
        board.appendChild(pausedParagraph);
    }
    paused = !paused;
}

init();