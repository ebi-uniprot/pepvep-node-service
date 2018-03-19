
export default class Helpers {

  public static stringOrArrayToCommaSeparated(elements: string | string[]) : string {
    return ('string' === typeof elements)
      ? elements
      : elements
        .reduce((commaSeparated: any, current: string, index: number) => {

          if (0 < index) {
            commaSeparated += ',';
          }

          commaSeparated += current;

          return commaSeparated;
        }, '');
  }
}
