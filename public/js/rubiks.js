import * as THREE from '/build/three.module.js';

const canvas = document.querySelector('#bg');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.z = 120;
camera.position.y = 60;
scene.add(camera);
const renderer = new THREE.WebGLRenderer({
    canvas,
});

const debug = {
    logFrameReport: false,
    logCubicleCreation: false,
    cameraMovementStep: 2,
    cameraRotationStep: 0.04,
    maxCubeSize: 60,
    omega: 20,
    dimensions: 3,
    matrixHasInterior: false,
    framesPerKeyHandle: 7,
    keyboardControls: false,
}

var cube;
var scrambler;

const init = () => {
    onresize(); // set canvas size

    dimensionInput.value = debug.dimensions; // initialize default values
    sizeInput.value = debug.maxCubeSize;
    omegaInput.value = debug.omega;

    let dimensions = debug.dimensions; // initialize default cube
    cube = new RubiksCube(dimensions, debug.maxCubeSize / dimensions);
    console.log(cube);

    scrambler = new Scrambler();
    console.log(scrambler);

    animate();
}

var previousTime = 0;
var frame = 0;

const animate = () => {
    var currentTime = Date.now();
    var dt = currentTime - previousTime;
    previousTime = currentTime;
    let frameRate = parseInt(1000/dt);
    if(debug.logFrameReport) console.log(`Frame ${frame} of Gameloop: dt=${dt}ms and FR=${frameRate}fps`);

    handleKeyPresses(frame);
    handleCameraRotation();
    if(frame > 0) handleCubeRotations(dt/1000);

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
    frame++;
}

class Scrambler {

    constructor() {
        this.moves = [];
    }

    // Improve logic for generating moves
    createScrambleMoves(moves) {
        for(let i = 0; i < moves; i++) {
            let items = Array.from(faceVector);
            let arr = items[Math.floor(Math.random()*items.length)];
            let layers = cube.dimension < 4 ? 1 : Math.floor(Math.random()*(cube.dimension-1) + 1);
            this.moves.push({
                face: arr[0],
                layers,
                count: 1,
            });
        }
    }

    addMove(move) {
        this.moves.push(move);
    }
    
    notify() {
        let move = this.moves.shift();
        if(move) this.scheduleMove(move);
    }

    scheduleMove(move) {
        rotateCube(move.face, move.layers, move.count);
    }
}

var rotationQueue = [];

const faceVector = new Map([
    ['U', new THREE.Vector3(0, -1, 0)],
    ['D', new THREE.Vector3(0, 1, 0)],
    ['L', new THREE.Vector3(1, 0, 0)],
    ['R', new THREE.Vector3(-1, 0, 0)],
    ['F', new THREE.Vector3(0, 0, -1)],
    ['B', new THREE.Vector3(0, 0, 1)],
    [`U'`, new THREE.Vector3(0, 1, 0)],
    [`D'`, new THREE.Vector3(0, -1, 0)],
    [`L'`, new THREE.Vector3(-1, 0, 0)],
    [`R'`, new THREE.Vector3(1, 0, 0)],
    [`F'`, new THREE.Vector3(0, 0, 1)],
    [`B'`, new THREE.Vector3(0, 0, -1)],
]);

const rotateCube = (face, count, times) => {
    if(count > debug.dimensions) return;
    for(let time = 0; time < times; time++) {
        let rotation = {
            start: 0,
            end: Math.PI / 2,
            angle: 0,
            axis: faceVector.get(face.toUpperCase()),
            point: getAxisPoint(cube.dimension),
            face,
            count,
        }
        rotationQueue.push(rotation);
    }
}

const handleCubeRotations = (dt) => {
    let rotation = rotationQueue[0];
    if(!rotation) return
    let objects = cube.layers(rotation.face, rotation.count); // determine the rotatables at runtime <3
    if(rotation.angle != rotation.end) {
        let theta = debug.omega * dt;
        let trueTheta = Math.min(rotation.end - rotation.angle, theta);
        rotation.angle += trueTheta;

        rotateAboutAxisAll(
            objects.map(object => object.mesh),
            trueTheta,
            rotation.axis,
            rotation.point
        );
    } else {
        updateMatrix();
        updateColorString(objects, rotation.face);
        rotationQueue.shift();
        scrambler.notify();
    }
}

const rotateAboutAxisAll = (objects, angle, axis, point) => {
    objects.forEach(object => {
        rotateAboutAxis(object, angle, axis, point);
    });
}

const rotateAboutAxis = (object, angle, axis, point) => {
    if(object == null) return; // middle piece
    let quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(axis, angle);
    object.applyQuaternion(quaternion);
    object.position.sub(point);
    object.position.applyQuaternion(quaternion);
    object.position.add(point);
}

/**
 * 
 * @param {*} arr 
 */
const algorithm = (algo) => {
    const args = algo.split(' ');
    args.forEach(move => {
        let face = move.length == 1 ? move.charAt(0) : move.charAt(1) == `'` ? move.substring(0, 2) : move.charAt(0); 
        let count = move.length == 1 ? 1 : move.charAt(1) == `'` ? 1 : parseInt(move.charAt(1));
        rotateCube(face, 1, count);
    });
}

class RubiksCube {
    constructor(dimension, cellSize) {
        this.dimension = dimension;
        this.cellSize = cellSize;
        this.matrix = this.generateMatrix(dimension, cellSize);
    }

