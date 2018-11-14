
export default class Gene {
  readonly ensg: string;
  readonly chromosome: string;
  readonly start: number;
  readonly end: number;

  constructor(ensg: string, chromosome: string, start: number, end: number) {
    this.ensg = ensg;
    this.chromosome = chromosome;
    this.start = start;
    this.end = end;
  }
}
