import * as THREE from '/build/three.module.js';

const canvas = document.querySelector('#bg')

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000);
camera.position.z = 40;
scene.add(camera);
const renderer = new THREE.WebGLRenderer({
    canvas,
});

const debug = {
    logFrameReport: false,
    cameraMovementStep: 2,
}

const init = () => {
    window.onresize = onresize;
    onresize();
    onwheel({ deltaY: 0});
    animate();

    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshBasicMaterial({
        color: 0xff00000,
    });
    const box = new THREE.Mesh(geometry, material);
    scene.add(box);
}

var previousTime = 0;
var frame = 0;

const animate = () => {

    var currentTime = Date.now();
    var dt = currentTime - previousTime;
    previousTime = currentTime;
    let frameRate = parseInt(1000/dt);
    if(debug.logFrameReport) console.log(`Frame ${frame} of Gameloop: dt=${dt}ms and FR=${frameRate}fps`)

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
    frame++;
}

const onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
}

const cameraX = document.querySelector('.camera-x-input');
const cameraY = document.querySelector('.camera-y-input');
const cameraZ = document.querySelector('.camera-z-input');
const cameraStep = document.querySelector('.camera-step-input');
cameraStep.value = debug.cameraMovementStep;

const userInput = {
    x: false,
    y: false,
    z: false,
}

window.onkeydown = (e) => {
    if(e.key === 'x') userInput.x = true;
    if(e.key === 'y') userInput.y = true;
    if(e.key === 'z') userInput.z = true;
}

window.onkeyup = (e) => {
    if(e.key === 'x') userInput.x = false;
    if(e.key === 'y') userInput.y = false;
    if(e.key === 'z') userInput.z = false;
}

const onwheel = (e) => {
    if(e.deltaY > 0) {
        if(userInput.x) camera.position.x += debug.cameraMovementStep;
        if(userInput.y) camera.position.y += debug.cameraMovementStep;
        if(userInput.z) camera.position.z += debug.cameraMovementStep;
    } else if(e.deltaY < 0) {
        if(userInput.x) camera.position.x -= debug.cameraMovementStep;
        if(userInput.y) camera.position.y -= debug.cameraMovementStep;
        if(userInput.z) camera.position.z -= debug.cameraMovementStep;
    }
    cameraX.value = camera.position.x;
    cameraY.value = camera.position.y;
    cameraZ.value = camera.position.z;
}
window.onwheel = onwheel;

cameraStep.oninput = () => {
    debug.cameraMovementStep = parseInt(cameraStep.value);
}

init();