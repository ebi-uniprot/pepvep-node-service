
import Gene from './Gene';

export default class Input {
  readonly raw: string;
  private _genes: Gene[] = [];

  constructor(input: string) {
    this.raw = input;
  }

  public getGenes() : Gene[] {
    return this._genes;
  }

  public addToGenes(gene: Gene) : void {
    this._genes.push(gene);
  }
}
