import * as THREE from '/build/three.module.js';
// import { OrbitControls } from '/jsm/controls/OrbitControls.js';

const debug = {
    rotationStep: 0.1,
    segments: 1,
    dimensions: 5,
    cellSize: 4,
    omega: Math.PI / 400
}

var cube;
const cubelets = [];

const init = () => {
    cube = new RubiksCube(debug.dimensions, debug.cellSize, debug.segments);
    cube.initialize();
    console.log(cube);
    // cubelets.forEach(cubelet => {
    //     scene.add(cubelet);
    // })
    scene.add(cube.meshGroup);
    console.log(scene);
    cubeloop();
}

var previousTime = 0;

const cubeloop = () => {
    var currentTime = Date.now();
    renderer.render(scene, camera);
    handleUserInput();


    var elapsedTime = currentTime - previousTime;
    previousTime = currentTime;

    handleRotationAnimations(elapsedTime);
    requestAnimationFrame(cubeloop);

}

const canvas = document.querySelector('#bg');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);
const light = new THREE.AmbientLight(0xffffff);
// const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add(light);
const renderer = new THREE.WebGLRenderer({
    canvas,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(50);

const generateCubeMatrix = (n) => {
    let matrix = []
    for(let height = 0; height < n; height++) {
        let matrixPlate = []
        for(let row = 0; row < n; row++) {
            let matrixRow = [];
            for(let col = 0; col < n; col++) {
                matrixRow.push(`${height}${row}${col}`);
            }
            matrixPlate.push(matrixRow);
        }
        matrix.push(matrixPlate);
    }
    return matrix;
}

const generateShellMatrix = (n) => {
    let matrix = []
    for(let height = 0; height < n; height++) {
        let matrixPlate = []
        if(height == 0 || height == n-1) {
            for(let row = 0; row < n; row++) {
                let matrixRow = [];
                for(let col = 0; col < n; col++) {
                    matrixRow.push(`${height}${row}${col}`);
                }
                matrixPlate.push(matrixRow);
            }
        } else {
            for(let row = 0; row < n; row++) {
                let matrixRow = [];
                for(let col = 0; col < n; col++) {
                    if(row == 0 || col == 0 || row == n-1 || col == n-1) {
                        matrixRow.push(`${height}${row}${col}`);
                    } else {
                        matrixRow.push('XXX');
                    }
                }
                matrixPlate.push(matrixRow);
            }
        }
        matrix.push(matrixPlate);
    }
    return matrix;
}

class RubiksCube {
    constructor(dimension, cellSize, segments) {
        this.dimension = dimension;
        this.matrix = generateShellMatrix(dimension);
        this.cellSize = cellSize;
        this.segments = segments;
        this.meshGroup = new THREE.Group();
    }

    initialize() {
        let cornerPieces = 0;
        let edgePieces = 0;
        let centerPieces = 0;
        this.matrix.forEach((plate, plateIndex) => {
            plate.forEach((row, rowIndex) => {
                row.forEach((col, colIndex) => {
                    let coordinates = this.matrix[plateIndex][rowIndex][colIndex];
                    let coordinateArray = coordinates.split('');

                    if(coordinateArray[0] != 'X') {
                        const geometry = new THREE.BoxGeometry(
                            this.cellSize,
                            this.cellSize,
                            this.cellSize,
                            this.segments,
                            this.segments,
                            this.segments,
                        ).toNonIndexed();

                        const materialArr = materialOf(coordinateArray, this.matrix.length, geometry);
                        const material = materialArr[0];
                        const materialString = materialArr[1];
                        switch(materialString.split(' ').length) {
                            case 2:
                                centerPieces += 1;
                                break;
                            case 3:
                                edgePieces += 1;
                                break;
                            case 4:
                                cornerPieces += 1;
                                break;
                        }
                        const box = new THREE.Mesh(geometry, material);
                        box.position.set(
                            this.cellSize * parseInt(coordinateArray[1]),
                            this.cellSize * parseInt(coordinateArray[0]),
                            this.cellSize * parseInt(coordinateArray[2])
                        )
                        cubelets.push(box);
                        // scene.add(box);
                        this.meshGroup.add(box);
                    }
                });
            });
        });
        console.log(`Created a ${this.matrix.length}x${this.matrix.length} Cube with ${cornerPieces} corner pieces, ${edgePieces} edge pieces and ${centerPieces} center pieces`);
    }
}

// 'u 2 3' - rotates first 3 upper layers twice
const algo = (str) => {
    let args = str.split(' ');
    algorithm(args[0], parseInt(args[1]), parseInt(args[2]));
}

/**
 * TODO: add matrix rotation for each side
 * Applies an algorithm to the current cube
 * @param {string} face - which side of the cube to rotate 
 * @param {number} layers - how many layers to rotate
 * @param {number} count - how many times to rotate (angleDeg = count * 90deg)
 */
const algorithm = (face, count, layers) => {
    let ogMatrix = clone(cube.matrix);
    console.log(ogMatrix);
    switch(face.toUpperCase()) {
        case 'U':
            for(let i = 0; i < count; i++) {
                for(let height = cube.dimension - 1; height >= cube.dimension - layers; height--) {
                    rotateMatrixAboutCenter(cube.matrix[height]);
                    rotate('U', height);
                }
            }
            break;
        case 'D':
            for(let i = 0; i < count; i++) {
                for(let height = 0; height < layers; height++) {
                    // rotateMatrixAboutCenter(cube.matrix[height]);
                    rotate('D', height);
                }
            }
            break;
        case 'L':
            for(let i = 0; i < count; i++) {
                for(let width = 0; width < layers; width++) {
                    // rotateMatrixAboutCenter(cube.matrix[height]);
                    rotate('L', width);
                }
            }
            break;
        case 'R':
            for(let i = 0; i < count; i++) {
                for(let width = cube.dimension - 1; width >= cube.dimension - layers; width--) {
                    // rotateMatrixAboutCenter(cube.matrix[height]);
                    rotate('R', width);
                }
            }
            break;
        case 'B':
            for(let i = 0; i < count; i++) {
                for(let depth = 0; depth < layers; depth++) {
                    // rotateMatrixAboutCenter(cube.matrix[height]);
                    rotate('B', depth);
                }
            }
            break;
        case 'F':
            for(let i = 0; i < count; i++) {
                for(let depth = cube.dimension - 1; depth >= cube.dimension - layers; depth--) {
                    // rotateMatrixAboutCenter(cube.matrix[height]);
                    rotate('F', depth);
                }
            }
            break;
    }
    // console.log(cube.matrix);
}

const animationQueue = [];

const handleRotationAnimations = (dt) => {
    if(animationQueue[0]) {
        if(animationQueue[0].angle > 0) {
            let rotationAngle = Math.min(
                animationQueue[0].angle, debug.omega*dt
            )
            animationQueue[0].angle -= rotationAngle;
            animationQueue[0].items.forEach(item => {
                item.rotateOnAxis(animationQueue[0].axis, rotationAngle);
            })
        } else {
            animationQueue.shift();
        }
    }
}

/**
 * TODO: Add physical rotation for each face
 * @param {*} face 
 * @param {*} layer 
 */
const rotate = (face, layer) => {
    let rotatables = cube.meshGroup.children;
    let axis;
    let items;
    switch(face) {
        case 'U':
            // let upperLayer = rotatables.filter(rotatable => rotatable.position.y == debug.cellSize * layer); // U blocks
            // axis = new THREE.Vector3(0, -1, 0); // rotation about y
            // items = []; // U block group
            // let upperLayerGroup = new THREE.Group()
            // upperLayer.forEach(layer => items.push(layer));
            // animationQueue.push({
            //         items,
            //         angle: Math.PI / 2,
            //         axis,
            //     });
            let upperLayer = rotatables.filter(rotatable => rotatable.position.y == debug.cellSize * layer);

            axis = new THREE.Vector3(0, 1, 0);
            let point = new THREE.Vector3(
                debug.dimensions,
                0,
                debug.dimensions,
            )

            upperLayer.forEach(layer => {
                rotateAboutPoint(layer, point, axis, Math.PI/2, false);
            });
            // obj point axis theta isworld
            // rotateAboutPoint(upperGroup, point, axis, 0.01, false);
            break;
        case 'D':
            let downerLayer = rotatables.filter(rotatable => rotatable.position.y == debug.cellSize * layer);
            axis = new THREE.Vector3(0, 1, 0);
            items = [];
            downerLayer.forEach(layer => items.push(layer));
            animationQueue.push({
                items,
                angle: Math.PI / 2,
                axis,
            })
            break;
        case 'L':
            let leftLayer = rotatables.filter(rotatable => rotatable.position.x == debug.cellSize * layer);
            axis = new THREE.Vector3(1, 0, 0);
            items = [];
            leftLayer.forEach(layer => items.push(layer));
            animationQueue.push({
                items,
                angle: Math.PI / 2,
                axis,
            })
            break;
        case 'R':
            let rightLayer = rotatables.filter(rotatable => rotatable.position.x == debug.cellSize * layer);
            axis = new THREE.Vector3(-1, 0, 0);
            items = [];
            rightLayer.forEach(layer => items.push(layer));
            animationQueue.push({
                items,
                angle: Math.PI / 2,
                axis,
            })
            break;
        case 'F':
            let frontLayer = rotatables.filter(rotatable => rotatable.position.z == debug.cellSize * layer);
            axis = new THREE.Vector3(0, 0, -1);
            items = [];
            frontLayer.forEach(layer => items.push(layer));
            animationQueue.push({
                items,
                angle: Math.PI / 2,
                axis,
            })
            break;
        case 'B':
            let backLayer = rotatables.filter(rotatable => rotatable.position.z == debug.cellSize * layer);
            axis = new THREE.Vector3(0, 0, 1);
            items = [];
            backLayer.forEach(layer => items.push(layer));
            animationQueue.push({
                items,
                angle: Math.PI / 2,
                axis,
            })
            break;
    }
}

// obj - your object (THREE.Object3D or derived)
// point - the point of rotation (THREE.Vector3)
// axis - the axis of rotation (normalized THREE.Vector3)
// theta - radian value of rotation
// pointIsWorld - boolean indicating the point is in world coordinates (default = false)
const rotateAboutPoint = (obj, point, axis, theta, pointIsWorld) => {
    pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;
    if(pointIsWorld){
        obj.parent.localToWorld(obj.position);
    }
    obj.position.sub(point);
    obj.position.applyAxisAngle(axis, theta);
    obj.position.add(point);
    if(pointIsWorld){
        obj.parent.worldToLocal(obj.position);
    }
    obj.rotateOnAxis(axis, theta);
}

const rotateMatrixAboutCenter = (matrix) => {
    let shells = matrix.length % 2 == 0 ? matrix.length/2 : Math.floor(matrix.length/2);
    for(let shell = 0; shell < shells; shell++) {
        let shellArray = [];
        let shift = matrix.length - 2*shell - 1;
        for(let col = shell; col < matrix.length - shell; col++) {
            shellArray.push(matrix[shell][col]);
        } // top
        for(let row = 1 + shell; row < matrix.length - 1 - shell; row++) {
            shellArray.push(matrix[row][matrix.length - 1 - shell]);
        } // right
        for(let col = matrix.length - 1 - shell; col > shell; col--) {
            shellArray.push(matrix[matrix.length - 1 - shell][col]);
        } // bottom
        for(let row = matrix.length - 1 - shell; row > shell; row--) {
            shellArray.push(matrix[row][shell]);
        } // left
        shiftArray(shellArray, shift);
        let shiftedElement = 0;
        for(let col = shell; col < matrix.length - shell; col++) {
            matrix[shell][col] = shellArray[shiftedElement];
            shiftedElement++;
        } // top
        for(let row = 1 + shell; row < matrix.length - 1 - shell; row++) {
            matrix[row][matrix.length - 1 - shell] = shellArray[shiftedElement];
            shiftedElement++;
        } // right
        for(let col = matrix.length - 1 - shell; col > shell; col--) {
            matrix[matrix.length - 1 - shell][col] = shellArray[shiftedElement];
            shiftedElement++;
        } // bottom
        for(let row = matrix.length - 1 - shell; row > shell; row--) {
            matrix[row][shell] = shellArray[shiftedElement];
            shiftedElement++;
        } // left
    }
}

/**
 * TODO: make faces beautiful (border: solid black with radius)
 * @param {*} arr 
 * @param {*} dimension 
 * @param {*} geometry 
 * @returns 
 */
const materialOf = (arr, dimension, geometry) => {
    let height = arr[0];
    let depth = arr[1];
    let width = arr[2];
    let combo = ''
    if(height == 0) {
        combo += 'B(white) '; // set bottom white
    } else if (height == dimension - 1) {
        combo += 'T(yellow) '; // set top yellow
    }
    if(depth == 0) {
        combo += 'F(blue) '; // set front blue
    } else if(depth == dimension - 1) {
        combo += 'B(green) '; // set back green
    }
    if(width == 0) {
        combo += 'L(orange) '; // set left orange
    } else if(width == dimension - 1) {
        combo += 'R(red) '; // set right red
    }
    const material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
    });

    const positionAttribute = geometry.getAttribute('position');
    const colors = [];
    const color = new THREE.Color('yellow');

    for(let face = 0; face < 6; face++) {
        let color;
        switch(face) {
            case 0:
                color = new THREE.Color('red');
                break;
            case 1:
                color = new THREE.Color('orange');
                break;
            case 2:
                color = new THREE.Color('yellow');
                break;
            case 3:
                color = new THREE.Color('white');
                break;
            case 4:
                color = new THREE.Color('blue');
                break;
            case 5:
                color = new THREE.Color('lime');
                break;
        }
        for(let vertex = 0; vertex < 6; vertex++) {
            colors.push(color.r, color.g, color.b);
        }
    }
    
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return [
        material,
        combo,
    ]
}

