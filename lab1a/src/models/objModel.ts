export class ObjModel {
    vertexArray: number[];
    normalsArray: number[];
    texturesArray: number[];

    constructor(vertexArray: number[], normalsArray: number[], texturesArray: number[]) {
        this.vertexArray = vertexArray;
        this.normalsArray = normalsArray;
        this.texturesArray = texturesArray;
    }
}

