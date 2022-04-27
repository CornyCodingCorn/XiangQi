export namespace Hex
{
    export function toHexString(value: number): string {
        var str = Number(Math.round(value)).toString(16);
        return str.length === 1 ? "0" + str : str;
    }
}