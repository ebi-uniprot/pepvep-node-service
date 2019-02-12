import axios from 'axios';
import * as tunnel from 'tunnel';

let customAxios: any = axios;

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
  const agent = tunnel.httpsOverHttp({
    proxy: {
      host: 'www-proxy.ebi.ac.uk',
      port: 3128,
    },
  });

  customAxios = axios.create({
    baseURL: 'https://rest.ensembl.org:443',
    httpsAgent: agent,
    // proxy: false,
    proxy: {
      host: 'www-proxy.ebi.ac.uk',
      port: 3128,
    },
  });
}

export default class VEP {
  public static async variantConsequencesAllInputs(organism: string, input: string) {
    const url: string =
      `https://rest.ensembl.org/vep/${organism}/region?content-type=application/json`;

    return await customAxios.post(url, {
      variants: [input],
      protein: true,
      uniprot: true,
      hgvs: true,
      canonical: true,
      Blosum62: true,
      af: true,
      af_1kg: 1,
      af_esp: 1,
      af_gnomad: 1,
      conservation: 1,
      appris: true,
      dbNSFP: 'LRT_score,LRT_pred,MutationTaster_score,MutationTaster_pred,FATHMM_score,FATHMM_pred,PROVEAN_score,PROVEAN_pred,MutPred_score,CADD_raw,CADD_phred',
      tsl: true,
      numbers: true,
      miRNA: true,
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
