
import Protein from './Protein';
import * as values from 'object.values';

export default class Gene {
  readonly ensg: string;
  readonly chromosome: string;
  private _symbol: string;
  private _source: string;
  private _proteins: any = {};

  constructor(ensg: string, chromosome: string) {
    this.ensg = ensg;
    this.chromosome = chromosome;
  }

  public get symbol() : string { return this._symbol; }
  public set symbol(symbol: string) { this._symbol = symbol; }

  public get source() : string { return this._source; }
  public set source(source: string) { this._source = source; }

  public getProteins() : Protein[] {
    return values(this._proteins);
  }

  public addProtein(protein: Protein) : void {
    const { accession, enst, ensp } = protein;
    const key: string = `${accession}-${ensp}-${enst}`;

    if ('undefined' === typeof this._proteins[key]) {
      this._proteins[key] = protein;
    }
  }
}
