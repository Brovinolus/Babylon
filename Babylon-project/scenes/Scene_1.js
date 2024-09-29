import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import {DragHandler} from '../components/drag&drop/DragHandler';
import {DropZone} from '../components/drag&drop/DropZone';

export class Scene_1{
    constructor(engine, onCreateScene2){
        this.onCreateScene2 = onCreateScene2;

        this.boxSet = false;
        this.sphereSet = false;
        this.cylinderSet = false;

        this.dropZones = [];
        this.dragObjects = [];
        this.boxSound = null;
        this.sphereSound = null;
        this.cylinderSound = null;
        this.allObjectsSetSound = null;

        this.scene = new BABYLON.Scene(engine);
        this.camera = this.createCamera();
        this.light = this.createLight();
        
        this.setSounds();
        this.createObjects();
        this.setDragObjects();
        this.unlockSounds();
    }

    unlockSounds(){
        document.addEventListener('click', function() {
            if (!BABYLON.Engine.audioEngine.isUnlocked) {
                BABYLON.Engine.audioEngine.unlock();
                console.log("Audio Engine Unlocked");
            }
        });
    }

    createCamera() {
        const camera = new BABYLON.UniversalCamera('camera', new BABYLON.Vector3(0, 5, -10), this.scene);
        //camera.attachControl(true);
        camera.setTarget(BABYLON.Vector3.Zero());
        return camera;
    }

    createLight() {
        const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.8;
        return light;
    }

    createObjects() {
        // drop zones
        const boxDropZone = BABYLON.MeshBuilder.CreateBox("container", { height: 0.5, width: 2, depth: 2 }, this.scene);
        boxDropZone.material = new BABYLON.StandardMaterial("containerMaterial", this.scene);
        boxDropZone.material.diffuseColor = BABYLON.Color3.Red();
        boxDropZone.position = new BABYLON.Vector3(-2, -2, 0);
        boxDropZone.metadata = { zoneId: 'boxDropZone' };
        this.dropZones.push(boxDropZone);

        const sphereDropZone = BABYLON.MeshBuilder.CreateBox("container", { height: 0.5, width: 2, depth: 2 }, this.scene);
        sphereDropZone.material = new BABYLON.StandardMaterial("containerMaterial", this.scene);
        sphereDropZone.material.diffuseColor = BABYLON.Color3.Green();
        sphereDropZone.position = new BABYLON.Vector3(0, -2, 0);
        sphereDropZone.metadata = { zoneId: 'sphereDropZone' };
        this.dropZones.push(sphereDropZone);
        
        const cylinderDropZone = BABYLON.MeshBuilder.CreateBox("container", { height: 0.5, width: 2, depth: 2 }, this.scene);
        cylinderDropZone.material = new BABYLON.StandardMaterial("containerMaterial", this.scene);
        cylinderDropZone.material.diffuseColor = BABYLON.Color3.Blue();
        cylinderDropZone.position = new BABYLON.Vector3(2, -2, 0);
        cylinderDropZone.metadata = { zoneId: 'cylinderDropZone' };
        this.dropZones.push(cylinderDropZone);

        // drag objects
        const box = BABYLON.MeshBuilder.CreateBox('box', { size: 1 }, this.scene);
        box.material = new BABYLON.StandardMaterial("boxMaterial", this.scene);
        box.material.diffuseColor = BABYLON.Color3.Red();
        box.position = new BABYLON.Vector3(-2, 0, 0);
        box.metadata = { dropZoneId: 'boxDropZone' };
        this.dragObjects.push(box);

        const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 1 }, this.scene);
        sphere.material = new BABYLON.StandardMaterial("sphereMaterial", this.scene);
        sphere.material.diffuseColor = BABYLON.Color3.Green();
        sphere.position = new BABYLON.Vector3(0, 0, 0);
        sphere.metadata = { dropZoneId: 'sphereDropZone' };
        this.dragObjects.push(sphere);

        const cylinder = BABYLON.MeshBuilder.CreateCylinder('cylinder', { height: 1, diameter: 1 }, this.scene);
        cylinder.material = new BABYLON.StandardMaterial("cylinderMaterial", this.scene);
        cylinder.material.diffuseColor = BABYLON.Color3.Blue();
        cylinder.position = new BABYLON.Vector3(2, 0, 0);
        cylinder.metadata = { dropZoneId: 'cylinderDropZone' };
        this.dragObjects.push(cylinder);
    }

    setDragObjects(){
        this.dragObjects.forEach(dragObject => {

            const dragHandler = new DragHandler(dragObject);

            dragHandler.setOnDragEndCallback((draggedObject) => {
                this.dropZones.forEach(dropZone => {
                    const dropObj = new DropZone(dropZone);
                    const placementCheck = dropObj.checkPlacement(draggedObject);
                    if (placementCheck.isValid) {
                        dragHandler.disableDragging();
                        this.dragObjectsInPosition(draggedObject.metadata.dropZoneId);
                        console.log(draggedObject.metadata.dropZoneId);
                    }
                });
            });
        });
    }

    setSounds(){
        this.boxSound = new BABYLON.Sound("box", "../sounds/box.wav", this.scene, null, {
            loop: false,
            autoplay: false,
            volume: 0.5
        });
        this.sphereSound = new BABYLON.Sound("sphere", "../sounds/sphere.wav", this.scene, null, {
            loop: false,
            autoplay: false,
            volume: 0.5
        });
        this.cylinderSound = new BABYLON.Sound("cylinder", "../sounds/cylinder.wav", this.scene, null, {
            loop: false,
            autoplay: false,
            volume: 0.5
        });
        this.allObjectsSetSound = new BABYLON.Sound("allSet", "../sounds/allSet.wav", this.scene, null, {
            loop: false,
            autoplay: false,
            volume: 0.5
        });
    }

    dragObjectsInPosition(setObjectName){
        switch (setObjectName) {
            case 'boxDropZone':  
                this.boxIsSet();
                break;

            case 'sphereDropZone':
                this.sphereIsSet();
                break;

            case 'cylinderDropZone':
                this.cylinderIsSet();
                break;
        
            default:
                break;
        }

        this.checkDragObjects();
    }

    boxIsSet(){
        this.boxSound.play();
        this.boxSet = true; 
    }

    sphereIsSet(){
        this.sphereSound.play();
        this.sphereSet = true;
    }

    cylinderIsSet(){
        this.cylinderSound.play();
        this.cylinderSet = true;
    }

    checkDragObjects(){
        if(this.boxSet && this.sphereSet && this.cylinderSet){
            this.allObjectsSet();
        }
    }

    allObjectsSet()
    {
        const wheels = BABYLON.SceneLoader.ImportMesh(
            '',
            'assets/',
            'wheel.glb',
            this.scene,
            (meshes) => {
                meshes.forEach(mesh => {
                    mesh.rotation.y = Math.PI / 2;
                    mesh.position = new BABYLON.Vector3(0, 0, 2);
                    this.wheelsAnimation(mesh);
                });
            }, () => {
                setTimeout(() => {
                    console.log("timer...");
                    this.onCreateScene2();
                }, 5000);
            }
        );
        this.allObjectsSetSound.play();
    }

    wheelsAnimation(wheels){
        const animation = new BABYLON.Animation(
            "wheelsRotation",
            "rotation.x",
            30,           
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );

        const keyFrames = [
            { frame: 0, value: 0 },          
            { frame: 100, value: Math.PI * 2 }
        ];

        animation.setKeys(keyFrames);

        wheels.animations.push(animation);

        this.scene.beginAnimation(wheels, 0, 100, false, 1.0);
    }

    getScene() {
        return this.scene;
    }
}