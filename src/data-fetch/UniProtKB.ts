
import axios from 'axios';

import Protein from '../lib/biolib/src/protein/protein';

export default class UniProtKB {

  private static stringOrArrayToCommaSeparated(elements: string | string[]) : string {
    return ('string' === typeof elements)
      ? elements
      : elements
        .reduce((commaSeparated: any, current: string, index: number) => {

          if (0 < index) {
            commaSeparated += ',';
          }

          commaSeparated += current;

          return commaSeparated;
        }, '');
  }

  public static proteinDetailsByAccession(accessions: string[], callback: Function = null) : any {
    let queryString: string = this.stringOrArrayToCommaSeparated(accessions);

    const url: string = `https://www.ebi.ac.uk/proteins/api/proteins?format=json&accession=${queryString}`;

    const promise = axios.get(url);

    return ('function' === typeof callback)
      ? promise.then(result => callback(result))
      : promise;
  }

  public static genomicCoordinatesByAccession(accessions: string[], callback: Function = null) : any {
    let queryString: string = this.stringOrArrayToCommaSeparated(accessions);

    const url: string = `https://www.ebi.ac.uk/proteins/api/coordinates?format=json&accession=${queryString}`;

    const promise = axios.get(url);

    return ('function' === typeof callback)
      ? promise.then(result => callback(result))
      : promise;
  }

  public static impactSearchByProteinAccessions(accessions: string[], callback: Function = null) : any {
    const promise = axios.all([
      this.proteinDetailsByAccession(accessions),
      this.genomicCoordinatesByAccession(accessions),
    ]);

    function proccess(protein: any, coordinates: any) : any {
      let results: any = {};

      results.proteins = protein.data
        .map(item => {
          let details: any = {};

          details.accession = item.accession;

          details.name = (item.protein && item.protein.recommendedName && item.protein.recommendedName.fullName)
            ? item.protein.recommendedName.fullName.value
            : 'NA';

          details.geneName = (item.gene && item.gene[0] && item.gene[0].name)
            ? item.gene[0].name.value
            : 'NA';

          return details;
        });

      return callback(results);
    };

    return ('function' === typeof callback)
      ? promise.then(axios.spread(proccess))
      : promise;
  }


}
