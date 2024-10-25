export class RotationTransformation {
    #xRadians: number
    #yRadians: number
    #zRadians: number

    constructor(xRadians: number, yRadians: number, zRadians: number) {
        this.#xRadians = xRadians;
        this.#yRadians = yRadians;
        this.#zRadians = zRadians;
    }

    get xRadians() {
        return this.#xRadians;
    }

    get yRadians() {
        return this.#yRadians;
    }

    get zRadians() {
        return this.#zRadians;
    }
}
