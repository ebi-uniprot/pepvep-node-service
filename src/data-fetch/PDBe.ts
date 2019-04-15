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
    const url: string = `https://wwwint.ebi.ac.uk/pdbe/graph-api/pepvep/summary_stats`;
    const headers = {
      'Content-Type': 'application/json',
    };

    const inputBatches : any[] = Helpers.chunkArray(input, 10);
    const requests = inputBatches
      .map(i => (async () => await customAxios.post(url, i, { headers }))());

    return axios.all(requests);
  }
}
