import * as glm from "gl-matrix"

export class Camera {
    eye: glm.vec3;
    viewMatrix: glm.mat4;

    constructor() {
        this.eye = glm.vec3.fromValues(0.0, 0.0, 10.0);
        this.viewMatrix = this.#initViewMatrix(this.eye);
    }

    #initViewMatrix(eye: glm.vec3) {
        const viewMatrix = glm.mat4.create();
        const target = glm.vec3.create();


        glm.vec3.add(target, eye, glm.vec3.fromValues(0, 0, -1));
        glm.mat4.lookAt(viewMatrix, eye, target, [0, 1, 0]);

        return viewMatrix;
    }
}
