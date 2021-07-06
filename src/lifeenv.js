import * as THREE from "../node_modules/three/build/three.module"

const DELTA_Z = 0.001;

class LifeEnvironment {

    constructor(lifeScene, cubeStep) {

        this.scene = lifeScene;
        this.cubeStep = cubeStep;

        this.cubeMaterial = new THREE.MeshPhongMaterial({color: 0x000000});

        this.cubes = [];
        this.cells = [];
    }

    toggleCellAt(point){

        console.log("Point of cube: ", point);

        if(point.z > DELTA_Z)
            return;

        let cellOrdinalX = Math.floor(point.x / this.cubeStep);
        let cellOrdinalY = Math.floor(point.y / this.cubeStep);

        let cubePosition = new THREE.Vector3(
            (this.cubeStep / 2) + (this.cubeStep * cellOrdinalX),
            (this.cubeStep / 2) + (this.cubeStep * cellOrdinalY),
            0);
        
        let geom = new THREE.BoxGeometry(this.cubeStep);
        let cubeMesh = new THREE.Mesh(geom, this.cubeMaterial);
        cubeMesh.position.set(cubePosition.x, cubePosition.y, cubePosition.z);
        this.scene.add(cubeMesh);
        this.cubes.push(cubeMesh);
        this.cells.push({i: cellOrdinalX, j: cellOrdinalY});
    }
}

export { LifeEnvironment };