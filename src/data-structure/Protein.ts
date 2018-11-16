import Varition from "./Variation";

export default class Protein {
  readonly accession: string;
  private _ensp: string;
  private _enst: string;
  private _variations: Varition[] = [];

  constructor(accession: string) {
    this.accession = accession;
  }

  public get ensp() : string { return this._ensp; };
  public set ensp(ensp: string) { this._ensp = ensp; };

  public get enst() : string { return this._enst; };
  public set enst(enst: string) { this._enst = enst; };

  public addVariation(variation: Varition) {
    this._variations.push(variation);
  }

  public getVariations(): Varition[] {
    return this._variations;
  }
}
