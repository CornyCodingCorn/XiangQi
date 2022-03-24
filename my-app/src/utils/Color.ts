import { Hex } from "./Hex";

const MAX_VALUE = 256;

export default class Color {
    private _a :number = -1;
    private _r: number = 0;
    private _g: number = 0;
    private _b: number = 0;

    public get a(): number { return this._a < 0 ? MAX_VALUE - 1 : this._a; }
    public get r(): number { return this._r; }
    public get g(): number { return this._g; }
    public get b(): number { return this._b; }

    constructor(value?: number, alpha?: number) {
        if (value === undefined)
            return;

        this.setColor(value, alpha);
    }

    public set a(value: number) {
        this._a = value < 0 ? 0 : (value > 1 ? 1 : value);
        this._a *= (MAX_VALUE - 1);
    }
    public set r(value: number) { 
        this._r = Math.round(value < 0 ? 0 : value) % MAX_VALUE;
    }
    public set g(value: number) { 
        this._g = Math.round(value < 0 ? 0 : value) % MAX_VALUE;
    }
    public set b(value: number) { 
        this._b = Math.round(value < 0 ? 0 : value) % MAX_VALUE;
    }

    public setColor(value: number, alpha?: number) {
        this.r = (value & 0x00FF0000) >> 16;
        this.g = (value & 0x0000FF00) >> 8;
        this.b = (value & 0x000000FF);

        if (alpha === undefined)
            return;

        this.a = alpha;
    }

    public toString(): string {
        return "#"
        + Hex.toHexString(this._r)
        + Hex.toHexString(this._g) 
        + Hex.toHexString(this._b)
        + (this._a < 0 ? "" : Hex.toHexString(this._a))
    }
}