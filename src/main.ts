let canvas: HTMLCanvasElement = document.getElementById("game-canvas") as HTMLCanvasElement;
let gl = canvas.getContext('webgl');

gl?.clearColor(0, 0, 0, 1);

gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
