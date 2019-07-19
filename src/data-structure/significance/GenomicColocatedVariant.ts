/**
 * To define an object that holds relevant details regarding
 * genomic colocated variants of a variation.
 */
export default class GenomicColocatedVariant {
  readonly id: string;
  private _pubMedIDs: string[] = [];
  private _populationFrequencies: any;

  constructor(id: string) {
    this.id = id;
  }

  public get pubMedIDs() : string[] { return this._pubMedIDs; }

  public addPubMedID(id: string) : void {
    if (!this._pubMedIDs.includes(id)) {
      this._pubMedIDs.push(id);
    }
  }

  public get populationFrequencies() : any {
    return this._populationFrequencies;
  }

  public set populationFrequencies(frequencies: any) {
    this._populationFrequencies = frequencies;
  }

  public toJSON() : any {
    return {
      id: this.id,
      pubMedIDs: this.pubMedIDs,
      populationFrequencies: this.populationFrequencies,
    };
  }
}
