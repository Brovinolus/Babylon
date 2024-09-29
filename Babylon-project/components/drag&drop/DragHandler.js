import * as BABYLON from '@babylonjs/core';

export class DragHandler{
    constructor(mesh, onDragStart = null, onDrag = null, onDragEnd = null){
        this.mesh = mesh;

        this.color = mesh.material.diffuseColor;
        this.dragBehavior = new BABYLON.PointerDragBehavior({dragPlaneNormal: new BABYLON.Vector3(0, 0, 1) });
        this.attachDragBehavior();
        this.onDragEndCallback = null;

        this.onDragStart = onDragStart || this.defaultOnDragStart;
        this.onDrag = onDrag || this.defaultOnDrag;
        this.onDragEnd = onDragEnd || this.defaultOnDragEnd;

        this.setDragEvents();   
    }

    defaultOnDragStart(event) {
        console.log('Dragging started:', event.draggedPoint);
        this.mesh.material.diffuseColor = BABYLON.Color3.Yellow();
        this.mesh.material.alpha = 0.5;  
    }

    defaultOnDrag(event) {
        // console.log('Dragging:', event.draggedPoint);
    }

    defaultOnDragEnd(event) {
        console.log('Dragging ended:', event.draggedPoint);
        this.mesh.material.diffuseColor = this.color;
        this.mesh.material.alpha = 1;

        if (this.onDragEndCallback) {
            this.onDragEndCallback(this.mesh);
        }
    }

    // Set custom or default drag events
    setDragEvents() {
        this.dragBehavior.onDragStartObservable.add((event) => {
            this.onDragStart.call(this, event);
        });

        this.dragBehavior.onDragObservable.add((event) => {
            this.onDrag.call(this, event);
        });

        this.dragBehavior.onDragEndObservable.add((event) => {
            this.onDragEnd.call(this, event);
        });
    }

    attachDragBehavior(){
        this.mesh.addBehavior(this.dragBehavior);
    }

    setOnDragEndCallback(callback) {
        this.onDragEndCallback = callback;
    }

    disableDragging() {
        this.mesh.removeBehavior(this.dragBehavior);
    }
}