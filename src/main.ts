import { Initializer } from "./models/Initializer";

async function main() {

    let positions = new Float32Array([
        0, 0,
        1, 0,
        0, 1,
        1, 0,
        1, 1,
        0, 1
    ]);
    let i = new Initializer();
    let [gl, program] = await i.initializeGLState();

    let positionAttributeLocation = gl.getAttribLocation(program, "vertex_position");

    let positionBuffer = gl.createBuffer(); // Could be null if new buffers cannot be created
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); // Stores information about verticies
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    gl.useProgram(program);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enableVertexAttribArray(positionAttributeLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    let size = 2;
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
    let count = 6;

    gl.drawArrays(primitiveType, offset, count);
}

await main();
