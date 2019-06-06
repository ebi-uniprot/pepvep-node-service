export default class Helpers {

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

    const output: string = input
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

  public static chunkArray(source: any[], chunkSize: number) : any[] {
    const results = [];

    for (let i = 0; i < source.length; i += chunkSize) {
      results.push(source.slice(i, i + chunkSize));
    }

    return results;
  }
}
