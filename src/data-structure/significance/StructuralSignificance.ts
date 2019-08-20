export default class StructuralSignificance {
  private _proteinLenght: number;
  private _allStructures: string[];
  private _annotaionts: any[] = [];
  private _ligands: any[] = [];
  private _interactions: any[] = [];
  private _structures: any[] = [];

  public get proteinLength() : number {
    return this._proteinLenght;
  }

  public set proteinLength(length: number) {
    this._proteinLenght = length;
  }

  public addAllStructures(structures: string[]) : void {
    this._allStructures = structures;
  }

  public getAllStructures() : string[] {
    return this._allStructures;
  }

  public addAnnotation(annotation: any) : void {
    this._annotaionts.push(annotation);
  }

  public getAnnotations() : any[] {
    return this._annotaionts;
  }

  public addLigand(ligand: any) : void {
    this._ligands.push(ligand);
  }

  public getLigands() : any[] {
    return this._ligands;
  }

  public addInteraction(interaction: any) : void {
    this._interactions.push(interaction);
  }

  public getInteractions() : any[] {
    return this._interactions;
  }

  public addStructure(structure: any) : void {
    this._structures.push(structure);
  }

  public getStructures() : any[] {
    return this._structures;
  }

  public toJSON() {
    return {
      proteinLength: this.proteinLength,
      allStructures: this.getAllStructures(),
      annotations: this.getAnnotations(),
      ligands: this.getLigands(),
      interactions: this.getInteractions(),
      structures: this.getStructures(),
    };
  }
}
