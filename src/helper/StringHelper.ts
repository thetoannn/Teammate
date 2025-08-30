export class StringHelper {
  static isEmpty(str: string): boolean {
    return str === null || str === undefined || str.length === 0;
  }
}
