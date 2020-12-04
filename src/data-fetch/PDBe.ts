import axios from 'axios';
import * as tunnel from 'tunnel';

import Protein from '../data-structure/Protein'; 
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

export default class PDBe {
  public static async getProteinStructureSummary(input: any) {
    // tslint:disable:max-line-length
    const url: string = `https://www.ebi.ac.uk/pdbe/graph-api/pepvep/summary_stats`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const validateStatus = function (status) {
      // accepting 404 as a valid response from PDBe end-point
      // this is the case when there is no data available for a certain request
      return status >= 200 && status < 500;
    };

    const inputBatches : any[] = Helpers.chunkArray(input, 10);
    const requests = inputBatches
      .map(i => (async () => {
        return await customAxios.post(url, i, { headers, validateStatus }) })());
    return axios.all(requests);
  }
}
