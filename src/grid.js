import * as THREE from "../node_modules/three/build/three.module"

class Grid {

    constructor(step, limit) {

        this.initialStep = this.step = step;
        this.initialLimit = this.limit = limit;

        this.xLines = [];
        this.yLines = [];
        this.material = new THREE.LineBasicMaterial({ color: 0x000000 });

        this.buildLineGrid();
    }

    buildLineGrid() {

        var currentLimit = 0;

        while (currentLimit < this.limit) {
            // builds new lines (x, y)
            // adds lines to collections
            var xLineCouple = this.buildXLine(currentLimit);
            var yLineCouple = this.buildYLine(currentLimit);

            this.xLines.push(...xLineCouple);
            this.yLines.push(...yLineCouple);

            currentLimit += this.step;
        }
    }

    buildXLine(currentLimit) {

        const plusPoint = [];
        plusPoint.push(new THREE.Vector3(currentLimit, -this.limit, 0));
        plusPoint.push(new THREE.Vector3(currentLimit, this.limit, 0));
        const plusGeom = new THREE.BufferGeometry().setFromPoints(plusPoint);
        const plusLine = new THREE.Line(plusGeom, this.material);

        const minusPoints = [];
        minusPoints.push(new THREE.Vector3(-currentLimit, -this.limit, 0));
        minusPoints.push(new THREE.Vector3(-currentLimit, this.limit, 0));
        const minusGeom = new THREE.BufferGeometry().setFromPoints(minusPoints);
        const minusLine = new THREE.Line(minusGeom, this.material);

        return [plusLine, minusLine];
    }

    buildYLine(currentLimit) {

        const plusPoint = [];
        plusPoint.push(new THREE.Vector3(-this.limit, currentLimit, 0));
        plusPoint.push(new THREE.Vector3(this.limit, currentLimit, 0));
        const plusGeom = new THREE.BufferGeometry().setFromPoints(plusPoint);
        const plusLine = new THREE.Line(plusGeom, this.material);

        const minusPoints = [];
        minusPoints.push(new THREE.Vector3(-this.limit, -currentLimit, 0));
        minusPoints.push(new THREE.Vector3(this.limit, -currentLimit, 0));
        const minusGeom = new THREE.BufferGeometry().setFromPoints(minusPoints);
        const minusLine = new THREE.Line(minusGeom, this.material);

        return [plusLine, minusLine];
    }

    addGridTo(scene) {
        for (var i = 0; i < this.xLines.length; i++) {
            scene.add(this.xLines[i]);
            scene.add(this.yLines[i]);
        }
    }
}

export { Grid }