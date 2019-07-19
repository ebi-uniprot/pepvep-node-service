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
  private _cosmicId: string;
  private _dbSNIPId: string;
  private _clinVarId: string;
  private _uniprotVariantId: string;
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

  // Cosmic ID
  public get cosmicId() : string {
    return this._cosmicId;
  }
  public set cosmicId(cosmicId: string) {
    this._cosmicId = cosmicId;
  }

  // dbSNIP ID
  public get dbSNIPId() : string {
    return this._dbSNIPId;
  }
  public set dbSNIPId(dbSNIPId: string) {
    this._dbSNIPId = dbSNIPId;
  }

  // ClinVar ID
  public get clinVarId() : string {
    return this._clinVarId;
  }
  public set clinVarId(clinVarId: string) {
    this._clinVarId = clinVarId;
  }

  // UniProt Variation ID
  public get uniProtVariationId() : string {
    return this._uniprotVariantId;
  }
  public set uniProtVariationId(uniProtVariationId: string) {
    this._uniprotVariantId = uniProtVariationId;
  }

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

  public addGenomicColocatedVariantIDs(ids: any) {
    const {
      cosmicId,
      dbSNIPId,
      clinVarId,
      uniProtVariationId,
    } = ids;

    if (cosmicId) {
      this.cosmicId = cosmicId;
    }

    if (dbSNIPId) {
      this.dbSNIPId = dbSNIPId;
    }

    if (clinVarId) {
      this.clinVarId = clinVarId;
    }

    if (uniProtVariationId) {
      this.uniProtVariationId = uniProtVariationId;
    }

    this.getProteins()
      .map((protein) => {
        protein.getVariations()
          .forEach((variation) => {
            variation.addGenomicColocatedVariantIDs({
              cosmicId: this.cosmicId,
              dbSNIPId: this.dbSNIPId,
              clinVarId: this.clinVarId,
              uniProtVariationId: this.uniProtVariationId,
            });
          });
      });
  }
}
