export default class Helpers {

  public static parseProteinChangeInput(input: string): any[] {
    const rows = input.split('\n');
    return rows.map((row) => {
      const regExp = /^(\S+)(\s{1})([a-zA-Z])(\d+)([a-zA-Z])$/;
      const matches = row.match(regExp);
      if (!matches) {
        throw new Error('No matches found');
      }
      return {
        accession: matches[1],
        WT: matches[3],
        position: matches[4],
        variant: matches[5],
      };
    });
  }

  public static toCapitalise(
    input: string,
    lowercaseRest: boolean = false,
  ) : string {
    if (!input) {
      return input;
    }

    let output = input.charAt(0).toUpperCase();
    output += (lowercaseRest)
      ? input.slice(1).toLowerCase()
      : input.slice(1);

    return output;
  }

  public static toHummanReadable(
    input: string,
    capitalise: boolean = false,
    capitaliseAllWords: boolean = false,
    lowercaseRest: boolean = false,
    ignore: string[] = [],
  ) : string {
    if (typeof input !== 'string') {
      return input;
    }

    let output: string = input
      .replace(/[_-]/g, ' ');

    if (capitaliseAllWords) {
      return output
        .split(' ')
        .map(word => this.toCapitalise(word, lowercaseRest))
        .join(' ');
    }

    if (capitalise) {
      return this.toCapitalise(output, lowercaseRest);
    }

    return output;
  }
}
