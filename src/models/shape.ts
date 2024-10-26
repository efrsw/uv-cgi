import { mat4 } from "gl-matrix";

export class Shape {
    vertexArray: Float32Array;
    indexArray: Uint16Array;
    modelMatrix: mat4;

    #positionBuffer: WebGLBuffer;
    #positionIdxBuffer: WebGLBuffer;

    constructor(gl: WebGLRenderingContext, shapeType: ShapeType) {
        switch(shapeType) {
            case 'cube':
                [this.vertexArray, this.indexArray] = this.#createCube();
                break;
            case 'pyramid':
                [this.vertexArray, this.indexArray] = this.#createPyramid();
                break;
        }

        this.modelMatrix = mat4.create();
        [this.#positionBuffer, this.#positionIdxBuffer] = this.#initializeShape(gl);
    }

    scale(vector: Transfomation) {
        mat4.scale(this.modelMatrix, this.modelMatrix, [vector.x, vector.y, vector.z]);
    }

    rotate(vector: Transfomation) {
        mat4.rotateX(this.modelMatrix, this.modelMatrix, vector.x);
        mat4.rotateY(this.modelMatrix, this.modelMatrix, vector.y);
        mat4.rotateZ(this.modelMatrix, this.modelMatrix, vector.z);
    }

    translate(vector: Transfomation) {
        mat4.translate(this.modelMatrix, this.modelMatrix, [vector.x, vector.y, vector.z]);
    }

    draw(gl: WebGLRenderingContext,
        positionAttributeLocation: number,
        modelUniformLocation: WebGLUniformLocation | null) {

        gl.uniformMatrix4fv(modelUniformLocation, false, this.modelMatrix);

        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(positionAttributeLocation);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#positionIdxBuffer);

        gl.drawElements(gl.TRIANGLES, this.indexArray.length, gl.UNSIGNED_SHORT, 0);
    }

    #initializeShape(gl: WebGLRenderingContext): [WebGLBuffer, WebGLBuffer] {
        return [
            this.#bufferPositionData(gl)!,
            this.#bufferIndexData(gl)!
        ];
    }

    #bufferPositionData(gl: WebGLRenderingContext) {
        let positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertexArray, gl.STATIC_DRAW);
        return positionBuffer;
    }

    #bufferIndexData(gl: WebGLRenderingContext) {
        let positionIdxBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, positionIdxBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexArray, gl.STATIC_DRAW);
        return positionIdxBuffer;
    }

    #createCube(): [Float32Array, Uint16Array] {
        return [
            new Float32Array([
                // Front face
                -0.5, -0.5, 0.5,  // Vertex 0
                0.5, -0.5, 0.5,  // Vertex 1
                0.5, 0.5, 0.5,  // Vertex 2
                -0.5, 0.5, 0.5,  // Vertex 3

                // Back face
                -0.5, -0.5, -0.5,  // Vertex 4
                0.5, -0.5, -0.5,  // Vertex 5
                0.5, 0.5, -0.5,  // Vertex 6
                -0.5, 0.5, -0.5,  // Vertex 7

                // Top face
                -0.5, 0.5, 0.5,  // Vertex 8 (re-used)
                0.5, 0.5, 0.5,  // Vertex 9 (re-used)
                0.5, 0.5, -0.5,  // Vertex 10 (re-used)
                -0.5, 0.5, -0.5,  // Vertex 11 (re-used)

                // Bottom face
                -0.5, -0.5, 0.5,  // Vertex 12 (re-used)
                0.5, -0.5, 0.5,  // Vertex 13 (re-used)
                0.5, -0.5, -0.5,  // Vertex 14 (re-used)
                -0.5, -0.5, -0.5,  // Vertex 15 (re-used)

                // Right face
                0.5, -0.5, 0.5,  // Vertex 16 (re-used)
                0.5, 0.5, 0.5,  // Vertex 17 (re-used)
                0.5, 0.5, -0.5,  // Vertex 18 (re-used)
                0.5, -0.5, -0.5,  // Vertex 19 (re-used)

                // Left face
                -0.5, -0.5, 0.5,  // Vertex 20 (re-used)
                -0.5, 0.5, 0.5,  // Vertex 21 (re-used)
                -0.5, 0.5, -0.5,  // Vertex 22 (re-used)
                -0.5, -0.5, -0.5   // Vertex 23 (re-used)
            ]),
            new Uint16Array([
                // Front face
                0, 1, 2, 0, 2, 3,

                // Back face
                4, 5, 6, 4, 6, 7,

                // Top face
                8, 9, 10, 8, 10, 11,

                // Bottom face
                12, 13, 14, 12, 14, 15,

                // Right face
                16, 17, 18, 16, 18, 19,

                // Left face
                20, 21, 22, 20, 22, 23
            ]),
        ]
    }

    #createPyramid(): [Float32Array, Uint16Array] {
        return [
            new Float32Array([
                -0.5, -0.5, 0,   // Vertex 1
                0.5, -0.5, 0,   // Vertex 2
                0.5, 0.5, 0,   // Vertex 3
                -0.5, 0.5, 0,   // Vertex 4
                0, 0, 1    // Apex
            ]),
            new Uint16Array([
                // Base face
                0, 1, 2,
                0, 2, 3,

                // Side faces
                0, 1, 4,  // Side 1
                1, 2, 4,  // Side 2
                2, 3, 4,  // Side 3
                3, 0, 4   // Side 4
            ]),
        ]
    }
}

export type ShapeType =
    | "pyramid"
    | "cube"

export type Transfomation = {
    x: number, 
    y: number,
    z: number
}