    generateMatrix(dimension, cellSize) {
        let matrix = [];
        for(let plateIndex = 0; plateIndex < dimension; plateIndex++) {
            let plate = [];
            for(let rowIndex = 0; rowIndex < dimension; rowIndex++) {
                let row = [];
                for(let colIndex = 0; colIndex < dimension; colIndex++) {
                    let isShell = 
                    (plateIndex == 0 || plateIndex == dimension - 1) ||
                    (rowIndex == 0 || rowIndex == dimension - 1) ||
                    (colIndex == 0 || colIndex == dimension - 1);

                    let id = isShell ? `${plateIndex} ${rowIndex} ${colIndex}` : 'XXX';
                    let cube = generateCubicle(id, dimension, cellSize);
                    let col = new MatrixEntry(id, cube.combo, cube.mesh);
                    // row.push(col);
                    if(id != 'XXX' || debug.matrixHasInterior) row[colIndex] = col;
                }
                plate.push(row);
            }
            matrix.push(plate);
        }
        return matrix;
    }

    render() {
        this.matrix.forEach(cubicle => scene.add(cubicle));
    }

    /**
     * Checks whether all cubicles of a cube are in a solved state position
     * @returns boolean value indicating whether cube is solved
     */
    isSolved() {
        let xMatch = true;
        let yMatch = true;
        let zMatch = true;
        this.matrix.forEach(plate => {
            plate.forEach(row => {
                row.forEach(col => {
                    if(col.mesh != null) {
                        let pos = col.mesh.position;
                        let coords = col.identifier.split(' ');
                        xMatch = xMatch && pos.x == parseInt(coords[1]*this.cellSize);
                        yMatch = yMatch && pos.y == parseInt(coords[0]*this.cellSize);
                        zMatch = zMatch && pos.z == parseInt(coords[2]*this.cellSize);
                    }
                });
            });
        });
        return xMatch && yMatch && zMatch;
    }

    /**
     * Iterates over matrix to find cubicles of certain faces up to a certain layer
     * @param {string} face - cube face, from which cubicles are taken
     * @param {count} count - number of layers that are taken
     * @returns array of meshes matching parameters
     */
    layers(face, count) {
        const rotatables = [];
        switch(face.toUpperCase()) {
            case 'U':
            case `U'`:
                for(let height = 0; height < count; height++) {
                    let cubeHeight = (this.dimension - 1) - height;
                    for(let depth = 0; depth < this.dimension; depth++) {
                        for(let width = 0; width < this.dimension; width++) {
                            let element = this.matrix[cubeHeight][depth][width]
                            if(element) {
                                let cube = element;
                                rotatables.push(cube);
                            }
                        }
                    }
                }
                return rotatables;
            case 'D':
            case `D'`:
                for(let height = 0; height < count; height++) {
                    for(let depth = 0; depth < this.dimension; depth++) {
                        for(let width = 0; width < this.dimension; width++) {
                            let element = this.matrix[height][depth][width]
                            if(element) {
                                let cube = element;
                                rotatables.push(cube);
                            }
                        }
                    }
                }
                return rotatables;
            case 'L':
            case `L'`:
                for(let width = 0; width < count; width++) {
                    for(let height = 0; height < this.dimension; height++) {
                        for(let depth = 0; depth < this.dimension; depth++) {
                            let element = this.matrix[height][depth][width]
                            if(element) {
                                let cube = element;
                                rotatables.push(cube);
                            }
                        }
                    }
                }
                return rotatables;
            case 'R':
            case `R'`:
                for(let width = 0; width < count; width++) {
                    let cubeWidth = (this.dimension - 1) - width;
                    for(let height = 0; height < this.dimension; height++) {
                        for(let depth = 0; depth < this.dimension; depth++) {
                            let element = this.matrix[height][depth][cubeWidth]
                            if(element) {
                                let cube = element;
                                rotatables.push(cube);
                            }
                        }
                    }
                }
                return rotatables;
            case 'F':
            case `F'`:
                for(let depth = 0; depth < count; depth++) {
                    let cubeDepth = (this.dimension - 1) - depth;
                    for(let height = 0; height < this.dimension; height++) {
                        for(let width = 0; width < this.dimension; width++) {
                            let element = this.matrix[height][cubeDepth][width]
                            if(element) {
                                let cube = element;
                                rotatables.push(cube);
                            }
                        }
                    }
                }
                return rotatables;
            case 'B':
            case `B'`:
                for(let depth = 0; depth < count; depth++) {
                    for(let height = 0; height < this.dimension; height++) {
                        for(let width = 0; width < this.dimension; width++) {
                            let element = this.matrix[height][depth][width]
                            if(element) {
                                let cube = element;
                                rotatables.push(cube);
                            }
                        }
                    }
                }
                return rotatables;
        }
    }

