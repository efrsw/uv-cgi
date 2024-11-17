import { AttributeCollection } from "./AttributeCollection";


export class ShaderProgram {
    attributes: AttributeCollection;
    program: WebGLProgram;

    constructor(program: WebGLProgram, attributes: AttributeCollection) {
        this.program = program;
        this.attributes = attributes;
    }
}

