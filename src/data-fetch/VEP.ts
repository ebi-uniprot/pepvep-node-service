
import axios from 'axios';

export default class VEP {

  public static async variantConsequences(species: string, region: string, allele: string ) {

    const url: string = `https://rest.ensembl.org/vep/${species}/region/${region}/${allele}?content-type=application/json`;
    return await axios.get(url);
  }

  public static async variantConsequencesBatch(species: string, variants: string[]) {

    const url: string = `https://rest.ensembl.org/vep/${species}/region?content-type=application/json`;
    return await axios.post(url, {variants});
  }
}
