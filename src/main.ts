import { mat4 } from "gl-matrix";
import { createProgram, createShader, resizeCanvasToDisplaySize } from "./helpers";
import { Shape } from "./models/shape";
import { Position } from "./models/position";
import { State } from "./models/state";

function handleKeyboardKeys(state: State) {
    globalThis.onkeydown = e => {
        switch (e.key) {
            case "0":
                state.selectedShapeIdx = Array.from(Array(10), (_, i) => i + 1)
                break;
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                state.selectedShapeIdx = [+e.key];
                break;
            case " ":
                state.selectedShapeIdx = undefined;
                break;
            case "ArrowDown":
                state.selectedShapeMatrix.forEach(m => mat4.translate(m, m, [0, -0.2, 0]));
                break;
            case "ArrowUp":
                state.selectedShapeMatrix.forEach(m => mat4.translate(m, m, [0, 0.2, 0]));
                break;
            case "ArrowLeft":
                state.selectedShapeMatrix.forEach(m => mat4.translate(m, m, [-0.2, 0, 0]));
                break;
            case "ArrowRight":
                state.selectedShapeMatrix.forEach(m => mat4.translate(m, m, [0.2, 0, 0]));
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

        state.selectedShapeMatrix.forEach(m => mat4.translate(m, m, [
                translationVector.x,
                translationVector.y,
                0
            ]));

        previousPosition = new Position(e.x, e.y);
    });

    canvas.addEventListener('mouseup', _ => {
        isMoving = false;
    });

    canvas.onwheel = (e) => {
        state.selectedShapeMatrix.forEach(m => mat4.translate(m, m, [0, 0, -0.5 * Math.sign(e.deltaY)]));
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

    // Fill the state with pyramids and cubes
    let state = new State(Array.from(Array(9),
        (_, i) => i % 2 === 0 ? new Shape(gl, 'cube') : new Shape(gl, 'pyramid')));

    // Warning: Branch misprediction incoming
    state.shapes.forEach((s, i) => {
        switch (i) {
            case 0:
                s.translate({ x: -3, y: 3, z: 0 });
                break;
            case 1:
                s.translate({ x: 0, y: 3, z: 0 });
                break;
            case 2:
                s.translate({ x: 3, y: 3, z: 0 });
                break;
            case 3:
                s.translate({ x: -3, y: 0, z: 0 });
                break;
            case 4:
                s.translate({ x: 0, y: 0, z: 0 });
                break;
            case 5:
                s.translate({ x: 3, y: 0, z: 0 });
                break;
            case 6:
                s.translate({ x: -3, y: -3, z: 0 });
                break;
            case 7:
                s.translate({ x: 0, y: -3, z: 0 });
                break;
            case 8:
                s.translate({ x: 3, y: -3, z: 0 });
                break;
            default:
                break;
        }
    });

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
