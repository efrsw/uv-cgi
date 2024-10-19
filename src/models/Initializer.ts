import { createProgram, createShader, resizeCanvasToDisplaySize } from "../helpers";

export class Initializer {

    async initializeGLState(): Promise<[WebGLRenderingContext, WebGLProgram]> {
        let gl = this.#initializeRenderingContext();
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        return [
            gl,
            await this.#createWebGlProgram(gl)
        ]
    }

    #initializeRenderingContext() {
        let canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
        resizeCanvasToDisplaySize(canvas);        
        return canvas.getContext('webgl') as WebGLRenderingContext;
    }

    async #createWebGlProgram(gl : WebGLRenderingContext): Promise<WebGLProgram> {
        let program = createProgram(gl, ...await this.#createShaders(gl));
        if (program === undefined) {
            throw new Error(`Program was not created successfully. Program: ${program}`);
        }

        return program;
    }

    async #createShaders(gl: WebGLRenderingContext): Promise<[WebGLShader, WebGLShader]> {
        let [vertexShaderSource, fragmentShaderSource] = await Promise.all([
            fetch("/src/shaders/vertex.glsl").then(x => x.text()),
            fetch("/src/shaders/fragment.glsl").then(x => x.text())]);


        let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        if (vertexShader === undefined || fragmentShader === undefined) {
            throw new Error(`Either vertex or fragment shader is undefined. 
                             Vertex ${vertexShader}; 

                             --- 
                             
                             Fragment ${fragmentShader}`);
        }
        
        return [vertexShader, fragmentShader];
    }

}
