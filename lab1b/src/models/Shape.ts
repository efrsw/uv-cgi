import { mat3, mat4 } from "gl-matrix";
import { IDrawable } from "./IDrawable";

export class Shape implements IDrawable {
    vertexArray: Float32Array;
    colorArray: Float32Array;
    normalsArray: Float32Array;
    modelMatrix: mat4;

    #positionBuffer: WebGLBuffer;
    #normalsBuffer: WebGLBuffer;
    #colorBuffer: WebGLBuffer;

    constructor(gl: WebGLRenderingContext,
        vertexArray: number[],
        colorArray: number[],
        normalsArray: number[]) {

        this.vertexArray = new Float32Array(vertexArray);
        this.colorArray = new Float32Array(colorArray);
        this.normalsArray = new Float32Array(normalsArray);

        this.modelMatrix = mat4.create();

        this.#positionBuffer = this.#bufferPositionData(gl);
        this.#colorBuffer = this.#bufferColorData(gl);
        this.#normalsBuffer = this.#bufferNormalsData(gl);
    }

    get normalMatrix() {
        let nm = mat3.create();
        mat3.normalFromMat4(nm, this.modelMatrix);
        return nm;
    }

    draw(gl: WebGLRenderingContext,
        positionAttributeLocation: number,
        normalAttributeLocation: number,
        colorAttributeLocation: number,
        modelUniformLocation: WebGLUniformLocation | null,
        normalULocation: WebGLUniformLocation | null) {

        // Apply model transformation matrix
        gl.uniformMatrix4fv(modelUniformLocation, false, this.modelMatrix);
        gl.uniformMatrix3fv(normalULocation, false, this.normalMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.#positionBuffer);
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionAttributeLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.#colorBuffer);
        gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colorAttributeLocation);

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

    #bufferColorData(gl: WebGLRenderingContext): WebGLBuffer {
        let colorBuffer: WebGLBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colorArray, gl.STATIC_DRAW);
        return colorBuffer;
    }

    #bufferNormalsData(gl: WebGLRenderingContext): WebGLBuffer {
        let normalsBuffer: WebGLBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.normalsArray, gl.STATIC_DRAW);
        return normalsBuffer;
    }
}
