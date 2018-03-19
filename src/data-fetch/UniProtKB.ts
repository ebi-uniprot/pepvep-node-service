
import axios from 'axios';

import Helpers from './Helpers';
import Protein from '../lib/biolib/src/protein/protein';

export default class UniProtKB {

  public static proteinDetailsByAccession(accessions: string[], callback: Function = null) : any {
    let queryString: string = Helpers.stringOrArrayToCommaSeparated(accessions);

    const url: string = `https://www.ebi.ac.uk/proteins/api/proteins?format=json&accession=${queryString}`;

    const promise = axios.get(url);

    return ('function' === typeof callback)
      ? promise.then(result => callback(result))
      : promise;
  }

  public static genomicCoordinatesByAccession(accessions: string[], callback: Function = null) : any {
    let queryString: string = Helpers.stringOrArrayToCommaSeparated(accessions);

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
      results.proteins = {};

      const processProteinDetails: Function = (protein: any) => {
        let details: any = {
          accession: 'NA',
          name: 'NA',
          geneName: 'NA',
          transcriptId: 'NA',
          position: {
            start: 'NA',
            end: 'NA'
          }
        };

        details.accession = protein.accession;

        if (protein.protein &&
            protein.protein.recommendedName &&
            protein.protein.recommendedName.fullName
        ) {
          details.name = protein.protein.recommendedName.fullName.value;
        }

        else if (
          protein.protein &&
          protein.protein.submittedName &&
          protein.protein.submittedName[0] &&
          protein.protein.submittedName[0].fullName
        ) {
          details.name = protein.protein.submittedName[0].fullName.value;
        }

        details.geneName = (protein.gene && protein.gene[0] && protein.gene[0].name)
          ? protein.gene[0].name.value
          : 'NA';

        results.proteins[protein.accession] = details;
      };

      const processCoordinateDetails: Function = (coordinate: any) => {
        if ('undefined' === typeof coordinate) {
          return;
        }

        let details: any = results.proteins[coordinate.accession];
        const geneCoordinates: any = coordinate.gnCoordinate[0];
        const geneLocation: any = geneCoordinates.genomicLocation;

        details.transcriptId = geneCoordinates.ensemblTranscriptId;

        details.position = {
          start: geneLocation.start,
          end: geneLocation.end
        };
      };

      for(let i = 0; i < protein.data.length; i++) {
        processProteinDetails(protein.data[i]);
      }

      for(let i = 0; i < coordinates.data.length; i++) {
        processCoordinateDetails(coordinates.data[i]);
      }

      return callback(results);
    };

    return ('function' === typeof callback)
      ? promise.then(axios.spread(proccess))
      : promise;
  }
}