    /**
     * Finds corner pieces in cube matrix
     * @param {string} color - color of the target corner piece
     * @param {number} layer - layer at which to find the corner piece
     * @returns array of corner objects containing MatrixEntry, position, rotation and face
     */
    findCorners(color='any', layer=0, count=1){
        let corners = [];
        this.matrix.forEach((plate, plateIndex) => {
            plate.forEach((row, rowIndex) => {
                row.forEach((col, colIndex) => {
                    if(col.colorString.split(' ').length == 4) {
                        if(color == 'any' || col.colorString.includes(color)) {
                            let index = col.colorString.indexOf(color);
                            let face = col.colorString.substring(index-2, index-1);
                            corners.push({
                                col,
                                pos: {
                                    height: plateIndex,
                                    depth: rowIndex,
                                    width: colIndex,
                                },
                                rot: col.mesh.rotation,
                                face,
                            });
                        }
                    }
                });
            });
        });
        let result = corners.filter(corner => corner.pos.height == layer)
        if(count == 'all') return result;
        return result.slice(0, count);
    }
    findEdges(color='any', layer='any', count=1){
        let edges = [];
        this.matrix.forEach((plate, plateIndex) => {
            plate.forEach((row, rowIndex) => {
                row.forEach((col, colIndex) => {
                    if(col.colorString.split(' ').length == 3) {
                        if(color == 'any' || col.colorString.includes(color)) {
                            let index = col.colorString.indexOf(color);
                            let face = col.colorString.substring(index-2, index-1);
                            edges.push({
                                col,
                                pos: {
                                    height: plateIndex,
                                    depth: rowIndex,
                                    width: colIndex,
                                },
                                rot: col.mesh.rotation,
                                face,
                            });
                        }
                    }
                });
            });
        });
        let result = layer == 'any' ? edges : edges.filter(edge => edge.pos.height == layer)
        if(count == 'all') return result;
        return result.slice(0, count);
    }
    findCenters(color='any', layer=0, count=1){
        let centers = [];
        this.matrix.forEach((plate, plateIndex) => {
            plate.forEach((row, rowIndex) => {
                row.forEach((col, colIndex) => {
                    if(col.colorString.split(' ').length == 2) {
                        if(color == 'any' || col.colorString.includes(color)) {
                            let index = col.colorString.indexOf(color);
                            let face = col.colorString.substring(index-2, index-1);
                            centers.push({
                                col,
                                pos: {
                                    height: plateIndex,
                                    depth: rowIndex,
                                    width: colIndex,
                                },
                                rot: col.mesh.rotation,
                                face,
                            });
                        }
                    }
                });
            });
        });
        let result = centers.filter(center => center.pos.height == layer)
        if(count == 'all') return result;
        return result.slice(0, count);
    }
}

class MatrixEntry {
    constructor(identifier, colorString, mesh) {
        this.identifier = identifier;
        this.colorString = colorString;
        this.mesh = mesh;
        this.isCorner = false;
        this.isEdge = false;
        this.isCenter = false;
        switch(this.colorString.split(' ').length) {
            case 2:
                this.isCenter = true;
                break;
            case 3:
                this.isEdge = true;
                break;
            case 4:
                this.isCorner = true;
                break;
        }
    }
}

/**
 * Generates the color string, material, geometry and mesh for a single cubicle.
 * @param {string} id - space separated identifier of cube e.g. '5 6 5' 
 * @param {number} dimension - number of cubicles per dimension for cube
 * @param {number} cellSize - width of a single cubicle
 * @returns object containing colorString and mesh for the MatrixEntry
 */
const generateCubicle = (id, dimension, cellSize) => {
    if(id == 'XXX') {
        if(debug.logCubicleCreation) console.log(`Creating Shallow Cubicle ${id}`)
        return {
            combo: 'XXX',
            mesh: null,
        }
    }
    let combo = '';
    const coordinateArray = id.split(' ');
    
    var [ height, depth, width ] = [ coordinateArray[0], coordinateArray[1], coordinateArray[2] ];

    combo += height == 0 ? 'D(white) ' : height == dimension - 1 ? 'U(yellow) ' : '';
    combo += width == 0 ? 'L(blue) ' : width == dimension - 1 ? 'R(green) ' : '';
    combo += depth == 0 ? 'B(orange) ' : depth == dimension - 1? 'F(red) ' : '' ;

    const geometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize, 1, 1, 1).toNonIndexed();
    const material = materialOf(id, dimension);
    const mesh = new THREE.Mesh(geometry, material);
    
    if(debug.logCubicleCreation) console.log(`Creating Cubicle ${coordinateArray} ${combo}`)
    mesh.position.set(depth*cellSize, height*cellSize, width*cellSize);
    mesh.position.set(width*cellSize, height*cellSize, depth*cellSize);
    scene.add(mesh);
    return {
        combo,
        mesh,
    }
}

/**
 * Updates the colorString field of every object based on a rotation
 * @param {MatrixEntry[]} objects - array of MatrixEntry objects whose colorString needs to be updated 
 * @param {string} face - face upon which a rotation is applied
 */
const updateColorString = (objects, face) => {
    objects.forEach(object => {
        let requiredRotations = colorStringRotation.filter(arr => {
            return arr[0] == face.toUpperCase() || likeRotations.get(face.toUpperCase()) == arr[0]
        });
        let [firstIndex, secondIndex, thirdIndex, fourthIndex] = [
            object.colorString.indexOf(requiredRotations[0][1]),
            object.colorString.indexOf(requiredRotations[1][1]),
            object.colorString.indexOf(requiredRotations[2][1]),
            object.colorString.indexOf(requiredRotations[3][1])
        ];
        if(firstIndex != -1) object.colorString = replace(object.colorString, firstIndex, requiredRotations[0][2]);
        if(secondIndex != -1) object.colorString = replace(object.colorString, secondIndex, requiredRotations[1][2])
        if(thirdIndex != -1) object.colorString = replace(object.colorString, thirdIndex, requiredRotations[2][2])
        if(fourthIndex != -1) object.colorString = replace(object.colorString, fourthIndex, requiredRotations[3][2])
    });
}

const likeRotations = new Map([
    [`R'`, 'L'],
    [`L'`, 'R'],
    [`U'`, 'D'],
    [`D'`, 'U'],
    [`F'`, 'B'],
    [`B'`, 'F'], 
]);

