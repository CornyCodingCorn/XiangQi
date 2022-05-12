export namespace StringUtils {
  export function replaceCharAt(str: string, replace: string, index: number): string {
    return str.substring(0, index) + replace + str.substring(index + 1);
  }

  export function isStringEmpty(str: string) {
    return !str || str === "";
  }
}