import { mat4 } from "gl-matrix";

export class Shape {
    vertexArray: Float32Array;
    indexArray: Uint16Array;
    colorsArray: Float32Array;
    modelMatrix: mat4;
    shapeType: ShapeType | null = null;

    #positionBuffer: WebGLBuffer;
    #colorsBuffer: WebGLBuffer;
    // @ts-ignore
    // Initially I used models with index buffers, but then decided not to
    #positionIdxBuffer: WebGLBuffer = [];

    constructor(gl: WebGLRenderingContext,
        shapeType: ShapeType | null = null,
        vertexArray: number[] | null = null,
        indexArray: number[] | null = null,
        colorsArray: number[] | null = null) {

        // If shape type is provided, then use my own verticies
        if (shapeType !== null) {
            switch (shapeType) {
                case 'cube':
                    [this.vertexArray, this.indexArray, this.colorsArray] = this.#createCube();
                    break;
                case 'pyramid':
                    [this.vertexArray, this.indexArray, this.colorsArray] = this.#createPyramid();
                    break;
            }
            this.shapeType = shapeType;
        } else {
            this.vertexArray = vertexArray !== null ? new Float32Array(vertexArray) : new Float32Array();
            this.indexArray = indexArray !== null ? new Uint16Array(indexArray) : new Uint16Array();

            if (colorsArray === null) {
                this.colorsArray = new Float32Array(Array.from(Array(this.vertexArray.length),
                    _ => {
                        let randomColor = Math.random();
                        return [randomColor, randomColor, randomColor] // Generate random color for a triangle
                    })
                    .flat(1));
            } else {
                this.colorsArray = new Float32Array(colorsArray);
            }
        }

        this.modelMatrix = mat4.create();

        this.#positionBuffer = this.#bufferPositionData(gl);
        this.#colorsBuffer = this.#bufferColorData(gl);

        if (this.indexArray.length != 0) {
            this.#positionIdxBuffer = this.#bufferIdxData(gl);
        }
    }