const colorStringRotation = [
    ['L', 'U', 'F'],
    ['L', 'D', 'B'],
    ['L', 'F', 'D'],
    ['L', 'B', 'U'],

    ['R', 'U', 'B'],
    ['R', 'D', 'F'],
    ['R', 'F', 'U'],
    ['R', 'B', 'D'],

    ['U', 'L', 'B'],
    ['U', 'R', 'F'],
    ['U', 'F', 'L'],
    ['U', 'B', 'R'],

    ['D', 'L', 'F'],
    ['D', 'R', 'B'],
    ['D', 'F', 'R'],
    ['D', 'B', 'L'],

    ['F', 'L', 'U'],
    ['F', 'R', 'D'],
    ['F', 'U', 'R'],
    ['F', 'D', 'L'],

    ['B', 'L', 'D'],
    ['B', 'R', 'U'],
    ['B', 'U', 'L'],
    ['B', 'D', 'R'],
]

/**
 * After a physical rotation, updates every MatrixEntry in cube.matrix, so that the position of each mesh matches the current index
 */
const updateMatrix = () => {
    const sussyBakas = [];
    cube.matrix.forEach((plate, plateIndex) => { // find inconsistent entries
        plate.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if(col.mesh == null) return;
                let pos = col.mesh.position;
                let positionIdentifier = `${Math.round(pos.y/cube.cellSize)} ${Math.round(pos.z/cube.cellSize)} ${Math.round(pos.x/cube.cellSize)}`;
                let identifier = `${plateIndex} ${rowIndex} ${colIndex}`;
                let arr = identifier.split(' ').map(str => parseInt(str));
                if(positionIdentifier != identifier) sussyBakas.push(cube.matrix[arr[0]][arr[1]][arr[2]]);
            });
        });
    });
    sussyBakas.forEach(sussyBaka => { // update inconsistent entries
        let pos = sussyBaka.mesh.position;
        let height = Math.round(pos.y/debug.maxCubeSize * debug.dimensions);
        let depth = Math.round(pos.z/debug.maxCubeSize * debug.dimensions);
        let width = Math.round(pos.x/debug.maxCubeSize * debug.dimensions);
        cube.matrix[height][depth][width] = sussyBaka;
    })
}

const texture = {
    red: new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/images/rubiks/red.png')}),
    orange: new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/images/rubiks/orange.png')}),
    yellow: new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/images/rubiks/yellow.png')}),
    green: new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/images/rubiks/green.png')}),
    blue: new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/images/rubiks/blue.png')}),
    white: new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/images/rubiks/white.png')}),
    blank: new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/images/rubiks/blank.png')}),
}

/**
 * Creates material for corresponding MatrixEntry
 * @param {string} id - string-delimited identifier of MatrixEntry 
 * @param {number} dimension - number of cubibcles per dimension for cube 
 * @returns {THREE.MeshBasicMaterial[]} array of six textures
 */
const materialOf = (id, dimension) => {
    const coordinateArray = id.split(' ');
    var [ height, depth, width ] = [ coordinateArray[0], coordinateArray[1], coordinateArray[2] ];
    const material = [];

    if(height == 0) {
        material[3] = texture.white;
        material[2] = texture.blank;
    } else if(height == dimension - 1) {
        material[2] = texture.yellow;
        material[3] = texture.blank;
    }
    if(depth == 0) {
        material[5] = texture.orange;
        material[4] = texture.blank;
    } else if(depth == dimension - 1) {
        material[4] = texture.red;
        material[5] = texture.blank;
    }
    if(width == 0) {
        material[1] = texture.blue;
        material[0] = texture.blank;
    }else if(width == dimension - 1) {
        material[0] = texture.green;
        material[1] = texture.blank;
    }

    for(let i = 0; i < 6; i++) {
        if(!material[i]) material[i] = texture.blank;
    }
    return material;
}

/**
 * Continuous mapping (N to N) from cube dimension to number of moves required for scramble
 * @param {number} dimension - number of cubibcles per dimension for cube
 * @returns number of moves
 */
const numberOfScrambles = (dimension) => {
    return Math.round(Math.sqrt(cube.dimension * 130))
}

/**
 * Removes all meshes from current scene
 */
const clearScene = () => {
    for (let i = scene.children.length - 1; i >= 0; i--) {
        if(scene.children[i].type === "Mesh")
            scene.remove(scene.children[i]);
    }
}

/**
 * Creates vector pointing to point of rotation for cube
 * @param {number} dimension - number of cubibcles per dimension for cube 
 * @returns 3D vector pointing to center
 */
const getAxisPoint = (dimension) => {
    let pt = (debug.maxCubeSize / 2) / ( 1 + 1 / (dimension - 1) );
    return new THREE.Vector3(pt, pt, pt);
} // for some reason midPoint = debug.maxCubeSize/2 doesnt work, so I arrived at this black magic

// Inputs that need to be handled continuously
const userInput = {
    arrowLeft: false,
    arrowRight: false,
    arrowDown: false,
    arrowUp: false,
    u: false,
    d: false,
    l: false,
    r: false,
    f: false,
    b: false,
    space: false,
}

// HTML element actions

const dimensionInput = document.querySelector('.dimension-input'); // inputs
const sizeInput = document.querySelector('.size-input');
const omegaInput = document.querySelector('.omega-input');

const scrambleCube = document.querySelector('.scramble-cube'); // buttons
const spawnCube = document.querySelector('.spawn-cube');
const solveCube = document.querySelector('.solve-cube');

const atomicMove = document.querySelector('.atomic-move'); // algorithm inputs
const longMove = document.querySelector('.long-move');

const cameraX = document.querySelector('.camera-x-input'); // camera inputs
const cameraY = document.querySelector('.camera-y-input');
const cameraZ = document.querySelector('.camera-z-input');
const cameraStep = document.querySelector('.camera-zoom-input');
const cameraStepMovement = document.querySelector('.camera-rotation-input');

const algorithmSwitch = document.querySelector('.algorithm-switch');

algorithmSwitch.oninput = () => {
    console.log(algorithmSwitch.checked);
    debug.keyboardControls = algorithmSwitch.checked;
}

