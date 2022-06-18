const canvas = document.querySelector('.action-canvas');
const ctx = canvas.getContext('2d');

const selectCanvas = document.querySelector('.shape-canvas');
const selectCtx = selectCanvas.getContext('2d');

// selectCanvas.width = 0;
// selectCanvas.height = 0;

const debug = {
    printOnResize: false,
    printFrameNumber: false,
    printMouseLocation: false,
    drawArrowHead: false,
    useRequestAnimatioFrame: true,
    collisionDistance: 0, // distance at which collisions occur
    vectorRatio: 2, // how much of vector is added to dK
    speedFactor: 30, // how much of dK is added to K
    g: 10,
    fps: 60,
    secondsPerCollision: 0,
}

const mouse = {
    click: false,
    x: 0,
    y: 0,
}

const collisionSound = document.createElement('audio');
collisionSound.src = '/audio/collision.mp3';
var physicals = [];
var frame = 0;
var player;

/**
 * First method call
 */

const init = () => {
    window.onresize.apply();
    tests.forEach(test => test.apply());
    player = new Physical(100, 100, 0, 0, 20, 'lime', 1);
    physicals.push(player);
    gameloop();
}

/**
 * Game Loop for each frame
 */

var previousTime = Date.now();
var previousCollision = Date.now();

const gameloop = () => {

    var currentTime = Date.now();
    var elapsedTime = (currentTime - previousTime)/1000;
    previousTime = currentTime;

    if(debug.printFrameNumber) console.log(`Frame ${frame} of Game Loop with dt = ${elapsedTime}`);

    clearCanvas();

    updateAllItems(elapsedTime);
    handleCollisions();
    drawAllItems();

    handleDragVector();

    if(debug.useRequestAnimatioFrame) {
        requestAnimationFrame(gameloop);
    }else {
        setTimeout(() => {
            requestAnimationFrame(gameloop);
        }, 1000 / debug.fps);
    }
    frame++;
}

class Physical {

    constructor(x, y, dx, dy, r, fill, density) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.r = r;
        this.fill = fill;
        this.density = density;
        this.mass = Math.PI * Math.pow(r, 2) * density;
        this.friction = 10;
        // Frictional force deceleration
        // m = p*A = p*pi*r^2
    }

    update(elapsedTime) {
        // this.x += this.dx/debug.speedFactor;
        // this.y += this.dy/debug.speedFactor;
        // this.dx -= (this.friction*debug.g)
        // this.dy -= (this.friction*debug.g);
        this.acceleration = this.dx == 0 || this.dy == 0 ? 0 : -this.friction*debug.g;
        let projection = calculateDeltaVelocity(this.dx, this.dy, this.acceleration);
        this.x += this.dx*elapsedTime; // x = x0 + v*t
        this.y += this.dy*elapsedTime; // y = y0 + v*t
        this.dx += projection.ax*elapsedTime; // vx = v0x + ax*t
        this.dy += projection.ay*elapsedTime; // vy = v0y + ay*t
        this.dx = Math.abs(this.dx) < 1 ? 0 : this.dx;
        this.dy = Math.abs(this.dy) < 1 ? 0 : this.dy;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
    }
    calculateMass() {
        this.mass = this.density * Math.pow(this.r, 2);
    }
}

class Tuple {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    equals(tuple) {
        return this.x === tuple.x && this.y === tuple.y
    }
    str() {
        return `(${this.x}, ${this.y})`;
    }
}

class Interval {
    constructor(x1, x2) {
        this.x1 = Math.min(x1, x2);
        this.x2 = Math.max(x1, x2);
    }
    equals(interval) {
        return this.x1 === interval.x1 && this.x2 === interval.x2;
    }
    intersects(interval) {
        return this.oneWayIntersection(interval) && interval.oneWayIntersection(this);
    }
    oneWayIntersection(interval) {
        return this.x2 >= interval.x1 || this.x1 >= interval.x2;
    }
    str() {
        return `[${this.x1}, ${this.x2}]`;
    }
}

/**
 * @typedef {Object} TerminalVelocity
 * @property {number} dx1_terminal - terminal x velocity of first particle
 * @property {number} dy1_terminal - terminal y velocity of first particle
 * @property {number} dx2_terminal - terminal x velocity of second particle
 * @property {number} dy2_terminal - terminal y velocity of second particle
 */

/** 
 * Calculates terminal velocities in each direction of particles after an ellastic collision
 * Uses Law of Conservation of Kinetic Energy and Law of Conservation of Momentum
 * @param {number} m1 - mass of first particle
 * @param {number} dx1 - x velocity of first particle
 * @param {number} dy1 - y velocity of first particle
 * @param {number} m2 - mass of second particle
 * @param {number} dx2 - x velocity of second particle
 * @param {number} dy2 - y velocity of second particle
 * @returns {TerminalVelocity} - terminal velocities in each direction of each particle
 */
