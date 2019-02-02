import axios from 'axios';
import Helpers from './Helpers';


import * as tunnel from 'tunnel';

const agent = tunnel.httpsOverHttp({
  proxy: {
    host: 'www-proxy.ebi.ac.uk',
    port: 3128,
  },
});

const customAxios2 = axios.create({
    baseURL: 'https://rest.ensembl.org:443',
    httpsAgent: agent,
    proxy: false,
});

const customAxios = axios;

const taxID = '9606';

export default class UniProtKB {
  public static async getProteinDetailByAccession(accessions: string[]) {
    const url: string =
      `https://www.ebi.ac.uk/proteins/api/proteins?format=json&accession=${accessions.join(',')}`;
    return await customAxios.get(url);
  }

  public static async getProteinFeatures(accessions: string[]) {
    const accessionsString: string = accessions.join(',');
    // TODO this call is limited to 100 only, we need to do it in batches
    const url: string = `https://www.ebi.ac.uk/proteins/api/features?accession=${accessionsString}`;
    return await customAxios.get(url);
  }

  public static async getProteinVariants(accessions: string[]) {
    const accessionsString: string = accessions.join(',');
    // TODO this call is limited to 100 only, we need to do it in batches
    const url: string = `https://www.ebi.ac.uk/proteins/api/variation?offset=0&size=100&accession=${accessionsString}`;
    return await customAxios.get(url);
  }
}
