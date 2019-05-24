import Variation from './Variation';

export enum ProteinType {
  SwissProt = 'Swiss-Prot',
  Trembl = 'TrEMBL',
  SwissProtUpdate = 'Swiss-Prot update',
  Immunoglobulin = 'Immunoglobulin',
  Patent = 'Patent',
  Pseudogene = 'Pseudogene',
  SmallFragment = 'Small fragment',
  SyntheticProtein = 'Synthetic protein',
  NotRealProtein = 'Not real protein',
  OverRepresentedSequence = 'Over-represented sequence',
  TruncatedProtein = 'Truncated protein',
  SPRedundant = 'SP redundant',
  Celera = 'Celera',
  SwissProtIsoform = 'Swiss-Prot isoform',
  PartialWGSOnHold = 'partial WGS on hold',
  OnHold = 'On hold',
};

export default class Protein {
  readonly accession: string;
  private _type: ProteinType;
  private _ensp: string;
  private _enst: string;
  private _taxonomy: number;
  private _recommendedName: any;    // { full: string, short: string }
  private _length: number;
  private _swissprotAccessions: string[] = [];
  private _tremblAccessions: string[] = [];
  private _uniparcAccessions: string[] = [];
  private _variations: Variation[] = [];

  constructor(accession: string) {
    this.accession = accession;
  }

  public get type() : ProteinType { return this._type; }
  public set type(type: ProteinType) { throw 'Use Protein.setType() method instead.' }

  public get ensp() : string { return this._ensp; }
  public set ensp(ensp: string) { this._ensp = ensp; }

  public get enst() : string { return this._enst; }
  public set enst(enst: string) { this._enst = enst; }

  public get taxonomy() : number { return this._taxonomy; }
  public set taxonomy(id: number) { this._taxonomy = id; }

  public get name() : any { return this._recommendedName; }
  public set name(recommendedName: any) { this._recommendedName = recommendedName; }

  public get length() : number { return this._length; }
  public set length(length: number) { this._length = length; }

  public get swissprotAccessions() : string[] { return this._swissprotAccessions; }
  public set swissprotAccessions(accessions: string[]) { this._swissprotAccessions = accessions; }

  public get tremblAccessions() : string[] { return this._tremblAccessions; }
  public set tremblAccessions(accessions: string[]) { this._tremblAccessions = accessions; }

  public get uniparcAccessions() : string[] { return this._uniparcAccessions; }
  public set uniparcAccessions(accessions: string[]) { this._uniparcAccessions = accessions; }

  public addVariation(variation: Variation) { this._variations.push(variation); }
  public getVariations() : Variation[] { return this._variations; }

  public getVariationsInRange(start: number, end: number) : Variation[] {
    return this._variations
      .filter(v => v.isInRange(start, end));
  }

  public hasVariationWithProteinPosition() : boolean {
    return this._variations
      .some(
        v => (
          typeof v.proteinStart !== 'undefined' &&
          v.proteinStart !== null && v.proteinStart !== NaN
        ),
      );
  }

  public setType(type: string) {
    switch (type) {
      case 'Swiss-Prot':
        this._type = ProteinType.SwissProt;
        break;

      case 'TrEMBL':
        this._type = ProteinType.Trembl;
        break;

      case 'Swiss-Prot isoform':
        this._type = ProteinType.SwissProtIsoform;
        break;

      default:
        break;
    }
  }
}
