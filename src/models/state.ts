import { mat4 } from "gl-matrix";
import { Shape } from "./shape";
import { Camera } from "./camera";

export class State {
    shapes: Shape[]
    camera: Camera
    projectionMatrix: mat4;

    #selectedShapeIdx: Set<number> | undefined;

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

    set selectedShapeIdx(selectedIndex: number[] | undefined) {
        if (selectedIndex !== undefined)
            this.#selectedShapeIdx = new Set([...selectedIndex.map(i => i - 1)]); // Indecies in the array are one below the user input
        else 
            this.#selectedShapeIdx = selectedIndex // Assign undefined, which means that camera is selected
    }

    get selectedShapeMatricies() {
        if (this.#selectedShapeIdx !== undefined) {
            return this.shapes
                .filter((_, idx) => this.#selectedShapeIdx!.has(idx))
                .map(x => x.modelMatrix);

        }

        return [this.camera.viewMatrix];
    }

    draw(gl: WebGLRenderingContext,
        positionAttributeLocation: number,
        colorAttributeLocation: number,
        projectionULocation: WebGLUniformLocation | null,
        modelULocation: WebGLUniformLocation | null) {

        gl.uniformMatrix4fv(projectionULocation, false, this.projectionMatrix);

        this.shapes.forEach((shape, idx) => {
            shape.draw(gl, positionAttributeLocation, colorAttributeLocation, modelULocation);
            if (this.#selectedShapeIdx?.has(idx)) 
                shape.drawAxis(gl, positionAttributeLocation, colorAttributeLocation);
        });
    }
}
