
import Gene from './Gene';
import * as values from 'object.values';

export default class Input {
  readonly raw: string;
  private _genes: any = {};

  constructor(input: string) {
    this.raw = input;
  }

  public getGenes() : Gene[] {
    return values(this._genes);
  }

  public addGene(gene: Gene) : void {
    const { ensg } = gene;

    if ('undefined' === typeof this._genes[ensg]) {
      this._genes[ensg] = gene;
    }
  }
}
