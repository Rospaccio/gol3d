import * as THREE from "../node_modules/three/build/three.module"

const DELTA_Z = 0.001;
// Simulation step in milliseconds
const DELTA = 200;

class LifeEnvironment {

    constructor(lifeScene, cubeStep) {

        this.deltaTime = DELTA;
        this.scene = lifeScene;
        this.cubeStep = cubeStep;

        this.cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x6610f2 });

        this.cubes = [];
        this.cells = {
            length: 0
        };

        this.clock = new THREE.Clock(false);
        this.lastGenerationTick = 0;
    }

    toggleCellAt(point) {

        let cellOrdinalX = Math.floor(point.x / this.cubeStep);
        let cellOrdinalY = Math.floor(point.y / this.cubeStep);
        let cellOrdinalZ = Math.floor(point.z / this.cubeStep);

        var existing;
        if (existing = this.cellAt(cellOrdinalX, cellOrdinalY, cellOrdinalZ)) {
            this.resetCell(existing);
        }
        else {
            let cell = this.createCell({ i: cellOrdinalX, j: cellOrdinalY, k: cellOrdinalZ });
            this.setCellAt({ i: cellOrdinalX, j: cellOrdinalY, k: cellOrdinalZ }, cell);
        }
    }

    createCell(discretePoint) {
        let cubePosition = new THREE.Vector3(
            (this.cubeStep / 2) + (this.cubeStep * discretePoint.i),
            (this.cubeStep / 2) + (this.cubeStep * discretePoint.j),
            (this.cubeStep / 2) + (this.cubeStep * discretePoint.k));

        let cell = { i: discretePoint.i, j: discretePoint.j, k: discretePoint.k, cubePosition: cubePosition, type: 'cell' };
        return cell;
    }

    cellAt(i, j, k) {

        return this.cells[[i, j, k]];
    }

    setCellAt(discretePoint, cell) {

        this.cells[[discretePoint.i, discretePoint.j, discretePoint.k]] = cell;
        this.cells.length += 1;
    }

    resetCell(cell) {

        if (cell.alreadyRemoved) {
            return;
        }
        delete this.cells[[cell.i, cell.j, cell.k]];
        this.cells.length -= 1;
        cell.alreadyRemoved = true;
    }

    evolveNextGeneration() {

        let tick = this.clock.getElapsedTime() * 1000;
        if (tick > this.lastGenerationTick + this.deltaTime) {

            this.evolveNextGenerationStep();
            this.lastGenerationTick = this.lastGenerationTick + Math.max(this.deltaTime, (this.clock.getElapsedTime() * 1000 - tick));
        }

        this.updateScene();
    }

    evolveNextGenerationStep() {

        let spawns = [];
        let aboutToDie = [];
        let spawnLocationsChecked = {};

        for (let key in this.cells) {
            try {
                let maybeCell = this.cells[key];
                if (maybeCell.type !== 'cell')
                    continue;
                if (this.shouldDie(maybeCell)) {
                    aboutToDie.push(maybeCell);
                }

                let newSpawns = this.checkNeighborsForSpawn(maybeCell, spawnLocationsChecked);
                spawns = spawns.concat(newSpawns);
            }
            catch (e) {
                console.log(e);
                continue;
            }
        }

        for (let i = 0; i < aboutToDie.length; i++) {
            this.resetCell(aboutToDie[i]);
        }
        for (let i = 0; i < spawns.length; i++) {
            console.log("the new spawn:", spawns[i])
            let newCell = this.createCell({ i: spawns[i][0], j: spawns[i][1], k: spawns[i][2] });
            console.log("new cell ", newCell);
            this.setCellAt({ i: newCell.i, j: newCell.j, k: newCell.k }, newCell);
        }
    }

    shouldDie(cell) {

        if (!cell || !cell.type === 'cell')
            return false;

        let liveNeighborsCount = this.countLiveNeighborsAt(cell.i, cell.j, cell.k);
        return liveNeighborsCount < 2 || liveNeighborsCount > 2;
    }

    // shouldSpawnAt(i, j, k) {
    //     let liveNeighborsCount = this.countLiveNeighborsAt(i, j, k);
    //     console.log("should spawn? nr = ", liveNeighborsCount);
    //     return liveNeighborsCount > 7 && liveNeighborsCount < 14;
    // }

    countLiveNeighborsAt(i, j, k) {

        let liveNeighborsCount = 0;

        for (let x = -1; x <= 1; x++) {
            for (let y = 1; y >= -1; y--) {
                for (let z = -1; z <= 1; z++) {
                    if (x === 0 && y === 0 && k === 0)
                        continue;
                    if (this.cellAt(i + x, j + y, k + z)) {
                        liveNeighborsCount++;
                    }
                }
            }
        }

        return liveNeighborsCount;
    }


    checkNeighborsForSpawn(cell, spawnLocationsChecked) {

        let spawns = [];
        for (let x = -1; x <= 1; x++) {
            for (let y = 1; y >= -1; y--) {
                for (let z = -1; z <= 1; z++) {
                    if (x === 0 && y === 0 && z === 0)
                        continue;

                    if (this.cellAt(cell.i + x, cell.j + y, cell.k + z))
                        continue;
                    if (spawnLocationsChecked[[cell.i + x, cell.j + y, cell.k + z]]) {
                        continue;
                    }
                    let live = this.countLiveNeighborsAt(cell.i + x, cell.j + y, cell.k + z);
                    if (live === 3) { //live > 3 && live < 5){
                        console.log("should spawn? nr = ", live);
                        spawns.push([cell.i + x, cell.j + y, cell.k + z]);
                    }
                    spawnLocationsChecked[[cell.i + x, cell.j + y, cell.k + z]] = true;
                }
            }
        }

        return spawns;
    }

    toggleRun() {
        if (this.clock.running) {
            this.clock.stop();
        }
        else {
            this.clock = new THREE.Clock();
            this.lastGenerationTick = 0;
            this.clock.start();
        }
    }

    updateScene() {

        this.cleanScene();

        let geometry = new THREE.BoxGeometry(this.cubeStep);
        let cubeMesh = new THREE.InstancedMesh(geometry, this.cubeMaterial.clone(), this.cells.length);
        let matrix = new THREE.Matrix4();

        let i = 0;
        for (let key in this.cells) {
            let cell = this.cells[key];
            if(!cell.type || cell.type !== 'cell'){
                continue;
            }
            
            // --- Matrix 4
            const position = new THREE.Vector3();
            const rotation = new THREE.Euler();
            const quaternion = new THREE.Quaternion();
            const scale = new THREE.Vector3();

            position.x = cell.cubePosition.x;
            position.y = cell.cubePosition.y;
            position.z = cell.cubePosition.z;

            rotation.x = 0;
            rotation.y = 0;
            rotation.z = 0;

            quaternion.setFromEuler(rotation);

            scale.x = scale.y = scale.z = 1;

            matrix.compose(position, quaternion, scale);

            // ---

            cubeMesh.setMatrixAt(i++, matrix);
            // cubeMesh.position.set(cell.cubePosition.x, cell.cubePosition.y, cell.cubePosition.z);
        }

        this.scene.add(cubeMesh);
    }

    cleanScene() {

        const meshes = [];

        this.scene.traverse(function (object) {
            if (object.isMesh) meshes.push(object);
        });

        for (let i = 0; i < meshes.length; i++) {

            const mesh = meshes[i];
            mesh.material.dispose();
            mesh.geometry.dispose();

            this.scene.remove(mesh);

        }

    }
}

export { LifeEnvironment };