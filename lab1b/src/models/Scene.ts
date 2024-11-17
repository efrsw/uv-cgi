import { mat4 } from "gl-matrix";
import { Shape } from "./Shape";
import { Camera } from "./Camera";
import { Light } from "./Light";
import { IDrawable } from "./IDrawable";

export class Scene {
    shapes: Shape[]
    camera: Camera
    light: Light

    #projectionMatrix: mat4;
    #selectedShapeIdx: number | null = null;
    #selectedObject: SelectedObject = "world";

    constructor(shapes: Shape[]) {
        this.shapes = shapes;
        this.camera = new Camera();
        this.light = new Light();

        this.#projectionMatrix = mat4.create();
        mat4.perspective(
            this.#projectionMatrix,
            (45 * Math.PI) / 180,
            4 / 3,
            0.1,
            100.0
        );
    }

    get selectedShapeMatricies() {
        switch (this.#selectedObject) {
            case "object":
                return [this.shapes[this.#selectedShapeIdx!].modelMatrix];
            case "world":
                return [this.camera.viewMatrix];
            case "light":
                return [this.light.lightMatrix];
        }
    }

    set selectObjectAtIndex(selectedIndex: number | null) {
        if (selectedIndex !== null) {
            this.#selectedShapeIdx = selectedIndex - 1; // Indecies in the array are one below the user input
            this.#selectedObject = "object";
        } else {
            this.#selectedShapeIdx = null // Assign null, which means that camera is selected
            this.#selectedObject = "world";
        }
    }

    toggleLight() {
        if (this.#selectedObject === "light") {
            this.#selectedObject = "world";
        } else {
            this.#selectedObject = "light";
        }

        this.#selectedShapeIdx = -1;
    }

    get sceneObjects(): IDrawable[] {
        return [...this.shapes, this.light];
    }

    draw(gl: WebGLRenderingContext,
        positionAttributeLocation: number,
        normalAttributeLocation: number,
        colorAttributeLocation: number,
        projectionULocation: WebGLUniformLocation | null,
        modelULocation: WebGLUniformLocation | null,
        lightPositionULocation: WebGLUniformLocation | null,
        normalULocation: WebGLUniformLocation | null,
    ) {
        gl.uniformMatrix4fv(projectionULocation, false, this.#projectionMatrix);
        gl.uniformMatrix4fv(lightPositionULocation, false, this.light.lightMatrix);

        this.sceneObjects.forEach((shape, idx) => {
            shape.draw(gl,
                positionAttributeLocation,
                normalAttributeLocation,
                colorAttributeLocation,
                modelULocation,
                normalULocation);

            if (shape instanceof Shape && this.#selectedShapeIdx === idx)
                shape.drawAxis(gl, positionAttributeLocation, normalAttributeLocation); // Pass the color as normal
        });
    }
}

type SelectedObject =
    | "object"
    | "world"
    | "light"

