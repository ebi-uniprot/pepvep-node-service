import axios from 'axios';
import Helpers from './Helpers';


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


const taxID = '9606';

export default class UniProtKB {
  public static async proteinsDetailByAccession(accessions: string[]) {
    const queryString: string = Helpers.stringOrArrayToCommaSeparated(accessions);
    const url: string =
      `https://www.ebi.ac.uk/proteins/api/proteins?format=json&accession=${queryString}`;

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
    const url: string = `https://www.ebi.ac.uk/proteins/api/variation/${accessionsString}`;
    return await customAxios.get(url);
  }
}
