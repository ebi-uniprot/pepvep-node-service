import * as crypto from 'crypto';
import to from 'await-to-js';

import UniProtKB from '../data-fetch/UniProtKB';
import VEP from '../data-fetch/VEP';
import PDBe from '../data-fetch/PDBe';
import SearchResults from '../data-structure/SearchResults';
import VEPDataProcessor from '../data-process/VEPDataProcessor';
import UniProtDataProcessor from '../data-process/UniProtDataProcessor';
import PDBeDataProcessor from '../data-process/PDBeDataProcessor';

export default class Search {
  private results: SearchResults = new SearchResults();
  private errorMessages = {
    vep: {
      region: {
        title: 'API Error',
        message: 'Call to VEP API failed.',
      },
    },
    uniprot: {
      proteins: {
        title: 'API Error',
        message: 'Call to UniProt/Proteins API has failed. Some data from the results will be missing.',
      },
      features: {
        title: 'API Error',
        message: 'Call to UniProt/Features API has failed. Some data from the results will be missing.',
      },
      variation: {
        title: 'API Error',
        message: 'Call to UniProt/Variation API has failed. Some data from the results will be missing.',
      },
    },
    pdbe: {
      summary_stats: {
        title: 'API Error',
        message: 'Call to PDBe API has failed. Some data from the results will be missing.',
     },
   },
  };

  public async vepInputSearch(
    organism: string,
    input: string,
    download: boolean = false
  ) {
    let [vepAPIError, vepOutput] = await to(VEP
      .variantConsequencesAllInputs(organism, input));

    if (vepAPIError) {
      this.results.errors.push(this.errorMessages.vep.region);
      return Promise.reject([vepAPIError, null]);
    }

    await VEPDataProcessor.process(this.results, vepOutput.data);

    let [proteinsAPIError, proteinDetailsData] = await to(UniProtKB
      .getProteinDetailByAccession(this.results.getAccessionsAsArray(false)));

    if (proteinsAPIError) {
      proteinDetailsData = {data: []};
      this.results.errors.push(this.errorMessages.uniprot.proteins);
    }

    await UniProtDataProcessor.processProteinDetails(this.results, proteinDetailsData.data);

    let [variationAPIError, proteinVariantsData] = await to(UniProtKB
      .getProteinVariants(this.results.getAccessionsAsArray()));

    if (variationAPIError) {
      proteinVariantsData = {data: []};
      this.results.errors.push(this.errorMessages.uniprot.variation);
    }

    await UniProtDataProcessor.processProteinVariantData(this.results, proteinVariantsData.data);

    const structuralQueryInput = this.results.getProteinAcccessionsAndPositionHits();
    let [pdbeAPIError, proteinStructuralData] = await to(PDBe
      .getProteinStructureSummary(structuralQueryInput));

    if (pdbeAPIError) {
      proteinStructuralData = [];
      this.results.errors.push(this.errorMessages.pdbe.summary_stats);
    }

    await PDBeDataProcessor.process(this.results, proteinStructuralData);
    if (download) {
      return Promise.resolve(
        this.results.generateDownloadableData()
      );
    }

    return Promise.resolve(
      this.results.generateResultTableData()
    );
  }
}
