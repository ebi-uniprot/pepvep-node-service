
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

  public addInput(rawInput: string) : Input {
    const input: Input = new Input(rawInput);
    const id: string = this.idGenerator(input.raw); 
    this._inputs[id] = input;
    return this._inputs[id];
  }

  public addGene(ensg: string, chromosome: string, start: string, end: string) : Gene {
    const gene: Gene = new Gene(ensg, chromosome, parseInt(start), parseInt(end));
    const id: string = this.idGenerator(`${ensg}-${chromosome}:${start}-${end}`);
    this._genes[id] = gene;
    return this._genes[id];
  }

  public addProtein(ensp: string, enst: string, uniprotAccessions: string[], tremblAccessions: string[]) : Protein | null {
    // choosing what accession should be used for this protein
    let accession: string;

    if ('undefined' !== typeof uniprotAccessions && 0 < uniprotAccessions.length) {
      accession = uniprotAccessions[0];
    }
    
    else if ('undefined' !== typeof tremblAccessions && 0 < tremblAccessions.length) {
      accession = tremblAccessions[0];
    }

    else {
      return null;
    }

    const protein: Protein = new Protein(ensp, enst, accession);
    const id: string = this.idGenerator(`${ensp}-${enst}-${accession}`);
    this._proteins[id] = protein;
    return this._proteins[id];
  }
}
