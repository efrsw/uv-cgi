export interface IDrawable {
    draw(gl: WebGLRenderingContext,
        positionAttributeLocation: number,
        normalAttributeLocation: number,
        colorAttributeLocation: number,
        modelUniformLocation: WebGLUniformLocation | null,
        normalULocation: WebGLUniformLocation | null): void
}
