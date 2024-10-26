import { mat4, vec3 } from "gl-matrix";

export class Shape {
    vertexArray: Float32Array;
    indexArray: Uint16Array;
    colorsArray: Float32Array;
    modelMatrix: mat4;
    centroid: Coordinates;
    shapeType: ShapeType

    #positionBuffer: WebGLBuffer;

    constructor(gl: WebGLRenderingContext, shapeType: ShapeType) {
        switch (shapeType) {
            case 'cube':
                [this.vertexArray, this.indexArray, this.colorsArray] = this.#createCube();
                break;
            case 'tetrahedron':
                [this.vertexArray, this.indexArray, this.colorsArray] = this.#createPyramid();
                break;
        }
        this.shapeType = shapeType;
        this.centroid = this.#findCentroid();

        this.modelMatrix = mat4.create();
        this.#positionBuffer = this.#bufferPositionData(gl);
    }

    scale(vector: Coordinates) {
        mat4.scale(this.modelMatrix, this.modelMatrix, [vector.x, vector.y, vector.z]);
    }

    rotate(vector: Coordinates) {
        let initialVector = new Float32Array([0, 0, 0]);
        let currentTranslation = new Float32Array([0, 0, 0]);

        mat4.getTranslation(currentTranslation, this.modelMatrix);
        vec3.sub(currentTranslation, initialVector, currentTranslation);

        mat4.translate(this.modelMatrix, this.modelMatrix, currentTranslation);

        mat4.rotateX(this.modelMatrix, this.modelMatrix, vector.x);
        mat4.rotateY(this.modelMatrix, this.modelMatrix, vector.y);
        mat4.rotateZ(this.modelMatrix, this.modelMatrix, vector.z);
    }

    translate(vector: Coordinates) {
        mat4.translate(this.modelMatrix, this.modelMatrix, [vector.x, vector.y, vector.z]);
    }

