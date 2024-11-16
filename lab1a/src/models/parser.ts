import { ObjModel } from "./objModel";

export class Parser {
    #paths = [
        "/src/public/bunny.obj",
        "/src/public/cube.obj",
        "/src/public/teapot.obj",
        "/src/public/tetrahedron.obj"
    ];

    async parseFiles() {
        return await Promise.all(
            this.#paths.map(p => fetch(p)
                .then(t => t.text())
                .then(str => this.#getObjFromText(str))));
    }

    #getObjFromText(str: string): ObjModel {
        let lines = str.split('\n');

        // I decided to use maps instead of arrays to not mess with one based indexing
        let currentVertexKey = 1;
        let currentNormalKey = 1;
        let currentTextureKey = 1;

        let verticies: Map<number, number[]> = new Map();
        let normals: Map<number, number[]> = new Map();
        let textures: Map<number, number[]> = new Map();


        let objVerticies: number[] = [];
        let objTextures: number[] = [];
        let objNormals: number[] = [];

        lines.forEach(line => {
            if (line === '' || line.startsWith('#')) return;

            let [type, firstComponent, secondComponent, thirdComponent] = line.split(' ');

            switch (type) {
                case 'v':
                    verticies.set(currentVertexKey, [+firstComponent, +secondComponent, +thirdComponent]);
                    currentVertexKey++;
                    break;
                case 'vn':
                    normals.set(currentNormalKey, [+firstComponent, +secondComponent, +thirdComponent]);
                    currentNormalKey++;
                    break;
                case 'vt':
                    textures.set(currentVertexKey, [+firstComponent, +secondComponent]);
                    currentTextureKey++;
                    break;
                case 'f':
                    if (firstComponent.split('/').length === 1) {
                        if (verticies.has(+firstComponent)
                            && verticies.has(+secondComponent)
                            && verticies.has(+thirdComponent)) {

                            objVerticies.push(
                                ...verticies.get(+firstComponent)!,
                                ...verticies.get(+secondComponent)!,
                                ...verticies.get(+thirdComponent)!);
                        } else {
                            console.error("Could not parse vertex (only vertex mode)");
                            return;
                        }
                    } else {
                        for(const component of [firstComponent, secondComponent, thirdComponent]) {
                            const [vertexIdx, textureIdx, normalIdx] = component.split('/');
                            if(vertexIdx !== '' && verticies.has(+vertexIdx)) {
                                objVerticies.push(...verticies.get(+vertexIdx)!);
                            }

                            if(textureIdx !== '' && textures.has(+textureIdx)) {
                                objTextures.push(...textures.get(+textureIdx)!);
                            }

                            if(normalIdx !== '' && normals.has(+normalIdx)) {
                                objNormals.push(...normals.get(+normalIdx)!);
                            }
                        }
                    }
                    break;
                // Skipping some of the tokens, since we don't need them 
                case 'o':
                    console.log("Skipping [o]bject token");
                    break;
                case 's':
                    console.log("Skipping [s]moothing token");
                    break;
                case 'g':
                    console.log("Skipping [g]rouping token");
                    break;
                default:
                    console.warn("Unexpected token: " + type);
                    break;
            }
        });

        return new ObjModel(objVerticies, objNormals, objTextures);
    }
}