const calculateTerminalVelocity = (m1, dx1, dy1, m2, dx2, dy2) => {

    let dx1_terminal = (dx1*(m1-m2) + dx2*(2*m2))/(m1+m2);
    let dy1_terminal = (dy1*(m1-m2) + dy2*(2*m2))/(m1+m2);
    let dx2_terminal = (dx1*(2*m1) + dx2*(m2-m1))/(m1+m2);
    let dy2_terminal = (dy1*(2*m1) + dy2*(m2-m1))/(m1+m2);

    return {
        dx1_terminal,
        dy1_terminal,
        dx2_terminal,
        dy2_terminal
    }
}

/**
 * Calculates Euclidian distance between two point particles
 * @param {number} x1 - x coordinate of first particle
 * @param {number} y1 - y coordinate of first particle 
 * @param {number} x2 - x coordinate of second particle 
 * @param {number} y2 - y coordinate of second particle 
 * @returns {number} - distance between two points
 */
const calculateDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

/**
 * Calculates acceleration projections given velocity projections
 * @param {number} dx - x velocity of particle 
 * @param {number} dy - y velocity of particle 
 * @param {number} a - acceleration of particle
 */

const calculateDeltaVelocity = (dx, dy, a) => {
    if(dx == 0 && dy == 0) return { ax: 0, ay: 0}
    let ax = a*dx/hypotenuse(dx, dy); // acceleration projection on x axis (cos theta)
    let ay = a*dy/hypotenuse(dx, dy); // acceleration projection on y axis (sin theta)
    return {
        ax,
        ay,
    }
}

