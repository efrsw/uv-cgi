/**
 * Represents a list of attributes from the shader
 */
export type AttributeCollection = {
    positionAttributeLocation: number;
    normalAttributeLocation: number;
    colorAttributeLocation: number;
    viewULocation: WebGLUniformLocation | null;
    projectionULocation: WebGLUniformLocation | null;
    modelULocation: WebGLUniformLocation | null;
    lightPositionULocation: WebGLUniformLocation | null;
    normalULocation: WebGLUniformLocation | null;
};

