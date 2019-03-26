/**
 * To define an object that holds relevant details regarding
 * colocated variants of a variation.
 */
export default class ColocatedVariant {
  readonly id: string;
  private _pubMedIDs: string[] = [];

  constructor(id: string) {
    this.id = id;
  }

  get pubMedIDs() : string[] { return this._pubMedIDs; }

  public addPubMedID(id: string) : void {
    this._pubMedIDs.push(id);
  }
}