    draw(gl: WebGLRenderingContext,
        positionAttributeLocation: number,
        colorAttributeLocation: number,
        modelUniformLocation: WebGLUniformLocation | null) {

        // Apply model transformation matrix
        gl.uniformMatrix4fv(modelUniformLocation, false, this.modelMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.#colorsBuffer);
        gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colorAttributeLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.#positionBuffer);
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionAttributeLocation);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertexArray.length / 3);
    }

    drawAxis(gl: WebGLRenderingContext,
        positionAttributeLocation: number,
        colorAttributeLocation: number) {

        // Draw local coordinate axis
        const axisPositions = new Float32Array([
            0, 0, 0,
            1, 0, 0,

            0, 0, 0,
            0, 1, 0,

            0, 0, 0,
            0, 0, 1
        ]);

        const axisColors = new Float32Array([
            1, 0, 0,
            1, 0, 0,

            0, 1, 0,
            0, 1, 0,

            0, 0, 1,
            0, 0, 1
        ]);

        // Create and bind the buffer for axis positions
        const axisPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, axisPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, axisPositions, gl.STATIC_DRAW);

        // Set attribute pointer for position (axes)
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionAttributeLocation);

        // Create and bind the buffer for axis colors
        const axisColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, axisColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, axisColors, gl.STATIC_DRAW);

        // Set attribute pointer for color (axes)
        gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colorAttributeLocation);

        // Draw the axes as lines
        gl.drawArrays(gl.LINES, 0, 6);
    }

    #bufferPositionData(gl: WebGLRenderingContext): WebGLBuffer {
        let positionBuffer: WebGLBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertexArray, gl.STATIC_DRAW);
        return positionBuffer;
    }

    #bufferIdxData(gl: WebGLRenderingContext): WebGLBuffer {
        let positionIdxBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, positionIdxBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexArray.length, gl.STATIC_DRAW);
        return positionIdxBuffer;
    }

    #bufferColorData(gl: WebGLRenderingContext): WebGLBuffer {
        let colorsBuffer: WebGLBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colorsArray, gl.STATIC_DRAW);
        return colorsBuffer;
    }

    // I made this coordinates myself, but in the process I several times changed the direction of 
    // triangles (CCW/CW), so the comments might be a bit off.
    #createCube(): [Float32Array, Uint16Array, Float32Array] {
        return [
            new Float32Array([
                // Bottom
                // 0-1
                // |/|
                // 7-6             // Vertex number on picture  Vertex index
                -0.5, -0.5, 0.5,   // 0                         0
                -0.5, -0.5, -0.5,  // 7                         1
                0.5, -0.5, 0.5,    // 1                         2

                0.5, -0.5, 0.5,    // 1                         3
                -0.5, -0.5, -0.5,  // 7                         4
                0.5, -0.5, -0.5,   // 6                         5

                // Top
                // 4-5
                // |/|
                // 3-2
                -0.5, 0.5, -0.5,   // 4                         6
                -0.5, 0.5, 0.5,    // 3                         7
                0.5, 0.5, -0.5,    // 5                         8

                0.5, 0.5, 0.5,     // 2                         9
                0.5, 0.5, -0.5,    // 5                         10
                -0.5, 0.5, 0.5,    // 3                         11


                // Right
                // 2-5
                // |/|
                // 1-6
                0.5, 0.5, 0.5,     // 2                         12
                0.5, -0.5, 0.5,    // 1                         13
                0.5, 0.5, -0.5,    // 5                         14


                0.5, -0.5, -0.5,   // 6                         15
                0.5, 0.5, -0.5,    // 5                         16
                0.5, -0.5, 0.5,    // 1                         17

                // Left
                // 4-3
                // |/|
                // 7-0
                -0.5, 0.5, -0.5,   // 4                         18
                -0.5, -0.5, -0.5,  // 7                         19
                -0.5, 0.5, 0.5,    // 3                         20

                -0.5, -0.5, 0.5,   // 0                         21
                -0.5, 0.5, 0.5,    // 3                         22
                -0.5, -0.5, -0.5,  // 7                         23

                // Front
                // 3-2
                // |/|
                // 0-1
                -0.5, 0.5, 0.5,    // 3                         24
                -0.5, -0.5, 0.5,   // 0                         25
                0.5, 0.5, 0.5,     // 2                         26

                0.5, 0.5, 0.5,     // 2                         27
                -0.5, -0.5, 0.5,   // 0                         28
                0.5, -0.5, 0.5,    // 1                         29

                // Back
                // 5-4
                // |/|
                // 6-7
                0.5, -0.5, -0.5,   // 6                         30
                -0.5, 0.5, -0.5,   // 4                         31
                0.5, 0.5, -0.5,    // 5                         32

                -0.5, -0.5, -0.5,  // 7                         33
                -0.5, 0.5, -0.5,   // 4                         34
                0.5, -0.5, -0.5,   // 6                         35
            ]),
            new Uint16Array([]), // Decided to not use indexed arrays, because of color issues
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
                0.5, -0.5, -0.5,  // 2 0
                -0.5, -0.5, 0.5,  // 0 1
                -0.5, -0.5, -0.5, // 3 2

                0.5, -0.5, 0.5,   // 1 3
                -0.5, -0.5, 0.5,  // 0 4
                0.5, -0.5, -0.5,  // 2 5

                // Left face
                //   4
                //  / \
                // 3---0
                0.0, 0.5, 0.0,    // 4 6 
                -0.5, -0.5, -0.5, // 3 7
                -0.5, -0.5, 0.5,  // 0 8

                // Back face
                //   4
                //  / \
                // 2---3
                0.0, 0.5, 0.0,    // 4 9
                0.5, -0.5, -0.5,  // 2 10
                -0.5, -0.5, -0.5, // 3 11

                // Right face
                //   4
                //  / \
                // 1---2
                0.0, 0.5, 0.0,    // 4 12
                0.5, -0.5, 0.5,   // 1 13
                0.5, -0.5, -0.5,  // 2 14

                // Front face
                //   4
                //  / \
                // 0---1
                0.0, 0.5, 0.0,    // 4 15
                -0.5, -0.5, 0.5,  // 0 16
                0.5, -0.5, 0.5,   // 1 17

            ]),
            new Uint16Array([]),
            new Float32Array([
                // Basis
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,

                // Left face
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,

                // Back face
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,

                // Right face
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,
                1.0, 0.0, 1.0,

                // Front face
                1.0, 1.0, 0.0,
                1.0, 1.0, 0.0,
                1.0, 1.0, 0.0,
            ])
        ]
    }
}

export type ShapeType =
    | "pyramid"
    | "cube"
