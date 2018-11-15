
import * as crypto from 'crypto';

import Input from './Input';
import Protein from './Protein';
import Gene from './Gene';
import Variation from './Variation';

interface TypedMap<T> {
  [id: string] : T;
}

export default class SearchResults {
  private _inputs : TypedMap<Input> = {};
  private _proteins : TypedMap<Protein> = {};
  private _genes : TypedMap<Gene> = {};
  private _variations : TypedMap<Variation> = {};

  constructor() {
    console.log("GOT HERE");
  }

  public idGenerator(value: string) : string {
    return crypto.createHash('md5').update(value).digest('hex');
  }

  public addToInputs(rawInput: string) : Input {
    const input: Input = new Input(rawInput);
    const id: string = this.idGenerator(input.raw); 
    this._inputs[id] = input;
    return this._inputs[id];
  }

  public addToGenes(ensg: string, chromosome: string, start: string, end: string) : Gene {
    const gene: Gene = new Gene(ensg, chromosome, parseInt(start), parseInt(end));
    const id: string = this.idGenerator(`${ensg}-${chromosome}:${start}-${end}`);
    this._genes[id] = gene;
    return this._genes[id];
  }
}
