import axios from 'axios';

import Helpers from './Helpers';

const taxID = '9606';

export default class UniProtKB {

  public static async proteinsDetailByAccession(accessions: string[]) {
    let queryString: string = Helpers.stringOrArrayToCommaSeparated(accessions);
    const url: string = `https://www.ebi.ac.uk/proteins/api/proteins?format=json&accession=${queryString}`;
    return await axios.get(url);
  }

  public static async genomicCoordinatesByAccession(accessions: string[]) {
    let queryString: string = Helpers.stringOrArrayToCommaSeparated(accessions);

    const url: string = `https://www.ebi.ac.uk/proteins/api/coordinates?format=json&accession=${queryString}`;
    return await axios.get(url);
  }

  public static async getProteinFeatures(accession: string) {
    const url: string = `https://www.ebi.ac.uk/proteins/api/features/${accession}`;
    return await axios.get(url);
  }

  public static async impactSearchByProteinAccessions(accessions: string[]) {
    const promise = axios.all([
      this.proteinsDetailByAccession(accessions),
      this.genomicCoordinatesByAccession(accessions),
    ]);

    function proccess(protein: any, coordinates: any): any {
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
        } else if (
          protein.protein &&
          protein.protein.submittedName &&
          protein.protein.submittedName[0] &&
          protein.protein.submittedName[0].fullName
        ) {
          details.name = protein.protein.submittedName[0].fullName.value;
        }

        details.geneName = (protein.gene && protein.gene[0] && protein.gene[0].name) ?
          protein.gene[0].name.value :
          'NA';

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

      for (let i = 0; i < protein.data.length; i++) {
        processProteinDetails(protein.data[i]);
      }

      for (let i = 0; i < coordinates.data.length; i++) {
        processCoordinateDetails(coordinates.data[i]);
      }

      return results;
    };

    return promise
      .then(axios.spread(proccess));
  }

  public static async getProteinsByPosition(chromosome: string, position: number) {
    const url: string = `https://www.ebi.ac.uk/proteins/api/coordinates/${taxID}/${chromosome}:${position}-${position}?format=json&in_range=false`;
    return await axios.get(url);
  }

  public static async getProteinVariants(accession: string) {
    const url: string = `https://www.ebi.ac.uk/proteins/api/variation/${accession}`;
    return await axios.get(url);
  }

  public static async getProteinsByMultiplePositions(positions: string[]) {
    const positionsString: string = positions.join(',').slice(0, -1);
console.log("Positions :::", positionsString);
    const url: string = `http://wwwdev.ebi.ac.uk/proteins/api/coordinates/${taxID}/${positionsString}?format=json&in_range=false`;
console.log("---- UniProt URL:", url);
    return await axios.get(url);
  }
}