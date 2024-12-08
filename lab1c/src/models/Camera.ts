import { mat4, vec3 } from "gl-matrix";

export class Camera {
    viewMatrix;
    eye = vec3.fromValues(0.0, 1, 1.5);

    constructor() {
        this.viewMatrix = this.initViewMatrix(this.eye);
    }

    initViewMatrix(eye: vec3): mat4 {
        const viewMatrix = mat4.create();
        mat4.lookAt(viewMatrix, eye, [0, 0, 0], [0, 1, 0]);

        return viewMatrix;
    }
}

