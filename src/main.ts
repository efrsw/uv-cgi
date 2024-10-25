import { mat4 } from "gl-matrix";
import { createProgram, createShader, resizeCanvasToDisplaySize } from "./helpers";
import { Shape } from "./models/shape";
import { Position } from "./models/position";
import { State } from "./models/state";
import { TranslationTransformation } from "./models/transformations/translationTransformation";
import { ScaleTransformation } from "./models/transformations/scaleTransformation";

function handleKeyboardKeys(state: State) {
    globalThis.onkeydown = e => {
        switch (e.key) {
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                state.selectedShapeIdx = +e.key;
                break;
            case " ":
                state.selectedShapeIdx = undefined;
                break;
            case "ArrowDown":
                mat4.translate(state.selectedShapeMatrix, state.selectedShapeMatrix, [0, -0.2, 0]);
                break;
            case "ArrowUp":
                mat4.translate(state.selectedShapeMatrix, state.selectedShapeMatrix, [0, 0.2, 0]);
                break;
            case "ArrowLeft":
                mat4.translate(state.selectedShapeMatrix, state.selectedShapeMatrix, [-0.2, 0, 0]);
                break;
            case "ArrowRight":
                mat4.translate(state.selectedShapeMatrix, state.selectedShapeMatrix, [0.2, 0, 0]);
                break;
        }
    };
}

function handleMouseInput(canvas: HTMLCanvasElement, state: State) {
    let isMoving = false;
    let previousPosition = new Position();

    canvas.addEventListener('mousedown', e => {
        isMoving = true;
        previousPosition = new Position(e.x, e.y);
    });

    canvas.addEventListener('mousemove', e => {
        if (!isMoving) return;

        // TODO: The speed of the pointer and the translation is somewhat off
        let translationVector = new Position(
            (e.x - previousPosition.x) / 50, // Inverse translation of x
            -(e.y - previousPosition.y) / 50 // Inverse translation of y
        );

        mat4.translate(state.selectedShapeMatrix, state.selectedShapeMatrix, [
            translationVector.x,
            translationVector.y,
            0
        ]);

        previousPosition = new Position(e.x, e.y);
    });

    canvas.addEventListener('mouseup', _ => {
        isMoving = false;
    });

    canvas.onwheel = (e) => {
        mat4.translate(state.selectedShapeMatrix, state.selectedShapeMatrix, [0, 0, -0.5 * Math.sign(e.deltaY)]);
    };
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
        ],
        gl
    );

    let cube = new Shape(
        [
            // Front face
            -0.5, -0.5, 0.5,  // Vertex 0
            0.5, -0.5, 0.5,  // Vertex 1
            0.5, 0.5, 0.5,  // Vertex 2
            -0.5, 0.5, 0.5,  // Vertex 3

            // Back face
            -0.5, -0.5, -0.5,  // Vertex 4
            0.5, -0.5, -0.5,  // Vertex 5
            0.5, 0.5, -0.5,  // Vertex 6
            -0.5, 0.5, -0.5,  // Vertex 7

            // Top face
            -0.5, 0.5, 0.5,  // Vertex 8 (re-used)
            0.5, 0.5, 0.5,  // Vertex 9 (re-used)
            0.5, 0.5, -0.5,  // Vertex 10 (re-used)
            -0.5, 0.5, -0.5,  // Vertex 11 (re-used)

            // Bottom face
            -0.5, -0.5, 0.5,  // Vertex 12 (re-used)
            0.5, -0.5, 0.5,  // Vertex 13 (re-used)
            0.5, -0.5, -0.5,  // Vertex 14 (re-used)
            -0.5, -0.5, -0.5,  // Vertex 15 (re-used)

            // Right face
            0.5, -0.5, 0.5,  // Vertex 16 (re-used)
            0.5, 0.5, 0.5,  // Vertex 17 (re-used)
            0.5, 0.5, -0.5,  // Vertex 18 (re-used)
            0.5, -0.5, -0.5,  // Vertex 19 (re-used)

            // Left face
            -0.5, -0.5, 0.5,  // Vertex 20 (re-used)
            -0.5, 0.5, 0.5,  // Vertex 21 (re-used)
            -0.5, 0.5, -0.5,  // Vertex 22 (re-used)
            -0.5, -0.5, -0.5   // Vertex 23 (re-used)
        ],
        [
            // Front face
            0, 1, 2, 0, 2, 3,

            // Back face
            4, 5, 6, 4, 6, 7,

            // Top face
            8, 9, 10, 8, 10, 11,

            // Bottom face
            12, 13, 14, 12, 14, 15,

            // Right face
            16, 17, 18, 16, 18, 19,

            // Left face
            20, 21, 22, 20, 22, 23
        ],
        gl);

    let state = new State([cube, pyramid]);

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

    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    // Set up callbacks
    handleKeyboardKeys(state);
    handleMouseInput(canvas, state);

    pyramid.translate(new TranslationTransformation(...[-0.5, -0.5, 0]));
    pyramid.scale(new ScaleTransformation(...[0.1, 0.1, 0.1]));
    cube.translate(new TranslationTransformation(...[0.5, 0.5, 0]));
    cube.scale(new ScaleTransformation(...[0.3, 0.3, 0.3]));


    // Rendering
    const draw = () => {
        resizeCanvasToDisplaySize(canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        gl.uniformMatrix4fv(viewULocation, false, state.camera.viewMatrix);

        state.draw(gl, positionAttributeLocation, projectionULocation, modelULocation);

        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);
}

await main();
