export function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    let program = gl.createProgram();
    if (program !== null) {
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        let success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) return program;

        console.log(gl.getProgramInfoLog(program));
    }

    gl.deleteProgram(program);
}

export function createShader(gl: WebGLRenderingContext, type: GLenum, source: string) {
    let shader = gl.createShader(type);

    if (shader !== null) {
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success)
            return shader;

        console.log(gl.getShaderInfoLog(shader));
    }

    gl.deleteShader(shader);
}

export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
    const displayWidth = canvas.width;
    const displayHeight = canvas.height;

    const needResize = canvas.width !== displayWidth ||
        canvas.height !== displayHeight;

    if (needResize) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }

    return needResize;
}
