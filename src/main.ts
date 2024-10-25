import { mat4 } from "gl-matrix";
import { createProgram, createShader, resizeCanvasToDisplaySize } from "./helpers";
import { Shape } from "./models/shape";
import { Position } from "./models/position";

function handleArrowKeys(matrix: mat4) {
    globalThis.onkeydown = e => {
        switch (e.key) {
            case "ArrowDown":
                mat4.translate(matrix, matrix, [0, -0.2, 0]);
                console.log('ArrowDown');
                break;
            case "ArrowUp":
                mat4.translate(matrix, matrix, [0, 0.2, 0]);
                console.log('ArrowUp');
                break;
            case "ArrowLeft":
                mat4.translate(matrix, matrix, [-0.2, 0, 0]);
                console.log('ArrowLeft');
                break;
            case "ArrowRight":
                mat4.translate(matrix, matrix, [0.2, 0, 0]);
                console.log('ArrowRight');
                break;
        }
    };
}

function handleMouseInput(canvas: HTMLCanvasElement, matrix: mat4) {
    let isMoving = false;
    let previousPosition = new Position();

    canvas.addEventListener('mousedown', e => {
        isMoving = true;
        previousPosition = new Position(e.x, e.y);
    });

    canvas.addEventListener('mousemove', e => {
        if (isMoving) {

            // TODO: The speed of the pointer and the translation is somewhat off
            let translationVector = new Position(
                (e.x - previousPosition.x) / 50, // Inverse translation of x
                -(e.y - previousPosition.y) / 50 // Inverse translation of y
            );

            console.log(translationVector);

            mat4.translate(matrix, matrix, [
                translationVector.x,
                translationVector.y,
                0
            ]);
            previousPosition = new Position(e.x, e.y);
        }
    });

    canvas.addEventListener('mouseup', _ => {
        isMoving = false;
    });
}

async function main() {

    let canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
    let gl = canvas.getContext('webgl') as WebGLRenderingContext;

    let [vertexShaderSource, fragmentShaderSource] = await Promise.all([
        fetch("/src/vertex-shader-2d.glsl").then(x => x.text()),
        fetch("/src/fragment-shader-2d.glsl").then(x => x.text())]);

    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    let pyramid = new Shape(
        [
            -0.5, -0.5, 0,   // Vertex 1
            0.5, -0.5, 0,   // Vertex 2
            0.5, 0.5, 0,   // Vertex 3
            -0.5, 0.5, 0,   // Vertex 4
            0, 0, 1    // Apex
        ],
        [
            // Base face
            0, 1, 2,
            0, 2, 3,

            // Side faces
            0, 1, 4,  // Side 1
            1, 2, 4,  // Side 2
            2, 3, 4,  // Side 3
            3, 0, 4   // Side 4
        ]
    );

    if (vertexShader === undefined || fragmentShader === undefined) {
        console.log("Problem with shaders");
        return;
    }

    let program = createProgram(gl, vertexShader, fragmentShader);

    if (program == undefined) {
        console.log("Problem with program");
        return;
    }

    // Initialization
    let modelULocation = gl.getUniformLocation(program, "u_model");
    let viewULocation = gl.getUniformLocation(program, "u_view");
    let projectionULocation = gl.getUniformLocation(program, "u_projection");

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, pyramid.vertexBuffer, gl.STATIC_DRAW);

    let positionIdxBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, positionIdxBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, pyramid.indexBuffer, gl.STATIC_DRAW);

    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    // Setup matrixes
    let projectionMatrix = mat4.create();
    mat4.identity(projectionMatrix);

    let viewMatrix = mat4.create();
    mat4.identity(viewMatrix);

    let modelMatrix = mat4.create();
    mat4.identity(modelMatrix);

    // Set up callbacks
    handleArrowKeys(viewMatrix);
    handleMouseInput(canvas, viewMatrix);

    // Rendering
    const draw = () => {
        resizeCanvasToDisplaySize(canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        gl.uniformMatrix4fv(modelULocation, false, projectionMatrix);
        gl.uniformMatrix4fv(viewULocation, false, viewMatrix);
        gl.uniformMatrix4fv(projectionULocation, false, modelMatrix);

        gl.vertexAttribPointer(positionAttributeLocation,
            3,
            gl.FLOAT,
            false,
            0,
            0);
        gl.enableVertexAttribArray(positionAttributeLocation);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, positionIdxBuffer);

        gl.drawElements(gl.TRIANGLES, pyramid.indexBuffer.length, gl.UNSIGNED_SHORT, 0);

        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);
}

await main();
