import * as THREE from "../node_modules/three/build/three.module"
import { scene } from "./scene";

const lights = {

    init: function (scene) {
        scene.fog = new THREE.Fog(0x111111, 4, 2500);

        // Lights
        var ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        var light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        light.position.set(200, 400, 500);

        var light2 = new THREE.DirectionalLight(0xFFFFFF, .6);
        light2.position.set(-400, 200, -300);

        scene.add(light);
        scene.add(light2);
    }
}

lights.init(scene);

export { lights };