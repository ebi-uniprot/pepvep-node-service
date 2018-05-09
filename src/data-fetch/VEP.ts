
import axios from 'axios';

export default class VEP {

  public static variantConsequences(species: string, region: string, allele: string, callback: Function = null) : any {

    const url: string = `https://rest.ensembl.org/vep/${species}/region/${region}/${allele}?content-type=application/json`;
console.log("url:", url);
    const promise = axios.get(url);

    return ('function' === typeof callback)
      ? promise.then(result => callback(result))
      : promise;
  }

  public static variantConsequencesBatch(species: string, variants: string[], callback: Function = null) : any {

    const url: string = `https://rest.ensembl.org/vep/${species}/region?content-type=application/json`;

    const promise = axios.post(url, {variants});

    return ('function' === typeof callback)
      ? promise.then(result => callback(result))
      : promise;
  }
}
