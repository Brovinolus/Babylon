import * as BABYLON from '@babylonjs/core';

export class DropZone{
    constructor(dropZone){
        this.dropZone = dropZone;
    }

    checkPlacement(mesh){
        if (!mesh || !this.dropZone || !this.dropZone.metadata) {
            // console.error("Invalid objects provided for placement check.");
            return { isValid: false, reason: "Invalid objects" };
        }
        
        const isIntersect = mesh.intersectsMesh(this.dropZone, false);

        if(isIntersect && mesh.metadata.dropZoneId === this.dropZone.metadata.zoneId){
            mesh.position = this.dropZone.position;
            return { isValid: true };
        }   
        
        return { isValid: false };
    }
}