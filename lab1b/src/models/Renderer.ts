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
        this.currentScheme = "g_diff";
    }

    async initializeShaderPrograms() {
        await this.#createGDiffuseProg();
        await this.#createGSpecularProg();
        await this.#createPDiffuseProg();
        await this.#createPSpecularProg();
    }

    async #createGSpecularProg() {
        this.shadingSchemes.set("g_spec", await this.#compileShaderProgram(
            "/src/shaders/gouraud/gouraud_vertex_specular.glsl",
            "/src/shaders/gouraud/gouraud_fragment_specular.glsl"
        ));
    }

    async #createGDiffuseProg() {
        this.shadingSchemes.set("g_diff", await this.#compileShaderProgram(
            "/src/shaders/gouraud/gouraud_vertex_diffuse.glsl",
            "/src/shaders/gouraud/gouraud_fragment_diffuse.glsl"
        ));
    }

    async #createPSpecularProg() {
        this.shadingSchemes.set("p_spec", await this.#compileShaderProgram(
            "/src/shaders/phong/phong_vertex_specular.glsl",
            "/src/shaders/phong/phong_fragment_specular.glsl"
        ));
    }

    async #createPDiffuseProg() {
        this.shadingSchemes.set("p_diff", await this.#compileShaderProgram(
            "/src/shaders/phong/phong_vertex_diffuse.glsl",
            "/src/shaders/phong/phong_fragment_diffuse.glsl"
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