scrambleCube.onclick = () => {
    scrambler.createScrambleMoves(numberOfScrambles(cube.dimension));
    scrambler.notify();
}

spawnCube.onclick = () => {
    debug.dimensions = dimensionInput.value;
    debug.maxCubeSize = sizeInput.value;
    debug.omega = omegaInput.value;
    if(!dimensionInput.value) debug.dimensions = 3;
    if(!sizeInput.value) debug.maxCubeSize = 60;
    if(!omegaInput.value) debug.omega = Math.PI;
    onCubeChange();
    rotationQueue = [];
    clearScene();
    cube = new RubiksCube(debug.dimensions, debug.maxCubeSize / debug.dimensions);
    console.log(cube);
}

solveCube.onclick = async () => {
    await solveCurrentCube();
}

atomicMove.onkeydown = (e) => {
if(e.key === 'Enter') {
        const input = atomicMove.value;
        const args = input.split(' ');
        rotateCube(args[0], parseInt(args[1]), parseInt(args[2]));
    }
}

longMove.onkeydown = (e) => {
    if(e.key === 'Enter') {
        algorithm(longMove.value);
    }
}

cameraX.oninput = () => camera.position.x = roundTo(cameraX.value, 3);
cameraY.oninput = () => camera.position.y = roundTo(cameraY.value, 3);
cameraZ.oninput = () => camera.position.z = roundTo(cameraZ.value, 3);
cameraStep.oninput = () => {
    debug.cameraMovementStep = parseInt(cameraStep.value);
}
cameraStepMovement.oninput = () => {
    debug.cameraRotationStep = roundTo(cameraStepMovement.value, 3);
}
cameraStep.value = debug.cameraMovementStep;
cameraStepMovement.value = debug.cameraRotationStep;

window.onkeydown = (e) => {
    if(e.key === 'ArrowLeft') userInput.arrowLeft = true;
    if(e.key === 'ArrowRight') userInput.arrowRight = true;
    if(e.key === 'ArrowDown') userInput.arrowDown = true;
    if(e.key === 'ArrowUp') userInput.arrowUp = true;
    
    if(debug.keyboardControls) {
        if(e.key === 'u' && !userInput.u) {
            userInput.u = true;
            console.log(userInput.space);
            userInput.space ? rotateCube(`u'`, 1, 1) : rotateCube('u', 1, 1);
        }
        if(e.key === 'd' && !userInput.d) {
            userInput.d = true;
            userInput.space ? rotateCube(`d'`, 1, 1) : rotateCube('d', 1, 1);
        }
        if(e.key === 'l' && !userInput.l) {
            userInput.l = true;
            userInput.space ? rotateCube(`l'`, 1, 1) : rotateCube('l', 1, 1);
        }
        if(e.key === 'r' && !userInput.r) {
            userInput.r = true;
            userInput.space ? rotateCube(`r'`, 1, 1) : rotateCube('r', 1, 1);
        }
        if(e.key === 'f' && !userInput.f) {
            userInput.f = true;
            userInput.space ? rotateCube(`f'`, 1, 1) : rotateCube('f', 1, 1);
        }
        if(e.key === 'b' && !userInput.b) {
            userInput.b = true;
            userInput.space ? rotateCube(`b'`, 1, 1) : rotateCube('b', 1, 1);
        }
        if(e.key === ' ') userInput.space = true;
    }
}

window.onkeyup = (e) => {
    if(e.key === 'ArrowLeft') userInput.arrowLeft = false;
    if(e.key === 'ArrowRight') userInput.arrowRight = false;
    if(e.key === 'ArrowDown') userInput.arrowDown = false;
    if(e.key === 'ArrowUp') userInput.arrowUp = false;

    if(e.key === 'u') userInput.u = false;
    if(e.key === 'd') userInput.d = false;
    if(e.key === 'l') userInput.l = false;
    if(e.key === 'r') userInput.r = false;
    if(e.key === 'f') userInput.f = false;
    if(e.key === 'b') userInput.b = false;
    if(e.key === ' ') userInput.space = false;
}

const onwheel = (e = { deltaY : 0 }) => {
    if(e.deltaY > 0) {
        camera.position.z += debug.cameraMovementStep;
    } else if(e.deltaY < 0) {
        camera.position.z -= debug.cameraMovementStep;
    }
}
window.onwheel = onwheel;

const onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}
window.onresize = onresize;

/**
 * Handles Arrow keypreses for moving camera around
 */
const handleKeyPresses = (frame) => {
    if(userInput.arrowLeft) uAngle += debug.cameraRotationStep;
    if(userInput.arrowRight) uAngle -= debug.cameraRotationStep;
    if(userInput.arrowDown) rAngle -= debug.cameraRotationStep;
    if(userInput.arrowUp) rAngle += debug.cameraRotationStep;
    rAngle = rAngle < 0 ? Math.max(-Math.PI/2, rAngle) : Math.min(Math.PI/2, rAngle);
}

var uAngle = 0;
var rAngle = 0;

const midPoint = {
    x: debug.maxCubeSize / 2,
    y: debug.maxCubeSize / 2,
    z: debug.maxCubeSize / 2,
}

const onCubeChange = () => {
    midPoint.x = debug.maxCubeSize / 2;
    midPoint.y = debug.maxCubeSize / 2;
    midPoint.z = debug.maxCubeSize / 2;
}

/**
 * Handles Camera movement around middle point
 */
