import * as gui from "../node_modules/dat.gui/build/dat.gui.module"

class LifeGui {

    constructor(callbacks) {

        this.callbacks = callbacks;
        this.controller = {
            'Run': false,
            'Time Interval': 200
        }

        this.gui = new gui.GUI();
        let exFolder = this.gui.addFolder("Execution")

        exFolder.add(this.controller, 'Run', 0, 1).onChange(val => this.callbacks.toggleRun());
        exFolder.add(this.controller, 'Time Interval', 50, 1000, 1).listen().onChange(val => this.callbacks.speedChanged(val));
    }
}

export { LifeGui };