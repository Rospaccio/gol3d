import * as gui from "../node_modules/dat.gui/build/dat.gui.module"

class LifeGui {

    constructor(callbacks) {

        this.callbacks = callbacks;
        this.controller = {
            'run': false
        }

        this.gui = new gui.GUI();
        let exFolder = this.gui.addFolder("Execution")

        exFolder.add(this.controller, 'run', 0, 1).onChange(val => this.callbacks.toggleRun());
    }
}

export { LifeGui };