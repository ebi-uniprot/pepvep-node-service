
import axios from 'axios';

export default class VEP {
  public static async variantConsequencesAllInputs(organism: string, input: string) {
    const url: string = `https://rest.ensembl.org/vep/${organism}/region?content-type=application/json`;
    return await axios.post(url, {variants: [input]});
  }

  public static async variantConsequences(organism: string, region: string, allele: string ) {
    const url: string = `https://rest.ensembl.org/vep/${organism}/region/${region}/${allele}?content-type=application/json`;
    return await axios.get(url);
  }

  public static async variantConsequencesBatch(organism: string, variants: string[]) {
    const url: string = `https://rest.ensembl.org/vep/${organism}/region?content-type=application/json`;
    return await axios.post(url, {variants});
  }
}
