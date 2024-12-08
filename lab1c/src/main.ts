import { mat4 } from "gl-matrix";
import { resizeCanvasToDisplaySize } from "./helpers";
import { Scene } from "./models/Scene";
import { Parser } from "./models/Parser";
import { Renderer } from "./models/Renderer";

function handleKeyboardKeys(s: Scene) {
    globalThis.onkeydown = e => {
        switch (e.key) {
            case "ArrowDown":
                s.pacman.upperPart.translate([0, 0, 0.2]);
                s.pacman.lowerPart.translate([0, 0, 0.2]);
                // s.pacman.upperPart.currentRotation.y = 90;
                // s.pacman.lowerPart.currentRotation.y = 90;
                mat4.translate(s.camera.viewMatrix, s.camera.viewMatrix, [0, 0, -0.2]);
                break;
            case "ArrowUp":
                s.pacman.upperPart.translate([0, 0, -0.2]);
                s.pacman.lowerPart.translate([0, 0, -0.2]);
                // s.pacman.upperPart.currentRotation.y = 270;
                // s.pacman.lowerPart.currentRotation.y = 270;
                mat4.translate(s.camera.viewMatrix, s.camera.viewMatrix, [0, 0, 0.2]);
                break;
            case "ArrowLeft":
                s.pacman.upperPart.translate([-0.2, 0, 0]);
                s.pacman.lowerPart.translate([-0.2, 0, 0]);
                // s.pacman.upperPart.currentRotation.y = 360;
                // s.pacman.lowerPart.currentRotation.y = 360;
                mat4.translate(s.camera.viewMatrix, s.camera.viewMatrix, [0.2, 0, 0]);
                break;
            case "ArrowRight":
                s.pacman.upperPart.translate([0.2, 0, 0]);
                s.pacman.lowerPart.translate([0.2, 0, 0]);
                // s.pacman.upperPart.currentRotation.y = 180;
                // s.pacman.lowerPart.currentRotation.y = 180;
                mat4.translate(s.camera.viewMatrix, s.camera.viewMatrix, [-0.2, 0, 0]);
                break;
            case "v":
                s.isSheared = !s.isSheared;
                break;
        }
    };
}

async function main() {

    let canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
    let gl = canvas.getContext('webgl') as WebGLRenderingContext;

    let parser = new Parser();
    let renderer = new Renderer(gl);

    let maze = await parser.parseFile("/src/public/maze.obj", [0.5, 0.5, 0.5], gl);
    let upperHemisphere = await parser.parseFile("/src/public/half-sphere.obj", [1.0, 0.0, 0], gl);
    let lowerHemisphere = await parser.parseFile("/src/public/half-sphere.obj", [1.0, 1.0, 0], gl);
    let scene = new Scene(maze, {
        upperPart: upperHemisphere,
        lowerPart: lowerHemisphere
    });

    await renderer.initializeShaderPrograms();

    // Set up callbacks
    handleKeyboardKeys(scene);

    let direction = 1;
    let maxAngle = 45;

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

        // Animation
        const lowerRotation = scene.pacman.lowerPart.currentRotation.x;

        if (lowerRotation > 0) {
            direction = -1;
        } else if (lowerRotation < -maxAngle) {
            direction = 1;
        }

        scene.pacman.upperPart.rotate([-direction * 1, 0, 0]);
        scene.pacman.lowerPart.rotate([direction * 1, 0, 0]);

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

