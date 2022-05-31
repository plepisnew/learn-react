import * as THREE from '/build/three.module.js';

const canvas = document.querySelector('#bg')

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.z = 120;
camera.position.y = 60;
scene.add(camera);
const renderer = new THREE.WebGLRenderer({
    canvas,
});

const algoInput = document.querySelector('.algorithm');
algoInput.onkeydown = (e) => {
    if(e.key === 'Enter') {
        const input = algoInput.value;
        const args = input.split(' ');
        rotateCube(args[0], parseInt(args[1]), parseInt(args[2]));
    }
}

/**
 * NxN Rubik's Cube has volume N^3 and N^3 - (N-2)^3 cubes
 */

const debug = {
    logFrameReport: false,
    logCubicleCreation: false,
    cameraMovementStep: 2,
    cameraRotationStep: 0.04,
    maxCubeSize: 60,
    omega: Math.PI,
    dimensions: 3,
    matrixHasInterior: false,
}

var cube;

const init = () => {
    window.onresize = onresize;
    onresize();
    onwheel({ deltaY: 0});

    dimensionInput.value = debug.dimensions;
    sizeInput.value = debug.maxCubeSize;
    omegaInput.value = debug.omega;

    let dimensions = debug.dimensions;
    cube = new RubiksCube(dimensions, debug.maxCubeSize / dimensions);
    console.log(cube);
    if(cube.isSolved()) console.log('cube solved')

    animate();
}

const dimensionInput = document.querySelector('.dimension-input');
const sizeInput = document.querySelector('.size-input');
const omegaInput = document.querySelector('.omega-input');

document.querySelector('.spawn-cube').onclick = () => {
    debug.dimensions = dimensionInput.value;
    debug.maxCubeSize = sizeInput.value;
    debug.omega = omegaInput.value;
    if(!dimensionInput.value) debug.dimensions = 3;
    if(!sizeInput.value) debug.maxCubeSize = 60;
    if(!omegaInput.value) debug.omega = Math.PI;
    onCubeChange();
    clearScene();
    cube = new RubiksCube(debug.dimensions, debug.maxCubeSize / debug.dimensions);
    console.log(cube);

}

const clearScene = () => {
    for (let i = scene.children.length - 1; i >= 0; i--) {
        if(scene.children[i].type === "Mesh")
            scene.remove(scene.children[i]);
    }
}

// no idea why wtf
const getAxisPoint = (dimension) => {
    let pt = (debug.maxCubeSize / 2) / ( 1 + 1 / (dimension - 1) );
    return new THREE.Vector3(pt, pt, pt);
}

var previousTime = 0;
var frame = 0;

const animate = () => {
    var currentTime = Date.now();
    var dt = currentTime - previousTime;
    previousTime = currentTime;
    let frameRate = parseInt(1000/dt);
    if(debug.logFrameReport) console.log(`Frame ${frame} of Gameloop: dt=${dt}ms and FR=${frameRate}fps`);

    handleKeyPresses();
    handleCameraRotation();
    if(frame > 0) handleCubeRotations(dt/1000);

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
    frame++;
}

const rotationQueue = [];

const faceVector = new Map([
    ['U', new THREE.Vector3(0, -1, 0)],
    ['D', new THREE.Vector3(0, 1, 0)],
    ['L', new THREE.Vector3(1, 0, 0)],
    ['R', new THREE.Vector3(-1, 0, 0)],
    ['F', new THREE.Vector3(0, 0, -1)],
    ['B', new THREE.Vector3(0, 0, 1)],
])
// add matrix logic
const rotateCube = (face, count, times) => {
    if(count > debug.dimensions) return;
    let objects = cube.layers(face, count);
    for(let time = 0; time < times; time++) {
        let rotation = {
            objects,
            start: 0,
            end: Math.PI / 2,
            angle: 0,
            axis: faceVector.get(face.toUpperCase()),
            point: getAxisPoint(cube.dimension),
        }
        rotationQueue.push(rotation);
    }
}

