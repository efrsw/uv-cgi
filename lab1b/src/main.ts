import { glMatrix, mat4 } from "gl-matrix";
import { resizeCanvasToDisplaySize } from "./helpers";
import { Shape } from "./models/Shape";
import { Position } from "./models/Position";
import { Scene } from "./models/Scene";
import { Parser } from "./models/Parser";
import { Renderer } from "./models/Renderer";

function handleKeyboardKeys(scene: Scene, renderer: Renderer) {
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
                scene.selectObjectAtIndex = +e.key;
                break;
            case "0":
            case " ":
                scene.selectObjectAtIndex = null;
                break;
            case "L":
                scene.selectLight();
                break;
            case "ArrowDown":
                scene.selectedShapeMatricies.forEach(m => mat4.translate(m, m, [0, -0.2, 0]));
                break;
            case "ArrowUp":
                scene.selectedShapeMatricies.forEach(m => mat4.translate(m, m, [0, 0.2, 0]));
                break;
            case "ArrowLeft":
                scene.selectedShapeMatricies.forEach(m => mat4.translate(m, m, [-0.2, 0, 0]));
                break;
            case "ArrowRight":
                scene.selectedShapeMatricies.forEach(m => mat4.translate(m, m, [0.2, 0, 0]));
                break;
            case ",":
                scene.selectedShapeMatricies.forEach(m => mat4.translate(m, m, [0, 0, 0.2]));
                break;
            case ".":
                scene.selectedShapeMatricies.forEach(m => mat4.translate(m, m, [0, 0, -0.2]));
                break;
            case "i":
                scene.selectedShapeMatricies.forEach(m => mat4.rotateX(m, m, glMatrix.toRadian(-10)));
                break;
            case "k":
                scene.selectedShapeMatricies.forEach(m => mat4.rotateX(m, m, glMatrix.toRadian(10)));
                break;
            case "o":
                scene.selectedShapeMatricies.forEach(m => mat4.rotateY(m, m, glMatrix.toRadian(-10)));
                break;
            case "u":
                scene.selectedShapeMatricies.forEach(m => mat4.rotateY(m, m, glMatrix.toRadian(10)));
                break;
            case "l":
                scene.selectedShapeMatricies.forEach(m => mat4.rotateZ(m, m, glMatrix.toRadian(-10)));
                break;
            case "j":
                scene.selectedShapeMatricies.forEach(m => mat4.rotateZ(m, m, glMatrix.toRadian(10)));
                break;
            case "a":
                scene.selectedShapeMatricies.forEach(m => mat4.scale(m, m, [0.9, 1, 1]));
                break;
            case "A":
                scene.selectedShapeMatricies.forEach(m => mat4.scale(m, m, [1.1, 1, 1]));
                break;
            case "b":
                scene.selectedShapeMatricies.forEach(m => mat4.scale(m, m, [1, 0.9, 1]));
                break;
            case "B":
                scene.selectedShapeMatricies.forEach(m => mat4.scale(m, m, [1, 1.1, 1]));
                break;
            case "c":
                scene.selectedShapeMatricies.forEach(m => mat4.scale(m, m, [1, 1, 0.9]));
                break;
            case "C":
                scene.selectedShapeMatricies.forEach(m => mat4.scale(m, m, [1, 1, 1.1]));
                break;
            case 'w':
                renderer.currentScheme = "g_diff";
                break;
            case 'e':
                renderer.currentScheme = "g_spec";
                break;
            case 'r':
                renderer.currentScheme = "p_diff";
                break;
            case 't':
                renderer.currentScheme = "p_spec";
                break;
        }
    };
}

function handleMouseInput(canvas: HTMLCanvasElement, scene: Scene) {
    let isMoving = false;
    let previousPosition = new Position();

    canvas.addEventListener('mousedown', e => {
        isMoving = true;
        previousPosition = new Position(e.x, e.y);
    });

    canvas.addEventListener('mousemove', e => {
        if (!isMoving) return;

        let translationVector = new Position(
            (e.x - previousPosition.x) / 50, // Inverse translation of x
            -(e.y - previousPosition.y) / 50 // Inverse translation of y
        );

        scene.selectedShapeMatricies.forEach(m => mat4.translate(m, m, [
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
        scene.selectedShapeMatricies.forEach(m => mat4.translate(m, m, [0, 0, -0.5 * Math.sign(e.deltaY)]));
    };
}

async function main() {

    let canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
    let gl = canvas.getContext('webgl') as WebGLRenderingContext;

    let parser = new Parser();
    let scene = new Scene([]);
    let renderer = new Renderer(gl);
    await renderer.initializeShaderPrograms();
    let objects = await parser.parseFiles();

    objects.forEach(o => {
        let defaultColors = Array.from(Array(o.vertexArray.length), _ => [0.0, 1.0, 0.0])
            .flat(1);
        scene.shapes.push(new Shape(renderer.gl, o.vertexArray, defaultColors, o.normalsArray));
    });

    // Move shapes to their initial positions
    scene.shapes.forEach((s, i) => {
        switch (i) {
            case 0:
                mat4.translate(s.modelMatrix, s.modelMatrix, [-3, 3, 0])
                mat4.scale(s.modelMatrix, s.modelMatrix, [6, 6, 6])
                break;
            case 1:
                mat4.translate(s.modelMatrix, s.modelMatrix, [0, 3, 0])
                mat4.scale(s.modelMatrix, s.modelMatrix, [6, 6, 6])
                break;
            case 2:
                mat4.translate(s.modelMatrix, s.modelMatrix, [3, 3, 0])
                mat4.scale(s.modelMatrix, s.modelMatrix, [6, 6, 6])
                break;
            case 3:
                mat4.translate(s.modelMatrix, s.modelMatrix, [-3, 0, 0])
                mat4.scale(s.modelMatrix, s.modelMatrix, [0.25, 0.25, 0.25])
                break;
            case 4:
                mat4.translate(s.modelMatrix, s.modelMatrix, [0, 0, 0])
                mat4.scale(s.modelMatrix, s.modelMatrix, [0.25, 0.25, 0.25])
                break;
            case 5:
                mat4.translate(s.modelMatrix, s.modelMatrix, [3, 0, 0])
                mat4.scale(s.modelMatrix, s.modelMatrix, [0.25, 0.25, 0.25])
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

    // Set up callbacks
    handleKeyboardKeys(scene, renderer);
    handleMouseInput(canvas, scene);

    // Rendering
    const draw = () => {
        resizeCanvasToDisplaySize(canvas);
        renderer.gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        renderer.gl.clearColor(141.0 / 255, 153.0 / 255, 174.0 / 255, 1.0);
        renderer.gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        renderer.gl.enable(gl.DEPTH_TEST);
        renderer.gl.enable(gl.CULL_FACE);
        renderer.gl.cullFace(gl.BACK);

        let program = renderer.shadingSchemes.get(renderer.currentScheme)!;

        renderer.gl.useProgram(program.program);

        renderer.gl.uniformMatrix4fv(program.attributes.viewULocation, false, scene.camera.viewMatrix);

        scene.draw(renderer.gl,
            program.attributes.positionAttributeLocation,
            program.attributes.normalAttributeLocation,
            program.attributes.colorAttributeLocation,
            program.attributes.projectionULocation,
            program.attributes.modelULocation,
            program.attributes.lightPositionULocation,
            program.attributes.normalULocation
        );

        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);
}

await main();

