import * as THREE from "../node_modules/three/src/Three"

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.z = 15;
camera.position.x = 0;
camera.position.y = 0;
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setClearColor(0xeeeeee, 1.0);

export { scene, renderer, camera };