export class ScaleTransformation {
    #xUnits: number
    #yUnits: number
    #zUnits: number

    constructor(xUnits: number, yUnits: number, zUnits: number) {
        this.#xUnits = xUnits;
        this.#yUnits = yUnits;
        this.#zUnits = zUnits;
    }

    get xUnits() {
        return this.#xUnits;
    }

    get yUnits() {
        return this.#yUnits;
    }

    get zUnits() {
        return this.#zUnits;
    }
}