const handleCameraRotation = () => {
    let radius = pythagorean(
        midPoint.x,
        midPoint.z,
        camera.position.x,
        camera.position.z
    );
    camera.position.x = roundTo(midPoint.x + radius * Math.sin(uAngle), 3);
    camera.position.y = roundTo(midPoint.y + radius * Math.sin(rAngle), 3);
    camera.position.z = roundTo(midPoint.z + radius * Math.cos(uAngle), 3);

    cameraX.value = camera.position.x;
    cameraY.value = camera.position.y;
    cameraZ.value = camera.position.z;

    focusCamera();
}

/**
 * Points [Perspective] Camera to the center of the cube
 */
const focusCamera = () => {
    camera.lookAt(new THREE.Vector3(
        midPoint.x,
        midPoint.y,
        midPoint.z
    ))
}

// Utility methods

const clone = (instance) => {
  return Object.assign(
    Object.create(
      Object.getPrototypeOf(instance),
    ),
    JSON.parse(JSON.stringify(instance)),
  );
}

const pythagorean = (x1, z1, x2, z2) => {
    return Math.sqrt(
        Math.pow(x1 - x2, 2) + Math.pow(z1 - z2, 2)
    )
}

const roundTo = (number, places) => {
    return Math.floor(number * Math.pow(10, places)) / Math.pow(10, places);
}

const replace = (str, index, replacement) => {
    return str.substring(0, index) + replacement + str.substring(index + replacement.length);
}

const rotationsCompleted = async () => {
    return new Promise(resolve => {
        const check = () => {
            if(rotationQueue.length == 0) {
                resolve();
            } else {
                window.setTimeout(check, 100);
            }
        }
        check();
    });
}

/**
 * Rubiks Cube solving logic
 */
