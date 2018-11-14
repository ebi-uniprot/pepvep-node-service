
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
    
  }
}
