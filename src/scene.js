import * as THREE from "../node_modules/three/build/three.module"
import { TrackballControls } from "../lib/TrackballControls.js";
// 
const scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);

camera.position.z = 15;
camera.position.x = -5;
camera.position.y = -5;
// camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setClearColor(0xeeeeee, 1.0);

// const controls = {update: function(){}};
// let controls = new TrackballControls(camera, renderer.domElement);

// controls.rotateSpeed = 1.0;
// controls.zoomSpeed = 1.2;
// controls.panSpeed = 0.8;

// controls.keys = ['KeyA', 'KeyS', 'KeyD'];

export { scene, renderer, camera };