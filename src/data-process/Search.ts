
import * as crypto from 'crypto';

import UniProtKB from '../data-fetch/UniProtKB';
import VEP from '../data-fetch/VEP';
import Significance from './Significance';
import SearchResults from '../data-structure/SearchResults';

export default class Search {


  constructor() {

  }

  public async vepInputSearch(organism: string, input: string) {

    const results: SearchResults = new SearchResults();
  }
}
