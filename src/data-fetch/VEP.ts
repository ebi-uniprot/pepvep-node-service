
import axios from 'axios';
import * as tunnel from 'tunnel';

const agent = tunnel.httpsOverHttp({
  proxy: {
    host: 'www-proxy.ebi.ac.uk',
    port: 3128,
  },
});

const customAxios = axios.create({
    baseURL: 'https://rest.ensembl.org:443',
    httpsAgent: agent,
    proxy: false,
});

export default class VEP {
  public static async variantConsequencesAllInputs(organism: string, input: string) {
    const url: string =
      `https://rest.ensembl.org/vep/${organism}/region?content-type=application/json`;

    return await customAxios.post(url, {
      variants: [input],
      protein: true,
      uniprot: true,
    });
  }

  public static async variantConsequences(organism: string, region: string, allele: string) {
    // tslint:disable-next-line:max-line-length
    const url: string = `https://rest.ensembl.org/vep/${organism}/region/${region}/${allele}?content-type=application/json`;

    return await customAxios.get(url);
  }

  public static async variantConsequencesBatch(organism: string, variants: string[]) {
    const url: string =
      `https://rest.ensembl.org/vep/${organism}/region?content-type=application/json`;

    return await customAxios.post(url, { variants });
  }
}
