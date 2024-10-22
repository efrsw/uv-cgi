import { createProgram, createShader, resizeCanvasToDisplaySize } from "./helpers";

let canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
let gl = canvas.getContext('webgl') as WebGLRenderingContext;

let [vertexShaderSource, fragmentShaderSource] = await Promise.all([
    fetch("/src/vertex-shader-2d.glsl").then(x => x.text()),
    fetch("/src/fragment-shader-2d.glsl").then(x => x.text())]);

let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
let positions = [
    0, 0.5,
    -0.5, -0.5,
    0.5, -0.5,
];

if (vertexShader !== undefined && fragmentShader !== undefined) {
    let program = createProgram(gl, vertexShader, fragmentShader);

    if (program !== undefined) {
        let positionAttributeLocation = gl.getAttribLocation(program, "vertex_position");
        let positionBuffer = gl.createBuffer(); // Could be null if new buffers cannot be created
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); // Stores information about verticies
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        resizeCanvasToDisplaySize(canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);
        gl.enableVertexAttribArray(positionAttributeLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        let size = 2
        let type = gl.FLOAT;
        let normalize = false;
        let stride = 0;
        let offset = 0;
        gl.vertexAttribPointer(positionAttributeLocation,
            size,
            type,
            normalize,
            stride,
            offset);

        let primitiveType = gl.TRIANGLES;
        let count = 3;
        gl.drawArrays(primitiveType, offset, count);
    } else {
        console.log(`Program was not created successfully. Program: ${program}`);
    }

} else {
    console.log(`Either vertex or fragment shader is undefined. Vertex ${vertexShader}; Fragment ${fragmentShader}`);
}

