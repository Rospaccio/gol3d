import * as THREE from "../node_modules/three/build/three.module"
import { GoL3DScene } from "./scene";
import { Grid } from "./grid";
import { TrackballControls } from "../lib/TrackballControls.js";
import { GoL3DLights } from "./lights";
import { LifeEnvironment } from "./lifeenv";
import * as dat from "../node_modules/dat.gui/build/dat.gui.module"
import { LifeGui } from "./gui";

const golScene = new GoL3DScene();
const golLights = new GoL3DLights();

const scene = golScene.scene;
const camera = golScene.camera;
const renderer = golScene.renderer

document.body.appendChild(renderer.domElement);

golScene.addLights(golLights.lights);

const CUBE_STEP = 1;
const grid = new Grid(CUBE_STEP, 100);
grid.addGridTo(scene);

let controls = new TrackballControls(camera, renderer.domElement);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2()
document.addEventListener('mousemove', onDocumentMouseMove, false);
window.addEventListener('resize', onWindowResize, false);
document.addEventListener('mousedown', onMouseDown, false);

const lifeEnv = new LifeEnvironment(scene, CUBE_STEP);

var running = false;
const gui = new LifeGui({
    toggleRun: function () {
        running = !running;
        lifeEnv.toggleRun();
    },

    speedChanged: function (val) {
        console.log("speed change");
        lifeEnv.deltaTime = val;
    }
});


//
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {

            let cell = lifeEnv.createCell({ i: i, j: j, k: k });
            lifeEnv.setCellAt({i: i, j: j, k: k}, cell);

        }
    }
}
//

const animate = function () {

    requestAnimationFrame(animate);
    controls.update();

    raycaster.setFromCamera(mouse, camera);
    if (running) {
        lifeEnv.evolveNextGeneration();
    }
    renderer.render(scene, camera);
};

animate();

function onMouseDown() {

    let intersections = raycaster.intersectObjects([grid.plane], false);

    if (intersections.length > 0) {
        lifeEnv.toggleCellAt(intersections[0].point);
    }

}

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