    draw(gl: WebGLRenderingContext,
        positionAttributeLocation: number,
        colorAttributeLocation: number,
        modelUniformLocation: WebGLUniformLocation | null) {

        // Apply model transformation matrix
        gl.uniformMatrix4fv(modelUniformLocation, false, this.modelMatrix);

        gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colorAttributeLocation);

        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionAttributeLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.#positionBuffer);

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }


    #bufferPositionData(gl: WebGLRenderingContext): WebGLBuffer {
        let positionBuffer: WebGLBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertexArray, gl.STATIC_DRAW);
        return positionBuffer;
    }

    #findCentroid(): Coordinates {
        let sumX = 0, sumY = 0, sumZ = 0;
        const numVertices = this.vertexArray.length / 3;

        for (let i = 0; i < this.vertexArray.length; i += 3) {
            sumX += this.vertexArray[i];
            sumY += this.vertexArray[i + 1];
            sumZ += this.vertexArray[i + 2];
        }

        const centerX = sumX / numVertices;
        const centerY = sumY / numVertices;
        const centerZ = sumZ / numVertices;

        return {
            x: centerX,
            y: centerY,
            z: centerZ
        };
    }

    #createCube(): [Float32Array, Uint16Array, Float32Array] {
        return [
            new Float32Array([
                // Bottom
                // 0-1
                // |/|
                // 7-6
                -0.5, -0.5, -0.5,  // 7 0
                -0.5, -0.5, 0.5,   // 0 1
                0.5, -0.5, 0.5,    // 1 2

                -0.5, -0.5, -0.5,  // 7 3
                0.5, -0.5, 0.5,    // 1 4
                0.5, -0.5, -0.5,   // 6 5

                // Top
                // 4-5
                // |/|
                // 3-2
                -0.5, 0.5, 0.5,    // 3 6
                -0.5, 0.5, -0.5,   // 4 7
                0.5, 0.5, -0.5,    // 5 8

                0.5, 0.5, -0.5,    // 5 9
                0.5, 0.5, 0.5,     // 2 10
                -0.5, 0.5, 0.5,    // 3 11


                // Right
                // 2-5
                // |/|
                // 1-6
                0.5, -0.5, 0.5,    // 1 12
                0.5, 0.5, 0.5,     // 2 13
                0.5, 0.5, -0.5,    // 5 14


                0.5, 0.5, -0.5,    // 5 15
                0.5, -0.5, -0.5,   // 6 16
                0.5, -0.5, 0.5,    // 1 17

                // Left
                // 4-3
                // |/|
                // 7-0
                -0.5, -0.5, -0.5,  // 7 18
                -0.5, 0.5, -0.5,   // 4 19
                -0.5, 0.5, 0.5,    // 3 20

                -0.5, 0.5, 0.5,    // 3 21
                -0.5, -0.5, 0.5,   // 0 22
                -0.5, -0.5, -0.5,  // 7 23

                // Front
                // 3-2
                // |/|
                // 0-1
                -0.5, -0.5, 0.5,   // 0 24
                -0.5, 0.5, 0.5,    // 3 25
                0.5, 0.5, 0.5,     // 2 26

                -0.5, -0.5, 0.5,   // 0 27
                0.5, 0.5, 0.5,     // 2 28
                0.5, -0.5, 0.5,    // 1 29

                // Back
                // 5-4
                // |/|
                // 6-7
                -0.5, 0.5, -0.5,   // 4 30
                0.5, -0.5, -0.5,   // 6 31
                0.5, 0.5, -0.5,    // 5 32

                -0.5, 0.5, -0.5,   // 4 33
                -0.5, -0.5, -0.5,  // 7 34
                0.5, -0.5, -0.5,   // 6 35
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
            new Float32Array([
                // Front face (Red)
                1.0, 0.0, 0.0, // Vertex 0
                1.0, 0.0, 0.0, // Vertex 1
                1.0, 0.0, 0.0, // Vertex 2
                1.0, 0.0, 0.0, // Vertex 3
                1.0, 0.0, 0.0, // Vertex 4
                1.0, 0.0, 0.0, // Vertex 5

                // Right face (Green)
                0.0, 1.0, 0.0, // Vertex 6
                0.0, 1.0, 0.0, // Vertex 7
                0.0, 1.0, 0.0, // Vertex 8
                0.0, 1.0, 0.0, // Vertex 9
                0.0, 1.0, 0.0, // Vertex 10
                0.0, 1.0, 0.0, // Vertex 11

                // Back face (Blue)
                0.0, 0.0, 1.0, // Vertex 12
                0.0, 0.0, 1.0, // Vertex 13
                0.0, 0.0, 1.0, // Vertex 14
                0.0, 0.0, 1.0, // Vertex 15
                0.0, 0.0, 1.0, // Vertex 16
                0.0, 0.0, 1.0, // Vertex 17

                // Left face (Yellow)
                1.0, 1.0, 0.0, // Vertex 18
                1.0, 1.0, 0.0, // Vertex 19
                1.0, 1.0, 0.0, // Vertex 20
                1.0, 1.0, 0.0, // Vertex 21
                1.0, 1.0, 0.0, // Vertex 22
                1.0, 1.0, 0.0, // Vertex 23

                // Bottom face (Cyan)
                0.0, 1.0, 1.0, // Vertex 24
                0.0, 1.0, 1.0, // Vertex 25
                0.0, 1.0, 1.0, // Vertex 26
                0.0, 1.0, 1.0, // Vertex 27
                0.0, 1.0, 1.0, // Vertex 28
                0.0, 1.0, 1.0, // Vertex 29

                // Top face (Magenta)
                1.0, 0.0, 1.0, // Vertex 30
                1.0, 0.0, 1.0, // Vertex 31
                1.0, 0.0, 1.0, // Vertex 32
                1.0, 0.0, 1.0, // Vertex 33
                1.0, 0.0, 1.0, // Vertex 34
                1.0, 0.0, 1.0, // Vertex 35
            ])
        ]
    }

    #createPyramid(): [Float32Array, Uint16Array, Float32Array] {
        return [
            new Float32Array([   // Vertex Data

                // Bottom face
                // 3-2
                // |/|
                // 0-1
                -0.5, 0.0, -0.5, // 0
                -0.5, 0.0, 0.5,  // 3
                0.5, 0.0, 0.5,   // 2

                -0.5, 0.0, -0.5, // 0
                0.5, 0.0, 0.5,   // 2
                0.5, 0.0, -0.5,  // 1

                // Left face
                //   4
                //  / \
                // 3---0
                -0.5, 0.0, 0.5,  // 3
                0.0, 1.0, 0.0,   // 4 
                -0.5, 0.0, -0.5, // 0

                // Back face
                //   4
                //  / \
                // 2---3
                0.5, 0.0, 0.5,   // 2
                0.0, 1.0, 0.0,   // 4 
                -0.5, 0.0, 0.5,  // 3

                // Right face
                //   4
                //  / \
                // 1---2
                0.5, 0.0, -0.5,  // 1
                0.0, 1.0, 0.0,   // 4 
                0.5, 0.0, 0.5,   // 2

                // Front face
                //   4
                //  / \
                // 0---1
                -0.5, 0.0, -0.5, // 0
                0.0, 1.0, 0.0,   // 4 
                0.5, 0.0, -0.5,  // 1

            ]),
            new Uint16Array([
                0, 1, 2,
                0, 2, 3,

                1, 2, 4,
                0, 4, 1,
                0, 3, 4,
                0, 2, 4,
            ]),
            new Float32Array([
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0
            ])
        ]
    }
}

export type ShapeType =
    | "tetrahedron"
    | "cube"

export type Coordinates = {
    x: number,
    y: number,
    z: number
}
