
import Protein from './Protein';

export default class Gene {
  readonly ensg: string;
  readonly chromosome: string;
  private _proteins: Protein[] = [];

  constructor(ensg: string, chromosome: string) {
    this.ensg = ensg;
    this.chromosome = chromosome;
  }

  public getProteins() : Protein[] {
    return this._proteins;
  }

  public addProtein(protein: Protein) {
    this._proteins.push(protein);
  }
}
