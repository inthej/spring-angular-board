export default class LogUtils {
  public static debug(message?: any, ...optionalParams: any[]): void {
    console.log(message, optionalParams);
  }

  public static info(message?: any, ...optionalParams: any[]): void {
    console.info(message, optionalParams);
  }

  public static warn(message?: any, ...optionalParams: any[]): void {
    console.warn(message, optionalParams);
  }

  public static error(message?: any, ...optionalParams: any[]): void {
    console.error(message, optionalParams);
  }
}
