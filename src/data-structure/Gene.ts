
import Protein from './Protein';

export default class Gene {
  readonly ensg: string;
  readonly chromosome: string;
  readonly start: number;
  readonly end: number;
  private _proteins: Protein[] = [];

  constructor(ensg: string, chromosome: string, start: number, end: number) {
    this.ensg = ensg;
    this.chromosome = chromosome;
    this.start = start;
    this.end = end;
  }

  public getProteins() : Protein[] {
    return this._proteins;
  }

  public addProtein(protein: Protein) {
    this._proteins.push(protein);
  }
}
