import { createProgram, createShader } from "../helpers";
import { AttributeCollection } from "./AttributeCollection";
import { ShaderProgram } from "./ShaderProgram";
import { ShadingScheme } from "./ShadingScheme";

export class Renderer {

    shadingSchemes: Map<ShadingScheme, ShaderProgram> = new Map();
    gl: WebGLRenderingContext;
    currentScheme: ShadingScheme;

    constructor(gl: WebGLRenderingContext) {
        this.shadingSchemes = new Map();
        this.gl = gl;
        this.currentScheme = "phong";
    }

    async initializeShaderPrograms() {
        await this.#createPhongProg();
    }

    async #createPhongProg() {
        this.shadingSchemes.set("phong", await this.#compileShaderProgram(
            "/src/shaders/phong/phong_vertex.glsl",
            "/src/shaders/phong/phong_fragment.glsl"
        ));
    }

    async #compileShaderProgram(vertexShaderPath: string, fragmentShaderPath: string): Promise<ShaderProgram> {

        let [vertexShaderSource, fragmentShaderSource] = await Promise.all([
            fetch(vertexShaderPath).then(x => x.text()),
            fetch(fragmentShaderPath).then(x => x.text())
        ]);

        let vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource);
        let fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        if (vertexShader !== undefined && fragmentShader !== undefined) {
            let program = createProgram(this.gl, vertexShader, fragmentShader);
            if (program !== undefined) {
                let attributes = this.#getAttributeLocations(program);

                return new ShaderProgram(program, attributes);
            } else {
                throw new Error(
                    `Problem with program!\nVertex path: ${vertexShaderPath};\nFragment path: ${fragmentShaderPath}.`);
            }
        } else {
            throw new Error(
                `Problem with shaders!\nVertex path: ${vertexShaderPath};\nFragment path: ${fragmentShaderPath}.`);
        }
    }

    #getAttributeLocations(program: WebGLProgram): AttributeCollection {

        let modelULocation = this.gl.getUniformLocation(program, "u_model");
        let viewULocation = this.gl.getUniformLocation(program, "u_view");
        let projectionULocation = this.gl.getUniformLocation(program, "u_projection");
        let lightPositionULocation = this.gl.getUniformLocation(program, "u_light");
        let normalULocation = this.gl.getUniformLocation(program, "u_normal");

        let positionAttributeLocation = this.gl.getAttribLocation(program, "a_position");
        let normalAttributeLocation = this.gl.getAttribLocation(program, "a_normal");
        let colorAttributeLocation = this.gl.getAttribLocation(program, "a_color");

        return {
            positionAttributeLocation,
            normalAttributeLocation,
            colorAttributeLocation,
            viewULocation,
            projectionULocation,
            modelULocation,
            lightPositionULocation,
            normalULocation
        };
    }
}

