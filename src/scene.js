import * as THREE from "../node_modules/three/build/three.module"
import { TrackballControls } from "../lib/TrackballControls.js";

class GoL3DScene {

    constructor(options) {
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGL1Renderer();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);

        this.camera.position.z = 15;
        this.camera.position.x = 0;
        this.camera.position.y = 0;

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0xeeeeee, 1.0);
    }

    addLights(lights){
        lights.forEach(element => {
            this.scene.add(element);
        });
    }
};

export { GoL3DScene };