import * as THREE from "../node_modules/three/build/three.module"
import { GoL3DScene } from "./scene";
import { Grid } from "./grid";
import { TrackballControls } from "../lib/TrackballControls.js";
import { GoL3DLights } from "./lights";

const golScene = new GoL3DScene();
const golLights = new GoL3DLights();

const scene = golScene.scene;
const camera = golScene.camera;
const renderer = golScene.renderer

document.body.appendChild(renderer.domElement);

golScene.addLights(golLights.lights);

var grid = new Grid(1, 100);
grid.addGridTo(scene);

const geometry = new THREE.BoxGeometry();
const cMaterial = new THREE.MeshPhongMaterial( { color: 0x22ff44 } );
const cube = new THREE.Mesh( geometry, cMaterial );
cube.position.x = .5;
cube.position.y = .5;
scene.add( cube );

let controls = new TrackballControls(camera, renderer.domElement);

const animate = function () {

    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};

animate();