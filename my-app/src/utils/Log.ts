export namespace Log {
  export function error(title: string, str: string) {
    console.error(`ERROR_${title}: ${str.replaceAll("\n", "\n|")}`);
  }
  export function log(title: string, str: string) {
    console.log(`LOG_${title}: ${str.replaceAll("\n", "\n|")}`);
  }
  export function warn(title: string, str: string) {
    console.warn(`WARN_${title}: ${str.replaceAll("\n", "\n|")}`);
  }
}