// UPON START ROTATE CENTERS CORRECTLY (FOR ODD)
const solveCurrentCube = async () => {
    let solved = false;
    const startTime = Date.now();
    if(cube.dimension == 2) {
        
        // Arrange bottom white pieces
        let bottomWhites = cube.findCorners('white', 0, 'all');
        bottomWhites.forEach(piece => {
            switch(piece.face.toUpperCase()) { // D is good; U is impossible
                case 'F':
                    if(piece.pos.width == 0) algorithm(`L' U L U' L' U L`);  
                    if(piece.pos.width == 1) algorithm(`R U' R' U R U' R'`);
                    break;
                case 'L':
                    if(piece.pos.depth == 0) algorithm(`B' U B U' B' U B`)
                    if(piece.pos.depth == 1) algorithm(`F U' F' U F U' F'`);
                    break;
                case 'R':
                    if(piece.pos.depth == 0) algorithm(`B U' B' U B U' B'`)
                    if(piece.pos.depth == 1) algorithm(`F' U F U' F' U F`)
                    break;
                case 'B':
                    if(piece.pos.width == 0) algorithm(`L U' L' U L U' L'`)
                    if(piece.pos.width == 1) algorithm(`R' U R U' R' U R`)
                    break;
            }
        });
        await rotationsCompleted();
        // Bottom cubes are independent. Upper cubes impact one another though
        // After white cubes are done, there will be 1 - 4 white cubes in top layer
        // Keep looking for corners and solve each separately

        // Arrange top white pieces
        let uppers = cube.findCorners('white', 1, 'all');
        for(let i = 0; i < uppers.length; i++) {
            let upper = cube.findCorners('white', 1, 1)[0];
            let below = cube.matrix[0][upper.pos.depth][upper.pos.width];
            while(below.colorString.includes('D(white)')) { // bottom piece is solved: keep rotating D
                algorithm('D');
                await rotationsCompleted();
                below = cube.matrix[0][upper.pos.depth][upper.pos.width];
            }
            switch(upper.face.toUpperCase()) { // D is good; U is impossible
                    case 'F':
                        if(upper.pos.width == 0) algorithm(`U' L' U L`);
                        if(upper.pos.width == 1) algorithm(`U R U' R'`);  
                        break;
                    case 'L':
                        if(upper.pos.depth == 0) algorithm(`U' B' U B`);
                        if(upper.pos.depth == 1) algorithm(`U F U' F'`);
                        break;
                    case 'R':
                        if(upper.pos.depth == 0) algorithm(`U B U' B'`)
                        if(upper.pos.depth == 1) algorithm(`U' F' U F`)
                        break;
                    case 'B':
                        if(upper.pos.width == 0) algorithm(`U L U' L'`)
                        if(upper.pos.width == 1) algorithm(`U' R' U R`)
                        break;
                    case 'U':
                        if(upper.pos.width == 0 && upper.pos.depth == 0) algorithm(`L U2 L' U2 B' U B`);
                        if(upper.pos.width == 0 && upper.pos.depth == 1) algorithm(`L' U2 L U2 F U' F'`);
                        if(upper.pos.width == 1 && upper.pos.depth == 0) algorithm(`R' U2 R U2 B U' B'`);
                        if(upper.pos.width == 1 && upper.pos.depth == 1) algorithm(`R U2 R' U2 F' U F`);
                        break;
                }
            await rotationsCompleted();
        }

        // Solve yellow side
        let topLayer = cube.layers('u', 1);
        let numOfCornersCorrect = topLayer.filter(entry => entry.colorString.includes('U(yellow)')).length;
        oll_loop:
        for(let i = 0; i < 4; i++) {
            switch(numOfCornersCorrect) {
                case 0:
                    if(cube.matrix[1][1][1].colorString.includes('F(yellow)')) {
                        if(cube.matrix[1][1][0].colorString.includes('L(yellow)')) {
                            // pi
                            algorithm(`R U2 R2 U' R2 U' R2 U2 R`);
                            break oll_loop;
                        }
                        if(cube.matrix[1][0][0].colorString.includes('B(yellow)')) {
                            // H
                            algorithm(`R2 U2 R U2 R2`);
                            break oll_loop;
                        }
                    }
                    break;
                case 1:
                    if(cube.matrix[1][1][0].colorString.includes('F(yellow)')) {
                        if(cube.matrix[1][0][1].colorString.includes('U(yellow)')) {
                            algorithm(`R U2 R' U' R U' R'`);
                            break oll_loop;
                        }
                    }
                    if(cube.matrix[1][1][0].colorString.includes('U(yellow)')) {
                        if(cube.matrix[1][0][1].colorString.includes('R(yellow)')) {
                            algorithm(`R U R' U R U2 R'`);
                            break oll_loop;
                        }
                    }
                    break;
                case 2:
                    if(cube.matrix[1][1][0].colorString.includes('F(yellow)')) {
                        if(cube.matrix[1][0][1].colorString.includes('R(yellow)')) {
                            algorithm(`F R' F' R U R U' R'`);
                            break oll_loop;
                        }
                        if(cube.matrix[1][0][0].colorString.includes('B(yellow)')) {
                            algorithm(`R U R' U' R' F R F'`);
                            break oll_loop;
                        }
                    }
                    if(cube.matrix[1][0][1].colorString.includes('U(yellow)')) {
                        if(cube.matrix[1][1][1].colorString.includes(`U(yellow)`)) {
                            algorithm(`F R U R' U' F'`);
                            break oll_loop;
                        }
                    }
                    break;
            }
            algorithm('U');
            await rotationsCompleted();
        }
        await rotationsCompleted();
        // Permute last 2 layers

        // Decide bottom permutation
        let bottom;
        for(let i = 0; i < 4; i++) {
            let topLeft = cube.matrix[0][0][0];
            let topRight = cube.matrix[0][0][1];
            let bottomLeft = cube.matrix[0][1][0];
            let bottomRight = cube.matrix[0][1][1];

            if(sameColor(bottomLeft, 'F', bottomRight, 'F')) {
                if(sameColor(topLeft, 'B', topRight, 'B')) {
                    bottom = 'solved';
                    break;
                } else {
                    bottom = 'adj';
                    break;
                }
            }
            if(sameColor(bottomLeft, 'F', topLeft, 'B') && sameColor(bottomRight, 'F', topRight, 'B')) {
                if(sameColor(bottomLeft, 'L', bottomRight, 'R') && sameColor(topLeft, 'L', topRight, 'R')) {
                    bottom = 'diag';
                    break;
                }
            }
            algorithm(`D`);
            await rotationsCompleted();
        }
        // Decide top permutation
        let top;
        for(let i = 0; i < 4; i++) {
            let topLeft = cube.matrix[1][0][0];
            let topRight = cube.matrix[1][0][1];
            let bottomLeft = cube.matrix[1][1][0];
            let bottomRight = cube.matrix[1][1][1];

            if(sameColor(bottomLeft, 'F', bottomRight, 'F')) {
                if(sameColor(topLeft, 'B', topRight, 'B')) {
                    top = 'solved';
                    break;
                } else {
                    top = 'adj';
                    break;
                }
            }
            if(sameColor(bottomLeft, 'F', topLeft, 'B') && sameColor(bottomRight, 'F', topRight, 'B')) {
                if(sameColor(bottomLeft, 'L', bottomRight, 'R') && sameColor(topLeft, 'L', topRight, 'R')) {
                    top = 'diag';
                    break;
                }
            }
            algorithm(`U`);
            await rotationsCompleted();
        }
        await rotationsCompleted();

        // Find PBL case
        if(top == 'adj' && bottom == 'adj') { // symetrical
            algorithm(`R2 U' B2 U2 R2 U' R2`);
        }else if(top == 'adj' && bottom == 'diag') { // non-symetrical
            algorithm(`R U' R F2 R' U R'`);
        }else if(top == 'diag' && bottom == 'diag') { // symetrical
            algorithm(`R2 F2 R2`);
        }else if(bottom == 'solved' && top == 'adj') { // non-symetrical
            algorithm(`U R U R' U' R' F R2 U' R' U' R U R' F'`); // U in front
        }else if(bottom == 'solved' && top == 'diag') { // non-symetrical
            algorithm(`F R U' R' U' R U R' F' R U R' U' R' F R F'`);
        }else{
            algorithm(`F2 B2`);
            await rotationsCompleted();
            if(top == 'diag' && bottom == 'adj') {
                algorithm(`R U' R F2 R' U R'`);
            }else if(top == 'solved' && bottom == 'adj') {
                algorithm(`U R U R' U' R' F R2 U' R' U' R U R' F'`);
            }else if(top == 'solved' && bottom == 'diag') {
                algorithm(`F R U' R' U' R U R' F' R U R' U' R' F R F'`);
            }
        }
        await rotationsCompleted();
        for(let i = 0; i < 4; i++) {
            let topPiece = cube.matrix[1][1][1];
            let bottomPiece = cube.matrix[0][1][1];
            if(sameColor(topPiece, 'F', bottomPiece, 'F')) {
                solved = true;
                break;
            }
            algorithm(`U`);
            await rotationsCompleted();
        }
        if(!solved) {
            console.log(`Problem with: Top was ${top} and bottom was ${bottom}`);
        }

    } else if (cube.dimension == 3) {

        let correctEdges = cube.findEdges('white', 2, 'all').filter(edge => edge.col.colorString.includes(`U(white)`));
        let iterationsNeeded = 4 - correctEdges.length;

        // Make flower pattern
        for(let i = 0; i < iterationsNeeded; i++) {
            let badEdges = cube.findEdges('white', 'any', 'all').filter(edge => edge.face != 'U');
            let badEdge = badEdges[0];
            let insertionSlot;
            switch(badEdge.pos.height) {
                case 2:
                    switch(badEdge.face) { // D is impossible, U is good 
                        case 'F':
                            algorithm(`F U' R`)
                            break;
                        case 'B':
                            algorithm(`B' U R'`)
                            break;
                        case 'L':
                            algorithm(`L U' F`)
                            break;
                        case 'R':
                            algorithm(`R' U F';`)
                            break;
                    }
                    break;
                case 1:
                    switch(badEdge.face) { // D is impossible, U is impossible 
                        case 'F':
                            insertionSlot = cube.matrix[2][1][badEdge.pos.width];
                            while(insertionSlot.colorString.includes(`U(white)`)) {
                                algorithm(`U`);
                                await rotationsCompleted();
                                insertionSlot = cube.matrix[2][1][badEdge.pos.width];
                            }
                            algorithm(badEdge.pos.width == 0 ? `L'` : `R`);
                            break;
                        case 'B':
                            insertionSlot = cube.matrix[2][1][badEdge.pos.width];
                            while(insertionSlot.colorString.includes(`U(white)`)) {
                                algorithm(`U`);
                                await rotationsCompleted();
                                insertionSlot = cube.matrix[2][1][badEdge.pos.width];
                            }
                            algorithm(badEdge.pos.width == 0 ? `L` : `R'`);
                            break;
                        case 'L':
                            insertionSlot = cube.matrix[2][badEdge.pos.depth][1];
                            while(insertionSlot.colorString.includes(`U(white)`)) {
                                algorithm(`U`);
                                await rotationsCompleted();
                                insertionSlot = cube.matrix[2][badEdge.pos.depth][1];
                            }
                            algorithm(badEdge.pos.depth == 0 ? `B'` : `F`);
                            break;
                        case 'R':
                            insertionSlot = cube.matrix[2][badEdge.pos.depth][1];
                            while(insertionSlot.colorString.includes(`U(white)`)) {
                                algorithm(`U`);
                                await rotationsCompleted();
                                insertionSlot = cube.matrix[2][badEdge.pos.depth][1];
                            }
                            algorithm(badEdge.pos.depth == 0 ? `B` : `F'`);
                            break;
                    }
                    break;
                case 0:
                    switch(badEdge.face) { // D is impossible, U is impossible 
                        case 'F':
                            insertionSlot = cube.matrix[2][2][1];
                            while(insertionSlot.colorString.includes(`U(white)`)) {
                                algorithm(`U`);
                                await rotationsCompleted();
                                insertionSlot = cube.matrix[2][2][1];
                            }
                            algorithm(`F' U' R`);
                            break;
                        case 'B':
                            insertionSlot = cube.matrix[2][0][1];
                            while(insertionSlot.colorString.includes(`U(white)`)) {
                                algorithm(`U`);
                                await rotationsCompleted();
                                insertionSlot = cube.matrix[2][0][1];
                            }
                            algorithm(`B' U' L`);
                            break;
                        case 'L':
                            insertionSlot = cube.matrix[2][1][0];
                            while(insertionSlot.colorString.includes(`U(white)`)) {
                                algorithm(`U`);
                                await rotationsCompleted();
                                insertionSlot = cube.matrix[2][1][0];
                            }
                            algorithm(`L U B'`);
                            break;
                        case 'R':
                            insertionSlot = cube.matrix[2][1][2];
                            while(insertionSlot.colorString.includes(`U(white)`)) {
                                algorithm(`U`);
                                await rotationsCompleted();
                                insertionSlot = cube.matrix[2][1][2];
                            }
                            algorithm(`R' U' B`);
                            break;
                        case 'D':
                            insertionSlot = cube.matrix[2][badEdge.pos.depth][badEdge.pos.width];
                            while(insertionSlot.colorString.includes(`U(white)`)) {
                                algorithm(`U`);
                                await rotationsCompleted();
                                insertionSlot = cube.matrix[2][badEdge.pos.depth][badEdge.pos.width];
                            }
                            if(badEdge.pos.depth == 0) algorithm(`B2`);
                            if(badEdge.pos.depth == 2) algorithm(`F2`);
                            if(badEdge.pos.width == 0) algorithm(`L2`);
                            if(badEdge.pos.width == 2) algorithm(`R2`);
                            break;
                    }
                }
            await rotationsCompleted();
        }

        // Create cross
        for(let i = 0; i < 4; i++) {
            let frontPiece = cube.matrix[2][2][1];
            let frontCenterPiece = cube.matrix[1][2][1];
            while(!sameColor(frontPiece, 'F', frontCenterPiece, 'F') || !frontPiece.colorString.includes(`U(white)`)) {
                algorithm(`U`);
                await rotationsCompleted();
                frontPiece = cube.matrix[2][2][1];
            }
            algorithm(`F2`);
            rotateCube('U', 3, 1);
            await rotationsCompleted();
        }

        // F2L
        for(let i = 0; i < 4; i++) {
            
        }

    } else if (cube.dimension == 4) {

    }

    const endTime = Date.now();
    console.log(solved ? `Cube solved in ${(endTime-startTime)/1000}s!` : 'Failed to solve cube... :/');
}

const sameColor = (col1, face1, col2, face2) => {
    let firstColors = col1.colorString.split(' ');
    let secondColors = col2.colorString.split(' ');
    let firstColor = firstColors.filter(color => color.charAt(0) == face1.toUpperCase())[0];
    let secondColor = secondColors.filter(color => color.charAt(0) == face2.toUpperCase())[0];
    let first = firstColor.split('(')[1].split(')')[0];
    let second = secondColor.split('(')[1].split(')')[0];
    return first == second;
}

init();