import * as THREE from "../node_modules/three/build/three.module"

const DELTA_Z = 0.001;
// Simulation step in seconds
const DELTA = 5;

class LifeEnvironment {

    constructor(lifeScene, cubeStep) {

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

        if (point.z > DELTA_Z)
            return;

        let cellOrdinalX = Math.floor(point.x / this.cubeStep);
        let cellOrdinalY = Math.floor(point.y / this.cubeStep);

        var existing;
        if (existing = this.cellAt(cellOrdinalX, cellOrdinalY)) {
            this.resetCell(existing);
        }
        else {
            let cubePosition = new THREE.Vector3(
                (this.cubeStep / 2) + (this.cubeStep * cellOrdinalX),
                (this.cubeStep / 2) + (this.cubeStep * cellOrdinalY),
                0);

            let geom = new THREE.BoxGeometry(this.cubeStep);
            let cubeMesh = new THREE.Mesh(geom, this.cubeMaterial);
            cubeMesh.position.set(cubePosition.x, cubePosition.y, cubePosition.z);
            this.scene.add(cubeMesh);

            let cell = { i: cellOrdinalX, j: cellOrdinalY, cube: cubeMesh };
            this.setCellAt(cellOrdinalX, cellOrdinalY, cell);

            // this.cubes.push(cubeMesh);
            // this.cells.push({i: cellOrdinalX, j: cellOrdinalY});
        }
    }

    
    cellAt(i, j) {

        return this.cells[[i, j]];

        // if(this.cells[i] && this.cells[i][j])
        //     return this.cells[i][j];
        // return undefined;
    }

    setCellAt(i, j, cell) {

        this.cells[[i, j]] = cell;
        this.cells.length += 1;

        // if (!this.cells[i]) {
        //     this.cells[i] = [];
        // }
        // if(!this.cells[i][j]){
        //     this.cells[i][j] = null;
        // }

        // this.cells[i][j] = cell;
    }

    resetCell(cell) {

        if (cell.alreadyRemoved) {
            return;
        }
        this.scene.remove(cell.cube);
        delete this.cells[[cell.i, cell.j]];
        this.cells.length -= 1;
        // this.cells[cell.i][cell.j] = null;
        cell.alreadyRemoved = true;
    }

    evolveNextGeneration() {

        if (!this.clock.running)
            this.clock.start();

        let tick = this.clock.getElapsedTime();
        if (tick > this.lastGenerationTick + DELTA) {

            this.lastGenerationTick = this.lastGenerationTick + DELTA;
            this.evolveNextGenerationStep();
        }
    }

    evolveNextGenerationStep() {

        let survivors = [];
        let aboutToDie = [];

        let flattenedCells = [].concat(...this.cells);
        console.log('flat: ', flattenedCells);
        for (let c = 0; c < flattenedCells.length; c++) {
            console.log("flattened cell nr.", c, flattenedCells[c]);
            if (flattenedCells[c] && this.shouldDie(flattenedCells[c])) {
                aboutToDie.push(flattenedCells[c]);
            }
        }

        //  let newSpawns = this.checkNeighborsForSpawn(cell);
        //  survivors.join(newSpawns);

        for (let i = 0; i < aboutToDie.length; i++) {
            this.resetCell(aboutToDie[i]);
        }
    }

    shouldDie(cell) {

        console.log("cell: ", cell);

        if (!cell)
            return false;

        let liveNeighborsCount = 0;

        for (let x = -1; x++; x <= 1) {
            for (let y = 1; y--; y >= -1) {
                if (this.cellAt(cell.i + x, cell.j + y)) {
                    liveNeighborsCount++;
                }
            }
        }
        return liveNeighborsCount <= 2;
    }

}

export { LifeEnvironment };