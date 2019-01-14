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
}
