let canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
let gl = canvas.getContext('webgl') as WebGLRenderingContext;

let vertexShaderSource = document.getElementById("vertex-shader-2d") as HTMLScriptElement;
let fragmentShaderSource = document.getElementById("fragment-shader-2d") as HTMLScriptElement;

let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource.text);
let fragmentShader = createShader(gl, gl.VERTEX_SHADER, fragmentShaderSource.text);


if(vertexShader !== undefined && fragmentShader !== undefined) {
    let program = createProgram(gl, vertexShader, fragmentShader);
    // TODO: Continue the tutorial
} else {
    console.log(`Either vertex or fragment shader is undefined. Vertex ${vertexShader}; Fragment ${fragmentShader}`);
}

gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    let program = gl.createProgram();
    if (program !== null) {
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        let success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if(success) return program;

        console.log(gl.getProgramInfoLog(program));
    }

    gl.deleteProgram(program);
}

function createShader(gl: WebGLRenderingContext, type: GLenum, source: string) {
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
