export class Shape {
    vertexBuffer: Float32Array;
    indexBuffer: Uint16Array;

    constructor(verticies: number[], index: number[]) {
        this.vertexBuffer = new Float32Array(verticies);
        this.indexBuffer = new Uint16Array(index); 
    }
}
