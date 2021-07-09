import * as THREE from "../node_modules/three/build/three.module"

const DELTA_Z = 0.001;
// Simulation step in milliseconds
const DELTA = 200;

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
            let cell = this.createCell(cellOrdinalX, cellOrdinalY);
            this.setCellAt(cellOrdinalX, cellOrdinalY, cell);
        }
    }

    createCell(cellOrdinalX, cellOrdinalY) {
        let cubePosition = new THREE.Vector3(
            (this.cubeStep / 2) + (this.cubeStep * cellOrdinalX),
            (this.cubeStep / 2) + (this.cubeStep * cellOrdinalY),
            0);

        let geom = new THREE.BoxGeometry(this.cubeStep);
        let cubeMesh = new THREE.Mesh(geom, this.cubeMaterial);
        cubeMesh.position.set(cubePosition.x, cubePosition.y, cubePosition.z);
        this.scene.add(cubeMesh);

        let cell = { i: cellOrdinalX, j: cellOrdinalY, cube: cubeMesh, type: 'cell' };
        return cell;
    }

    cellAt(i, j) {

        return this.cells[[i, j]];
    }

    setCellAt(i, j, cell) {

        this.cells[[i, j]] = cell;
        this.cells.length += 1;
    }

    resetCell(cell) {

        if (cell.alreadyRemoved) {
            return;
        }
        this.scene.remove(cell.cube);
        delete this.cells[[cell.i, cell.j]];
        this.cells.length -= 1;
        cell.alreadyRemoved = true;
    }

    evolveNextGeneration() {

        let tick = this.clock.getElapsedTime() * 1000;
        if (tick > this.lastGenerationTick + DELTA) {

            this.lastGenerationTick = this.lastGenerationTick + DELTA;
            this.evolveNextGenerationStep();
        }
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
        for(let i = 0; i < spawns.length; i++){
            let newCell = this.createCell(...spawns[i]);
            this.setCellAt(newCell.i, newCell.j, newCell);
        }
    }

    shouldDie(cell) {

        if (!cell || !cell.type === 'cell')
            return false;

        let liveNeighborsCount = this.countLiveNeighborsAt(cell.i, cell.j);
        return liveNeighborsCount < 2 || liveNeighborsCount > 3;
    }

    shouldSpawnAt(i, j){
        let liveNeighborsCount = this.countLiveNeighborsAt(i, j);
        return liveNeighborsCount === 3;
    }

    countLiveNeighborsAt(i, j){

        let liveNeighborsCount = 0;

        for (let x = -1; x <= 1; x++) {
            for (let y = 1; y >= -1; y--) {
                if (x === 0 && y === 0)
                    continue;
                if (this.cellAt(i + x, j + y)) {
                    liveNeighborsCount++;
                }
            }
        }

        return liveNeighborsCount;
    }


    checkNeighborsForSpawn(cell, spawnLocationsChecked){

        let spawns = [];
        for (let x = -1; x <= 1; x++) {
            for (let y = 1; y >= -1; y--) {
                if (x === 0 && y === 0)
                    continue;
                
                if(this.cellAt(cell.i + x, cell.j + y))
                    continue;
                if(spawnLocationsChecked[[cell.i + x, cell.j + y]]){
                    continue;
                }
                let live = this.countLiveNeighborsAt(cell.i + x, cell.j + y);
                if(live === 3)
                    spawns.push([cell.i + x, cell.j + y]);
                spawnLocationsChecked[[cell.i + x, cell.j + y]] = true;
            }
        }

        return spawns;
    }

    toggleRun() {
        if(this.clock.running){
            this.clock.stop();
        }
        else{
            this.clock = new THREE.Clock();
            this.lastGenerationTick = 0;
            this.clock.start();
        }
    }
}

export { LifeEnvironment };