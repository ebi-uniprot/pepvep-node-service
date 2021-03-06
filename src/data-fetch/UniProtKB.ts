import axios from 'axios';
import * as tunnel from 'tunnel';

import Helpers from './Helpers';

let customAxios: any = axios;

if (process.env.NODE_ENV !== 'development') {
  const agent = tunnel.httpsOverHttp({
    proxy: {
      host: 'www-proxy.ebi.ac.uk',
      port: 3128,
    },
  });

  customAxios = axios.create({
    baseURL: 'https://rest.ensembl.org:443',
    httpsAgent: agent,
    proxy: false,
  });
}

const taxID = '9606';

export default class UniProtKB {
  public static async getProteinDetailByAccession(accessions: string[]) {
    // tslint:disable:max-line-length
    const url: string = `https://www.ebi.ac.uk/proteins/api/proteins?format=json&accession=${accessions.join(',')}`;
    return await customAxios.get(url);
  }

  public static async getProteinFeatures(accessions: string[]) {
    const accessionsString: string = accessions.join(',');
    // this call is limited to 100 only, we need to do it in batches
    // tslint:disable:max-line-length
    const url: string = `https://www.ebi.ac.uk/proteins/api/features?accession=${accessionsString}`;
    return await customAxios.get(url);
  }

  public static async getProteinVariants(accessions: string[]) {
    const accessionsString: string = accessions.join(',');
    // this call is limited to 100 only, we need to do it in batches
    // tslint:disable:max-line-length
    const url: string = `https://www.ebi.ac.uk/proteins/api/variation?offset=0&size=100&accession=${accessionsString}`;
    return await customAxios.get(url);
  }
}
