/**
 * To define an object that holds relevant details regarding
 * genomic colocated variants of a variation.
 */
export default class GenomicColocatedVariant {
  readonly id: string;
  private _pubMedIDs: string[] = [];

  constructor(id: string) {
    this.id = id;
  }

  get pubMedIDs() : string[] { return this._pubMedIDs; }

  public addPubMedID(id: string) : void {
    if (!this._pubMedIDs.includes(id)) {
      this._pubMedIDs.push(id);
    }
  }
}
