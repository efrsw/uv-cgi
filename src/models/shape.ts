import { mat4 } from "gl-matrix";
import { TranslationTransformation } from "./transformations/translationTransformation";
import { RotationTransformation } from "./transformations/rotationTransformation";
import { ScaleTransformation } from "./transformations/scaleTransformation";

export class Shape {
    vertexArray: Float32Array;
    indexArray: Uint16Array;
    modelMatrix: mat4;

    #positionBuffer: WebGLBuffer;
    #positionIdxBuffer: WebGLBuffer;

    constructor(verticies: number[], index: number[], gl: WebGLRenderingContext) {
        this.vertexArray = new Float32Array(verticies);
        this.indexArray = new Uint16Array(index);

        this.modelMatrix = mat4.create();
        [this.#positionBuffer, this.#positionIdxBuffer] = this.#initializeShape(gl);
    }

    scale(vector: ScaleTransformation) {
        mat4.scale(this.modelMatrix, this.modelMatrix, [vector.xUnits, vector.yUnits, vector.zUnits]);
    }

    rotate(vector: RotationTransformation) {
        mat4.rotateX(this.modelMatrix, this.modelMatrix, vector.xRadians);
        mat4.rotateY(this.modelMatrix, this.modelMatrix, vector.yRadians);
        mat4.rotateZ(this.modelMatrix, this.modelMatrix, vector.zRadians);
    }

    translate(vector: TranslationTransformation) {
        mat4.translate(this.modelMatrix, this.modelMatrix, [vector.xUnits, vector.yUnits, vector.zUnits]);
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
}