const handleCubeRotations = (dt) => {
    let rotation = rotationQueue[0];
    if(!rotation) return
    if(rotation.angle != rotation.end) {
        let theta = debug.omega * dt;
        let trueTheta = Math.min(rotation.end - rotation.angle, theta);
        rotation.angle += trueTheta;
        rotateAboutAxisAll(
            rotation.objects,
            trueTheta,
            rotation.axis,
            rotation.point
        );
    } else {
        updateMatrix();
        rotationQueue.shift();
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

    layers(face, count) {
        const rotatables = [];
        switch(face.toUpperCase()) {
            case 'U':
                for(let height = 0; height < count; height++) {
                    let cubeHeight = (this.dimension - 1) - height;
                    for(let depth = 0; depth < this.dimension; depth++) {
                        for(let width = 0; width < this.dimension; width++) {
                            let element = this.matrix[cubeHeight][depth][width]
                            if(element) {
                                let cube = element.mesh;
                                rotatables.push(cube);
                            }
                        }
                    }
                }
                return rotatables;
            case 'D':
                for(let height = 0; height < count; height++) {
                    for(let depth = 0; depth < this.dimension; depth++) {
                        for(let width = 0; width < this.dimension; width++) {
                            let element = this.matrix[height][depth][width]
                            if(element) {
                                let cube = element.mesh;
                                rotatables.push(cube);
                            }
                        }
                    }
                }
                return rotatables;
            case 'L':
                for(let width = 0; width < count; width++) {
                    for(let height = 0; height < this.dimension; height++) {
                        for(let depth = 0; depth < this.dimension; depth++) {
                            let element = this.matrix[height][depth][width]
                            if(element) {
                                let cube = element.mesh;
                                rotatables.push(cube);
                            }
                        }
                    }
                }
                return rotatables;
            case 'R':
                for(let width = 0; width < count; width++) {
                    let cubeWidth = (this.dimension - 1) - width;
                    for(let height = 0; height < this.dimension; height++) {
                        for(let depth = 0; depth < this.dimension; depth++) {
                            let element = this.matrix[height][depth][cubeWidth]
                            if(element) {
                                let cube = element.mesh;
                                rotatables.push(cube);
                            }
                        }
                    }
                }
                return rotatables;
            case 'F':
                for(let depth = 0; depth < count; depth++) {
                    let cubeDepth = (this.dimension - 1) - depth;
                    for(let height = 0; height < this.dimension; height++) {
                        for(let width = 0; width < this.dimension; width++) {
                            let element = this.matrix[height][cubeDepth][width]
                            if(element) {
                                let cube = element.mesh;
                                rotatables.push(cube);
                            }
                        }
                    }
                }
                return rotatables;
            case 'B':
                for(let depth = 0; depth < count; depth++) {
                    for(let height = 0; height < this.dimension; height++) {
                        for(let width = 0; width < this.dimension; width++) {
                            let element = this.matrix[height][depth][width]
                            if(element) {
                                let cube = element.mesh;
                                rotatables.push(cube);
                            }
                        }
                    }
                }
                return rotatables;
        }
    }

    findCorner(){}
    findEdge(){}
    findCenter(){}
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
    const material = materialOf(geometry, id, dimension);
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

const updateMatrix = () => {
    console.log('Updating cube matrix')
    const sussyBakas = [];
    cube.matrix.forEach((plate, plateIndex) => {
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
    // console.log(sussyBakas);
    sussyBakas.forEach(sussyBaka => {
        let pos = sussyBaka.mesh.position;
        let height = Math.round(pos.y/debug.maxCubeSize * debug.dimensions);
        let depth = Math.round(pos.z/debug.maxCubeSize * debug.dimensions);
        let width = Math.round(pos.x/debug.maxCubeSize * debug.dimensions);
        cube.matrix[height][depth][width] = sussyBaka;
    })
}

// const rotateMatrix = (face, layers) => {
//     // console.log(face, layers);
//     let dimension = cube.matrix.length;
//     switch(face.toUpperCase()) {
//         case 'U':
//             for(let layer = 0; layer < layers; layer++) {
//                 let cubeLayer = (dimension - 1) - layer;
//                 rotateMatrixAboutCenter(cube.matrix[cubeLayer]);
//             }
//             break;
//         case 'D':
//             for(let layer = 0; layer < layers; layer++) {
//                 rotateMatrixAboutCenterCCW(cube.matrix[layer]);
//             }
//             break;
//         case 'L':
            
//             break;
//         case 'R':
//             let slice = [];
//             for(let height = 0; height < dimension; height++) {
//                 let row = [];
//                 for(let depth = 0; depth < dimension; depth++) {
//                     row.push(cube.matrix[height][depth][dimension - 1])
//                 }
//                 slice.push(row);
//             }

//             // let stuff = clone(slice);
//             // console.log(stuff);
//             // rotateMatrixAboutCenter(slice);
//             // console.log(slice);
//             // // rotateMatrixAboutCenterCCW(slice);
//             // // let stuff = clone(cube.matrix);
//             // copyMatrixToCube(slice, 2);
//             // // console.log(stuff);
//             // // console.log(cube.matrix);
//             break;
//         case 'F':
//             break;
//         case 'B':
//             break;
//     }
// }

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

// const copyMatrixToCube = (matrix, copycat) => {
//     matrix.forEach((row, rowIndex) => {
//         row.forEach((col, colIndex) => {
//             // let pos = matrix[rowIndex][colIndex].identifier.split('');
//             let pos = [rowIndex, colIndex, 2]
//             let duplicateCoordinate = parseInt(matrix[rowIndex][colIndex].identifier.charAt(copycat));
//             console.log(duplicateCoordinate);
//             console.log(`Changing ${rowIndex}${colIndex}${duplicateCoordinate} to ${rowIndex}${colIndex}`)
//             if(copycat == 2) cube.matrix[rowIndex][colIndex][duplicateCoordinate] = matrix[rowIndex][colIndex];
//             if(copycat == 1) cube.matrix[rowIndex][duplicateCoordinate][colIndex] = matrix[rowIndex][colIndex];
//             if(copycat == 0) cube.matrix[duplicateCoordinate][rowIndex][colIndex] = matrix[rowIndex][colIndex];
//         });
//     });
// }

const rotateMatrixAboutCenterCCW = (matrix) => {
    rotateMatrixAboutCenter(matrix);
    rotateMatrixAboutCenter(matrix);
    rotateMatrixAboutCenter(matrix);
}

const shiftArray = (arr, num) => {
    for(let i = 0; i < num; i++) {
        let last = arr.pop();
        arr.unshift(last);
    }
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

// 1R 2L 3U 4D 5F 6B

const materialOf = (geometry, id, dimension) => {

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

const onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

const cameraX = document.querySelector('.camera-x-input');
const cameraY = document.querySelector('.camera-y-input');
const cameraZ = document.querySelector('.camera-z-input');
const cameraStep = document.querySelector('.camera-zoom-input');
const cameraStepMovement = document.querySelector('.camera-rotation-input')
cameraStep.value = debug.cameraMovementStep;
cameraStepMovement.value = debug.cameraRotationStep;

cameraX.oninput = () => camera.position.x = roundTo(cameraX.value, 3);
cameraY.oninput = () => camera.position.y = roundTo(cameraY.value, 3);
cameraZ.oninput = () => camera.position.z = roundTo(cameraZ.value, 3);

const userInput = {
    arrowLeft: false,
    arrowRight: false,
    arrowDown: false,
    arrowUp: false,
}

window.onkeydown = (e) => {
    if(e.key === 'ArrowLeft') userInput.arrowLeft = true;
    if(e.key === 'ArrowRight') userInput.arrowRight = true;
    if(e.key === 'ArrowDown') userInput.arrowDown = true;
    if(e.key === 'ArrowUp') userInput.arrowUp = true;
}

window.onkeyup = (e) => {
    if(e.key === 'ArrowLeft') userInput.arrowLeft = false;
    if(e.key === 'ArrowRight') userInput.arrowRight = false;
    if(e.key === 'ArrowDown') userInput.arrowDown = false;
    if(e.key === 'ArrowUp') userInput.arrowUp = false;
}

const onwheel = (e) => {
    if(e.deltaY > 0) {
        camera.position.z += debug.cameraMovementStep;
    } else if(e.deltaY < 0) {
        camera.position.z -= debug.cameraMovementStep;
    }
}
window.onwheel = onwheel;

const handleKeyPresses = () => {
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

const focusCamera = () => {
    camera.lookAt(new THREE.Vector3(
        midPoint.x,
        midPoint.y,
        midPoint.z
    ))
}

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

const getKey = (map, value) => {
    for(const pair of map) {
        if(pair[1] == value) return pair[0];
    }
}

const roundTo = (number, places) => {
    return Math.floor(number * Math.pow(10, places)) / Math.pow(10, places);
}

// rotate(x).about(y);

cameraStep.oninput = () => {
    debug.cameraMovementStep = parseInt(cameraStep.value);
}
cameraStepMovement.oninput = () => {
    debug.cameraRotationStep = roundTo(cameraStepMovement.value, 3);
}

init();