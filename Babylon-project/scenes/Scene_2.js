import * as BABYLON from '@babylonjs/core';

export class Scene_2{
    constructor(engine){
        this.scene = new BABYLON.Scene(engine);
        this.camera = this.createCamera();
        this.light = this.createLight();
        
        this.createObjects();
    }

    createCamera() {
        const camera = new BABYLON.UniversalCamera('camera', new BABYLON.Vector3(0, 5, -10), this.scene);
        camera.attachControl(true);
        camera.setTarget(BABYLON.Vector3.Zero());
        return camera;
    }

    createLight() {
        const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.8;
        return light;
    }

    createObjects() {
        const box = BABYLON.MeshBuilder.CreateBox('box', { size: 1 }, this.scene);
        box.material = new BABYLON.StandardMaterial("boxMaterial", this.scene);
        box.material.diffuseColor = BABYLON.Color3.Red();
        box.position = new BABYLON.Vector3(0, 0, 0);
    }

    getScene() {
        return this.scene;
    }
}