import { mat4 } from "gl-matrix";
import { IDrawable } from "./IDrawable";

export class Light implements IDrawable {
    lightMatrix: mat4;

    constructor() {
        this.lightMatrix = mat4.create();
    }

    draw(gl: WebGLRenderingContext,
        positionAttributeLocation: number,
        normalAttributeLocation: number,
        colorAttributeLocation: number,
        modelUniformLocation: WebGLUniformLocation | null,
        normalULocation: WebGLUniformLocation | null): void {
      // We don't need to draw a Camera
    }
}
