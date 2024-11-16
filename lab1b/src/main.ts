import { glMatrix, mat4 } from "gl-matrix";
import { createProgram, createShader, resizeCanvasToDisplaySize } from "./helpers";
import { Shape } from "./models/shape";
import { Position } from "./models/position";
import { Scene } from "./models/scene";
import { Parser } from "./models/parser";

function handleKeyboardKeys(state: Scene) {
    globalThis.onkeydown = e => {
        switch (e.key) {
            case "0":
                state.selectedShapeIdx = Array.from(Array(state.shapes.length), (_, i) => i + 1)
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
                state.selectedShapeIdx = null;
                break;
            case "ArrowDown":
                state.selectedShapeMatricies.forEach(m => mat4.translate(m, m, [0, -0.2, 0]));
                break;
            case "ArrowUp":
                state.selectedShapeMatricies.forEach(m => mat4.translate(m, m, [0, 0.2, 0]));
                break;
            case "ArrowLeft":
                state.selectedShapeMatricies.forEach(m => mat4.translate(m, m, [-0.2, 0, 0]));
                break;
            case "ArrowRight":
                state.selectedShapeMatricies.forEach(m => mat4.translate(m, m, [0.2, 0, 0]));
                break;
            case ",":
                state.selectedShapeMatricies.forEach(m => mat4.translate(m, m, [0, 0, 0.2]));
                break;
            case ".":
                state.selectedShapeMatricies.forEach(m => mat4.translate(m, m, [0, 0, -0.2]));
                break;
            case "i":
                state.selectedShapeMatricies.forEach(m => mat4.rotateX(m, m, glMatrix.toRadian(-10)));
                break;
            case "k":
                state.selectedShapeMatricies.forEach(m => mat4.rotateX(m, m, glMatrix.toRadian(10)));
                break;
            case "o":
                state.selectedShapeMatricies.forEach(m => mat4.rotateY(m, m, glMatrix.toRadian(-10)));
                break;
            case "u":
                state.selectedShapeMatricies.forEach(m => mat4.rotateY(m, m, glMatrix.toRadian(10)));
                break;
            case "l":
                state.selectedShapeMatricies.forEach(m => mat4.rotateZ(m, m, glMatrix.toRadian(-10)));
                break;
            case "j":
                state.selectedShapeMatricies.forEach(m => mat4.rotateZ(m, m, glMatrix.toRadian(10)));
                break;
            case "a":
                state.selectedShapeMatricies.forEach(m => mat4.scale(m, m, [0.9, 1, 1]));
                break;
            case "A":
                state.selectedShapeMatricies.forEach(m => mat4.scale(m, m, [1.1, 1, 1]));
                break;
            case "b":
                state.selectedShapeMatricies.forEach(m => mat4.scale(m, m, [1, 0.9, 1]));
                break;
            case "B":
                state.selectedShapeMatricies.forEach(m => mat4.scale(m, m, [1, 1.1, 1]));
                break;
            case "c":
                state.selectedShapeMatricies.forEach(m => mat4.scale(m, m, [1, 1, 0.9]));
                break;
            case "C":
                state.selectedShapeMatricies.forEach(m => mat4.scale(m, m, [1, 1, 1.1]));
                break;
        }
    };
}

function handleMouseInput(canvas: HTMLCanvasElement, state: Scene) {
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

        state.selectedShapeMatricies.forEach(m => mat4.translate(m, m, [
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
        state.selectedShapeMatricies.forEach(m => mat4.translate(m, m, [0, 0, -0.5 * Math.sign(e.deltaY)]));
    };
}

async function main() {

    let canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
    let gl = canvas.getContext('webgl') as WebGLRenderingContext;

    let [vertexShaderSource, fragmentShaderSource] = await Promise.all([
        fetch("/src/shaders/gouraud/gouraud_vertex_specular.glsl").then(x => x.text()),
        fetch("/src/shaders/gouraud/gouraud_fragment_specular.glsl").then(x => x.text())]);

    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    let state = new Scene([]);
    let parser = new Parser();
    let objects = await parser.parseFiles();

    objects.forEach(o => state.shapes.push(new Shape(gl, o.vertexArray, [], o.normalsArray)));

    // Move shapes to their initial positions
    state.shapes.forEach((s, i) => {
        switch (i) {
            case 0:
                mat4.translate(s.modelMatrix, s.modelMatrix, [-3, 3, 0])
                break;
            case 1:
                mat4.translate(s.modelMatrix, s.modelMatrix, [0, 3, 0])
                break;
            case 2:
                mat4.translate(s.modelMatrix, s.modelMatrix, [3, 3, 0])
                break;
            case 3:
                mat4.translate(s.modelMatrix, s.modelMatrix, [-3, 0, 0])
                break;
            case 4:
                mat4.translate(s.modelMatrix, s.modelMatrix, [0, 0, 0])
                break;
            case 5:
                mat4.translate(s.modelMatrix, s.modelMatrix, [3, 0, 0])
                break;
            case 6:
                mat4.translate(s.modelMatrix, s.modelMatrix, [-3, -3, 0])
                break;
            case 7:
                mat4.translate(s.modelMatrix, s.modelMatrix, [0, -3, 0])
                break;
            case 8:
                mat4.translate(s.modelMatrix, s.modelMatrix, [3, -3, 0])
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
    let lightViewSpacePositionLocation = gl.getUniformLocation(program, "u_lightPosition");
    let normalULocation = gl.getUniformLocation(program, "u_normal");
    let eyeULocation = gl.getUniformLocation(program, "u_eye");

    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    let normalAttributeLocation = gl.getAttribLocation(program, "a_normal");

    // Set up callbacks
    handleKeyboardKeys(state);
    handleMouseInput(canvas, state);

    // Rendering
    const draw = () => {
        resizeCanvasToDisplaySize(canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(141.0 / 255, 153.0 / 255, 174.0 / 255, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        gl.useProgram(program);

        gl.uniformMatrix4fv(viewULocation, false, state.camera.viewMatrix);

        state.draw(gl,
            positionAttributeLocation,
            normalAttributeLocation,
            projectionULocation,
            modelULocation,
            lightViewSpacePositionLocation,
            normalULocation,
            eyeULocation        
        );

        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);
}

await main();
