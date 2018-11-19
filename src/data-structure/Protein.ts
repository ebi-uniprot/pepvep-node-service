import Variation from './Variation';

export default class Protein {
  readonly accession: string;
  private _ensp: string;
  private _enst: string;
  private _variations: Variation[] = [];

  constructor(accession: string) {
    this.accession = accession;
  }

  public get ensp() : string { return this._ensp; }
  public set ensp(ensp: string) { this._ensp = ensp; }

  public get enst() : string { return this._enst; }
  public set enst(enst: string) { this._enst = enst; }

  public addVariation(variation: Variation) {
    this._variations.push(variation);
  }

  public getVariations(): Variation[] {
    return this._variations;
  }
}
