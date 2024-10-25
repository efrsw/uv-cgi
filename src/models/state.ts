import { mat4 } from "gl-matrix";
import { Shape } from "./shape";
import { Camera } from "./camera";

export class State {
    shapes: Shape[]
    camera: Camera
    projectionMatrix: mat4;

    #selectedShapeIdx: number | undefined;

    constructor(shapes: Shape[]) {
        this.shapes = shapes;
        this.projectionMatrix = mat4.create();
        this.camera = new Camera();

        mat4.perspective(
            this.projectionMatrix,
            (45 * Math.PI) / 180,
            4 / 3,
            0.1,
            100.0
        );
    }

    set selectedShapeIdx(idx: number | undefined) {
        if (idx !== undefined)
            this.#selectedShapeIdx = idx - 1;
        else 
            this.#selectedShapeIdx = idx
    }

    get selectedShapeMatrix() {
        if (this.#selectedShapeIdx !== undefined) {
            return this.shapes[this.#selectedShapeIdx].modelMatrix;
        }

        return this.camera.viewMatrix;
    }

    draw(gl: WebGLRenderingContext,
        positionAttributeLocation: number,
        projectionULocation: WebGLUniformLocation | null,
        modelULocation: WebGLUniformLocation | null) {

        gl.uniformMatrix4fv(projectionULocation, false, this.projectionMatrix);

        for (let shape of this.shapes) {
            shape.draw(gl, positionAttributeLocation, modelULocation);
        }
    }
}
