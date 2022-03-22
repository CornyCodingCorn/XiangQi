import { Hex } from "./Hex";

const MAX_VALUE = 256;

export default class Color {
    private _r: number = 0;
    private _g: number = 0;
    private _b: number = 0;

    public get r(): number { return this._r; }
    public get g(): number { return this._g; }
    public get b(): number { return this._b; }

    constructor(value?: number) {
        if (value === undefined)
            return;

        this.setColor(value);
    }

    public set r(value: number) { 
        this._r = Math.round(value) % MAX_VALUE;
    }
    public set g(value: number) { 
        this._g = Math.round(value) % MAX_VALUE;
    }
    public set b(value: number) { 
        this._b = Math.round(value) % MAX_VALUE;
    }

    public setColor(value: number) {
        this.r = (value & 0x00FF0000) >> 16;
        this.g = (value & 0x0000FF00) >> 8;
        this.b = (value & 0x000000FF);
    }

    public toString(): string {
        return "#" 
        + Hex.toHexString(this._r)
        + Hex.toHexString(this._g) 
        + Hex.toHexString(this._b);
    }
}