import { mat4 } from "gl-matrix";
import { Shape } from "./Shape";
import { Camera } from "./Camera";
import { Light } from "./Light";

export class Scene {
    #camera: Camera;
    #light: Light;
    #pacman: Pacman;
    #maze: Shape;
    isSheared: boolean = false;

    readonly #projectionMatrix: mat4;
    readonly #shearedMatrix: mat4;

    constructor(maze: Shape, pacman: Pacman) {
        this.#camera = new Camera();
        this.#light = new Light();

        this.#maze = maze;
        this.#maze.scale([2, 2, 2]);

        this.#pacman = pacman;

        this.#pacman.lowerPart.scale([0.003, 0.003, 0.003]);
        this.#pacman.lowerPart.translate([0, 0.1, 0.0]);

        this.#pacman.upperPart.rotate([180, 0, 0]);
        this.#pacman.upperPart.scale([0.003, 0.003, 0.003]);
        this.#pacman.upperPart.translate([0.0, 0.1, 0.0]);

        this.#projectionMatrix = mat4.create();
        mat4.perspective(
            this.#projectionMatrix,
            (45 * Math.PI) / 180,
            4 / 3,
            0.1,
            100.0
        );

        this.#shearedMatrix = mat4.create();
        mat4.perspective(
            this.#shearedMatrix,
            (45 * Math.PI) / 180,
            4 / 3,
            0.1,
            100.0
        );

        // Setup shear matrix
        let shear = mat4.create();
        shear[4] = 0.15; // Sh(y)
        shear[2] = 0.15; // Sh(z)
        shear[6] = 0.15; // Sh(z)
        mat4.multiply(this.#shearedMatrix, this.#shearedMatrix, shear);
    }

    get pacman() {
        return this.#pacman;
    }

    get maze() {
        return this.#maze;
    }

    get camera() {
        return this.#camera;
    }

    get light() {
        return this.#light;
    }

    get projectionMatrix() {
        if(!this.isSheared) return this.#projectionMatrix;
        else return this.#shearedMatrix;
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
        gl.uniformMatrix4fv(projectionULocation, false, this.projectionMatrix);
        gl.uniformMatrix4fv(lightPositionULocation, false, this.#light.lightMatrix);

        [this.#maze, this.#pacman.lowerPart, this.#pacman.upperPart].forEach((shape) => {
            shape.draw(gl,
                positionAttributeLocation,
                normalAttributeLocation,
                colorAttributeLocation,
                modelULocation,
                normalULocation);

            //shape.drawAxis(gl, positionAttributeLocation, colorAttributeLocation);
        });
    }
}

type Pacman = {
    lowerPart: Shape;
    upperPart: Shape;
}