const hypotenuse = (x, y) => {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

const playCollisionSound = () => {
    collisionSound.currentTime = 0;
    collisionSound.play();
}

/**
 * Gameloop methods
 */

const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const updateAllItems = (elapsedTime) => {
    physicals.forEach(physical => physical.update(elapsedTime));
}

const handleCollisions = () => {

    // Collisions between particles and walls
    physicals.forEach(physical => {
        if(physical.x - physical.r <= 0 + debug.collisionDistance) {
            playCollisionSound();
            physical.x = physical.r;
            physical.dx = -physical.dx;
        }
        if(physical.x + physical.r >= canvas.width - debug.collisionDistance) {
            playCollisionSound();
            physical.x = canvas.width - physical.r;
            physical.dx = -physical.dx;
        }
        if(physical.y - physical.r <= 0 + debug.collisionDistance) {
            playCollisionSound();
            physical.y = physical.r;
            physical.dy = -physical.dy;
        }
        if(physical.y + physical.r >= canvas.height - debug.collisionDistance) {
            playCollisionSound();
            physical.y = canvas.height - physical.r;
            physical.dy = -physical.dy;
        }
    })

    // Collisions between particles: generate all pairs of physicals method
    let uniqueCollisionPairs = generateUniquePairs(physicals);
    uniqueCollisionPairs.forEach(pair => {
        let firstPhysical = pair.x;
        let secondPhysical = pair.y;

        let distance = calculateDistance(firstPhysical.x, firstPhysical.y, secondPhysical.x, secondPhysical.y);
        if(distance <= firstPhysical.r + secondPhysical.r + debug.collisionDistance) {
            let terminalVelocity = calculateTerminalVelocity(
                firstPhysical.mass,
                firstPhysical.dx,
                firstPhysical.dy,
                secondPhysical.mass,
                secondPhysical.dx,
                secondPhysical.dy
            );
            firstPhysical.dx = terminalVelocity.dx1_terminal;
            firstPhysical.dy = terminalVelocity.dy1_terminal;
            secondPhysical.dx = terminalVelocity.dx2_terminal;
            secondPhysical.dy = terminalVelocity.dy2_terminal;
            firstPhysical.update(0.01);
            firstPhysical.update(0.01);
        }
    })

    // Collisions between particles: handle collisions in grid
}

const drawAllItems = () => {
    physicals.forEach(physical => physical.draw());
}

const handleDragVector = () => {
    if(mouse.click) {
        if(debug.drawArrowHead) {
            drawArrow(ctx, player.x, player.y, mouse.x, mouse.y);
        }else {
            ctx.beginPath();
            ctx.moveTo(player.x, player.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        let velocity = Math.floor(Math.sqrt(Math.pow(player.x - mouse.x, 2) + Math.pow(player.y - mouse.y, 2)));
    }
}

const drawArrow = (context, fromx, fromy, tox, toy) => {
    var headlen = 10; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    context.stroke();
}

/**
 * Document elements
 */

window.onresize = () => {
    canvas.width = parseInt(window.getComputedStyle(canvas).width);
    canvas.height = parseInt(window.getComputedStyle(canvas).height);
    if(debug.printOnResize){
        console.log(`Window Resized to: ${canvas.width} x ${canvas.height}`)
    }
    document.querySelector('.x-selection.max-selection').innerText = canvas.width;
    document.querySelector('.y-selection.max-selection').innerText = canvas.height;
    
    document.querySelector('.x-slider').setAttribute('max', canvas.width);
    document.querySelector('.y-slider').setAttribute('max', canvas.height);

    canvasRect = canvas.getBoundingClientRect();
}

const spawnShapeButton = document.querySelector('.spawn-shape');
spawnShapeButton.onclick = () => {
    const xInput = parseInt(document.querySelector('.x-slider').value);
    const yInput = parseInt(document.querySelector('.y-slider').value);
    const rInput = parseInt(document.querySelector('.r-slider').value);
    var colorInput = document.querySelector('.color-slider').value;

    switch(colorInput) {
        case '1':
            colorInput = 'red';
            break;
        case '2':
            colorInput = 'orange';
            break;
        case '3':
            colorInput = 'yellow';
            break;
        case '4':
            colorInput = 'lime';
            break;
        case '5':
            colorInput = 'cyan';
            break;
        case '6':
            colorInput = 'blue';
            break;
        case '7':
            colorInput = 'purple';
            break;
        case '8':
            colorInput = 'pink';
            break;
        case '9':
            colorInput = 'brown';
            break;
        case '10':
            colorInput = 'black';
            break; 
    }

    console.log(`Spawning Shape with Radius ${rInput} at (${xInput}, ${yInput}) and color ${colorInput}`)
    let phys = new Physical(xInput, yInput, 0, 0, rInput, colorInput, 1);
    physicals.push(phys);
    return phys;
}

var previewedShape;

const previewShapeButton = document.querySelector('.preview-shape');
previewShapeButton.onmousedown = () => {
    previewedShape = spawnShapeButton.onclick.apply();
}
previewShapeButton.onmouseup = () => {
    let index = physicals.indexOf(previewedShape);
    console.log(index);
    console.log(physicals[index]);
    console.log(physicals);
    physicals.splice(index, 1);
    console.log(physicals);
}

var canvasRect = canvas.getBoundingClientRect();

canvas.onmousemove = (e) => {
    mouse.x = parseInt(e.pageX - canvasRect.x)
    mouse.y = parseInt(e.pageY - canvasRect.y)
    if(debug.printMouseLocation) console.log(`Mouse at (${mouse.x}, ${mouse.y})`)
}

const frictionInput = document.querySelector('.friction-input');
const densityInput = document.querySelector('.density-input');
const radiusInput = document.querySelector('.radius-input');
const gravityInput = document.querySelector('.gravity-input');

canvas.onmousedown = (e) => {
    if(!mouseInPhysical()) mouse.click = true;
}

canvas.onmouseup = (e) => {

    let physical = mouseInPhysical();
    if(physical) {
        document.querySelector('.shape-edit').style.display = 'inline-block';
    }else{
        
    }
    if(mouse.click) {
            player.dx = debug.vectorRatio*(mouse.x - player.x);
            player.dy = debug.vectorRatio*(mouse.y - player.y);
        }
    mouse.click = false;
}

const mouseInPhysical = () => {
    for(let i=0; i<physicals.length; i++) {
        let physical = physicals[i];
        let distance = calculateDistance(mouse.x, mouse.y, physical.x, physical.y);
        if(distance <= physical.r) {

            frictionInput.value = physical.friction;
            densityInput.value = physical.density;
            radiusInput.value = physical.r;
            gravityInput.value = debug.g;

            frictionInput.oninput = () => {
                physical.friction = frictionInput.value;
            }
            densityInput.oninput = () => {
                physical.density = densityInput.value;
                physical.calculateMass();
            }
            radiusInput.oninput = () => {
                physical.r = radiusInput.value;
                physical.calculateMass();
            }
            gravityInput.oninput = () => {
                debug.g = gravityInput.value;
            }
            return physical;
        }
    } 
}

/**
 * Testing
 */

class Test {

    // Tests whether interval intersection logic works properly
    static intervalTest = () => {
        let intervals = [];
        for(const x of Array(10).keys()) {
            intervals.push(new Interval(randomInteger(-10, 10), randomInteger(-10, 10)));
        }
        let uniqueIntervalPairs = generateUniquePairs(intervals);
        uniqueIntervalPairs.forEach(pair => {
            console.log(`Interval ${pair.x.str()} ${pair.x.intersects(pair.y) ? 'intersects' : 'does not intersect'} ${pair.y.str()}`)
        })
    }

    // Tests whether two tuples are equal iff their components are equal
    static tupleTest = () => {

    }
}

// Specify which tests to run
const tests = [
    // Test.intervalTest,
    // Test.tupleTest,
]

/**
 * Utility methods
 */

// Generates random integer in [from, to]
const randomInteger = (from, to) => {
    return Math.floor(from + Math.random()*(to-from+1));
}

// Generates unique pairs (tuples) of elements in arr; total 1+...+(n-1) = (n-1)(n-2)/2
const generateUniquePairs = (arr) => {
    let uniquePairs = [];
    for(let i=0; i<arr.length; i++) {
        for(let j=i+1; j<arr.length; j++) {
            uniquePairs.push(new Tuple(arr[i], arr[j]));
        }
    }
    return uniquePairs;
}

init();

