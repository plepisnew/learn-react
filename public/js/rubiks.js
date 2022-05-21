import * as THREE from '/build/three.module.js';

const canvas = document.querySelector('#bg');
canvas.width = 200;
canvas.height = 200;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    canvas,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshBasicMaterial({
    color: 0xFF6347,
    wireframe: true,
});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

const animate = () => {
    renderer.render(scene, camera);
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;
    torus.rotation.z += 0.01;
    requestAnimationFrame(animate);
}

animate();