const userInput = {
    rotateUp: false,
    rotateDown: false,
    rotateLeft: false,
    rotateRight: false,
}
/**
 * TODO: set axis of rotation as the middle of cube
 */
const handleUserInput = () => {
    if(userInput.rotateUp) {
        cube.meshGroup.rotation.x -= debug.rotationStep;
    }
    if(userInput.rotateDown) {
        cube.meshGroup.rotation.x += debug.rotationStep;
    }
    if(userInput.rotateLeft) {
        cube.meshGroup.rotation.y -= debug.rotationStep;
    }
    if(userInput.rotateRight) {
        cube.meshGroup.rotation.y += debug.rotationStep;
    }
}

window.onkeydown = (e) => {
    switch(e.key) {
        case 'ArrowDown':
            userInput.rotateDown = true;
            break;
        case 'ArrowRight':
            userInput.rotateRight = true;
            break;
        case 'ArrowUp':
            userInput.rotateUp = true;
            break;
        case 'ArrowLeft':
            userInput.rotateLeft = true;
            break;
        case 'u':
            algo('u 1 1');
            break;
        case 'd':
            algo('d 1 1');
            break;
        case 'l':
            algo('l 1 1');
            break;
        case 'r':
            algo('r 1 1');
            break;
        case 'f':
            algo('f 1 1');
            break;
        case 'b':
            algo('b 1 1');
            break;

    }
}

window.onkeyup = (e) => {
    switch(e.key) {
        case 'ArrowDown':
            userInput.rotateDown = false;
            break;
        case 'ArrowRight':
            userInput.rotateRight = false;
            break;
        case 'ArrowUp':
            userInput.rotateUp = false;
            break;
        case 'ArrowLeft':
            userInput.rotateLeft = false;
            break;
    }
}

const randomInteger = (from, to) => {
    return Math.floor(Math.random() * (to - from + 1)) + from;
}

const clone = (instance) => {
  return Object.assign(
    Object.create(
      Object.getPrototypeOf(instance),
    ),
    JSON.parse(JSON.stringify(instance)),
  );
}

const shiftArray = (arr, num) => {
    for(let i = 0; i < num; i++) {
        let last = arr.pop();
        arr.unshift(last);
    }
}

const algorithmInput = document.querySelector('.algorithm-input');
algorithmInput.onkeydown = (e) => {
    if(e.key == 'Enter') {
        let input = algorithmInput.value;
        algo(input);
    } 
}

init();