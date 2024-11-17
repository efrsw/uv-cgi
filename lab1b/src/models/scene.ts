import { mat4, vec3, vec4 } from "gl-matrix";
import { Shape } from "./shape";
import { Camera } from "./camera";

export class Scene {
    shapes: Shape[]
    camera: Camera
    light: Shape

    #projectionMatrix: mat4;
    #selectedShapeIdx: number | null = null;
    #selectedObject: SelectedObject = "world";

    constructor(shapes: Shape[], light: Shape) {
        this.shapes = shapes;
        this.light = light;
        this.#projectionMatrix = mat4.create();
        this.camera = new Camera();

        mat4.perspective(
            this.#projectionMatrix,
            (45 * Math.PI) / 180,
            4 / 3,
            0.1,
            100.0
        );
    }

    set selectObjectAtIndex(selectedIndex: number | null) {
        if (selectedIndex !== null) {
            this.#selectedShapeIdx = selectedIndex - 1; // Indecies in the array are one below the user input
            this.#selectedObject = "object";
        } else {
            this.#selectedShapeIdx = selectedIndex // Assign undefined, which means that camera is selected
            this.#selectedObject = "world";
        }
    }

    selectLight() {
        this.#selectedObject = "light";
        this.#selectedShapeIdx = -1;
    }

    get selectedShapeMatricies() {
        switch(this.#selectedObject) {
            case "object":
                return [this.shapes[this.#selectedShapeIdx!].modelMatrix];
            case "world":
                return [this.camera.viewMatrix];
            case "light":
                return [this.light.modelMatrix];
        }
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

        let lightPos = vec4.create();
        vec4.add(lightPos, lightPos, [0, 10, 0, 0]); // Our starting light position
        vec4.transformMat4(lightPos, lightPos, this.light.modelMatrix); // Light position in the world CS
        gl.uniform4fv(lightPositionULocation, lightPos);

        this.shapes.forEach((shape, idx) => {
            shape.draw(gl,
                positionAttributeLocation,
                normalAttributeLocation,
                colorAttributeLocation,
                modelULocation,
                lightPositionULocation,
                normalULocation);

            if (this.#selectedShapeIdx === idx)
                shape.drawAxis(gl, positionAttributeLocation, normalAttributeLocation); // Pass the color as normal
        });
    }
}

type SelectedObject =
    | "object"
    | "world"
    | "light"

