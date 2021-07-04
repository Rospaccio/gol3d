import * as THREE from "../node_modules/three/src/Three"
import { scene, renderer, camera } from "./scene";
import { Grid } from "./grid";

document.body.appendChild(renderer.domElement);

var grid = new Grid(1, 100);
grid.addGridTo(scene);

const lMaterial = new THREE.LineBasicMaterial({ color : 0x000000 });
const points = [new THREE.Vector3(-1, -100, 0), new THREE.Vector3(-1, 100, 0)];
const lGeometry = new THREE.BufferGeometry().setFromPoints(points);
const probeLine = new THREE.Line(lGeometry, lMaterial);

scene.add(probeLine);

const animate = function () {

    requestAnimationFrame(animate);

    renderer.render(scene, camera);
};

animate();