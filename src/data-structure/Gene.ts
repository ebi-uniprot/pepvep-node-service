import Protein from './Protein';
import * as values from 'object.values';

export default class Gene {
  readonly ensg: string;
  readonly chromosome: string;
  private _symbol: string;
  private _symbolSource: string;
  private _assemblyName: string;
  private _strand: number;
  private _hgncId: string;
  private _proteins: any = {};

  constructor(ensg: string, chromosome: string) {
    this.ensg = ensg;
    this.chromosome = chromosome;
  }

  public get symbol() : string { return this._symbol; }
  public set symbol(symbol: string) { this._symbol = symbol; }

  public get symbolSource() : string { return this._symbolSource; }
  public set symbolSource(source: string) { this._symbolSource = source; }

  public get assemblyName() : string { return this._assemblyName; }
  public set assemblyName(name: string) { this._assemblyName = name; }

  public get strand() : number { return this._strand; }
  public set strand(strand: number) { this._strand = strand; }

  public get hgncId() : string { return this._hgncId; }
  public set hgncId(id: string) { this._hgncId = id; }

  public getProteins() : Protein[] {
    return values(this._proteins);
  }

  public addProtein(protein: Protein) : void {
    const { accession, enst, ensp } = protein;
    const key: string = `${accession}-${ensp}-${enst}`;

    if (this._proteins[key] === undefined) {
      this._proteins[key] = protein;
    }
  }
}
