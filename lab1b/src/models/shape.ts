import { mat3, mat4 } from "gl-matrix";

export class Shape {
    vertexArray: Float32Array;
    indexArray: Uint16Array;
    normalsArray: Float32Array;
    modelMatrix: mat4;

    get normalMatrix() {
        let nm = mat3.create();
        mat3.normalFromMat4(nm, this.modelMatrix);
        return nm;
    }

    #positionBuffer: WebGLBuffer;
    // @ts-ignore
    // Initially I used models with index buffers, but then decided not to
    #positionIdxBuffer: WebGLBuffer = [];
    #normalsBuffer: WebGLBuffer;

    constructor(gl: WebGLRenderingContext,
        vertexArray: number[],
        indexArray: number[],
        normalsArray: number[]) {

        // If shape type is provided, then use my own verticies
        this.vertexArray = new Float32Array(vertexArray);
        this.indexArray = new Uint16Array(indexArray);

        this.normalsArray = new Float32Array(normalsArray);

        this.modelMatrix = mat4.create();

        this.#positionBuffer = this.#bufferPositionData(gl);

        if (this.indexArray.length != 0) {
            this.#positionIdxBuffer = this.#bufferIdxData(gl);
        }

        this.#normalsBuffer = this.#bufferNormalsData(gl);
    }

    draw(gl: WebGLRenderingContext,
        positionAttributeLocation: number,
        normalAttributeLocation: number,
        modelUniformLocation: WebGLUniformLocation | null,
        lightViewSpacePositionLocation: WebGLUniformLocation | null,
        normalULocation: WebGLUniformLocation | null) {

        // Apply model transformation matrix
        gl.uniformMatrix4fv(modelUniformLocation, false, this.modelMatrix);
        gl.uniformMatrix3fv(normalULocation, false, this.normalMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.#positionBuffer);
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionAttributeLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.#normalsBuffer);
        gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(normalAttributeLocation);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertexArray.length / 3);
    }

    drawAxis(gl: WebGLRenderingContext,
        positionAttributeLocation: number,
        colorAttributeLocation: number) {

        // Draw local coordinate axis
        const axisPositions = new Float32Array([
            0, 0, 0,
            3, 0, 0,

            0, 0, 0,
            0, 3, 0,

            0, 0, 0,
            0, 0, 3
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

    #bufferNormalsData(gl: WebGLRenderingContext): WebGLBuffer {
        let normalsBuffer: WebGLBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.normalsArray, gl.STATIC_DRAW);
        return normalsBuffer;
    }
}
