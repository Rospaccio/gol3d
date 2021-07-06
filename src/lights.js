import * as THREE from "../node_modules/three/build/three.module"

class GoL3DLights {
    constructor(options){
        this.fog = new THREE.Fog(0x111111, 4, 2500);
        this.lights = [];

        let ambientLight = new THREE.AmbientLight(0x404040);
        this.lights.push(ambientLight);

        let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        light.position.set(200, 400, 500);
        this.lights.push(light);

        var light2 = new THREE.DirectionalLight(0xFFFFFF, .6);
        light2.position.set(-400, 200, -300);
        this.lights.push(light2);
    }
}

export { GoL3DLights };