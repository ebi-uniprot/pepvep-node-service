
import Varition from './Variation';

export default class Protein {
  readonly ensp: string;
  readonly enst: string;
  readonly accession: string;
  private _variations : Varition[] = [];

  constructor(ensp: string, enst: string, accession: string) {
    this.ensp = ensp;
    this.enst = enst;
    this.accession = accession;
  }

  public addVariation(variation: Varition) {
    this._variations.push(variation);
  }

  public getVariations() : Varition[] {
    return this._variations;
  }
}
