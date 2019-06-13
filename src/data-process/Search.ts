import * as crypto from 'crypto';

import UniProtKB from '../data-fetch/UniProtKB';
import VEP from '../data-fetch/VEP';
import PDBe from '../data-fetch/PDBe';
import SearchResults from '../data-structure/SearchResults';
import VEPDataProcessor from '../data-process/VEPDataProcessor';
import UniProtDataProcessor from '../data-process/UniProtDataProcessor';
import PDBeDataProcessor from '../data-process/PDBeDataProcessor';

export default class Search {
  private results: SearchResults = new SearchResults();

  public async vepInputSearch(organism: string, input: string, download: boolean = false) {
    const vepOutput = await VEP
      .variantConsequencesAllInputs(organism, input);
    await VEPDataProcessor.process(this.results, vepOutput.data);

    const proteinDetailsData = await UniProtKB
      .getProteinDetailByAccession(this.results.getAccessionsAsArray(false));
    await UniProtDataProcessor.processProteinDetails(this.results, proteinDetailsData.data);

    const protainVariantsData = await UniProtKB
      .getProteinVariants(this.results.getAccessionsAsArray());
    await UniProtDataProcessor.processProteinVariantData(this.results, protainVariantsData.data);

    const structuralQueryInput = this.results.getProteinAcccessionsAndPositionHits();
    const proteinStructuralData = await PDBe
      .getProteinStructureSummary(structuralQueryInput);
    await PDBeDataProcessor.process(this.results, proteinStructuralData);

    if (download) {
      return this.results.generateDownloadableData();
    }

    return this.results.generateResultTableData();
  }
}
