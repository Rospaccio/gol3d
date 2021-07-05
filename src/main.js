import * as THREE from "../node_modules/three/build/three.module"
import { scene, renderer, camera } from "./scene";
import { Grid } from "./grid";
import { TrackballControls } from "../lib/TrackballControls.js";

document.body.appendChild(renderer.domElement);

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