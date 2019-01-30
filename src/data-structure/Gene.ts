
import Protein from './Protein';

export default class Gene {
  readonly ensg: string;
  readonly chromosome: string;
  private _proteins: any = {};

  constructor(ensg: string, chromosome: string) {
    this.ensg = ensg;
    this.chromosome = chromosome;
  }

  public getProteins() : Protein[] {
    return Object.values(this._proteins);
  }

  public addProtein(protein: Protein) : void {
    const { accession, enst, ensp } = protein;
    const key: string = `${accession}-${ensp}-${enst}`;

    if ('undefined' === typeof this._proteins[key]) {
      this._proteins[key] = protein;
    }
  }
}
