export namespace Log {
  function formattingString(str: string) {
    return str ? str.replaceAll("\n", "\n|") : "";
  }

  export function error(title: string, str: string) {
    console.error(`ERROR_${title.toUpperCase()}: ${formattingString(str)}`);
  }
  export function log(title: string, str: string) {
    console.log(`LOG_${title.toUpperCase()}: ${formattingString(str)}`);
  }
  export function warn(title: string, str: string) {
    console.warn(`WARN_${title.toUpperCase()}: ${formattingString(str)}`);
  }
}