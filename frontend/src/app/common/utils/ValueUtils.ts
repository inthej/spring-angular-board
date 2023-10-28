export default class ValueUtils {
  public static empty(str: any, includeBlank: boolean = true): boolean {
    const empty: boolean = str === null || str === undefined || (includeBlank && str === '');
    return empty;
  }

  public static nonEmpty(str: any, includeBlank: boolean = true): boolean {
    return !ValueUtils.empty(str, includeBlank);
  }
  public static nvl(str: any, defaultValue: any = '') {
    if (ValueUtils.empty(str)) return defaultValue;
    return str;
  }
}
