import { mat4 } from "gl-matrix";
import { createProgram, createShader, resizeCanvasToDisplaySize } from "./helpers";

let canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
let gl = canvas.getContext('webgl') as WebGLRenderingContext;

let [vertexShaderSource, fragmentShaderSource] = await Promise.all([
    fetch("/src/vertex-shader-2d.glsl").then(x => x.text()),
    fetch("/src/fragment-shader-2d.glsl").then(x => x.text())]);

let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
let positions = [
    0, 0.5, 0,
    -0.5, -0.5, 0,
    0.5, -0.5, 0
];

if (vertexShader !== undefined && fragmentShader !== undefined) {
    let program = createProgram(gl, vertexShader, fragmentShader);

    if (program !== undefined) {

        // Initialization
        let projectionULoc = gl.getUniformLocation(program, "u_projection");
        let viewULoc = gl.getUniformLocation(program, "u_view");
        let worldULoc = gl.getUniformLocation(program, "u_world");

        let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        let positionBuffer = gl.createBuffer(); // Could be null if new buffers cannot be created
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); // Stores information about verticies
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        // Rendering
        resizeCanvasToDisplaySize(canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        let projectionM = mat4.create();
        mat4.identity(projectionM);
        gl.uniformMatrix4fv(projectionULoc, false, projectionM);

        let viewM = mat4.create();
        mat4.identity(viewM);
        gl.uniformMatrix4fv(viewULoc, false, viewM);

        let worldM = mat4.create();
        mat4.identity(worldM);
        gl.uniformMatrix4fv(worldULoc, false, worldM);

        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        gl.vertexAttribPointer(positionAttributeLocation,
            3,
            gl.FLOAT,
            false,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0);

        gl.drawArrays(gl.TRIANGLES, 0, 3);

    } else {
        console.log(`Program was not created successfully. Program: ${program}`);
    }

} else {
    console.log(`Either vertex or fragment shader is undefined. Vertex ${vertexShader}; Fragment ${fragmentShader}`);
}

