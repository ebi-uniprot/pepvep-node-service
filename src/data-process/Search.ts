
import * as crypto from 'crypto';

import UniProtKB from '../data-fetch/UniProtKB';
import VEP from '../data-fetch/VEP';
import Significance from './Significance';
import SearchResults from '../data-structure/SearchResults';
import Input from '../data-structure/Input';
import Gene from '../data-structure/Gene';

export default class Search {
  public async vepInputSearch(organism: string, input: string) {
    // --> RESULTS
    const results: SearchResults = new SearchResults();

    /**
     * Assuming the input is one of the default VEP inputs, we would
     * just pass the input to VEP end-point and consume the result.
     * Note: this has to change later as we would need to handle both
     * Genomic (VEP) and Protein (UniProt) input variants.
     */
    await VEP.variantConsequencesAllInputs(organism, input)
      .then(({ data }) => {
        // console.log("VEP data:", JSON.stringify(data));
        data.forEach(VEPOutput => {
          // --> INPUT
          const input: Input = results.addToInputs(VEPOutput.input);

          /* Looping through Transcript Consequences to collect some useful information. */
          if ('undefined' !== typeof VEPOutput.transcript_consequences) {
            VEPOutput.transcript_consequences
              .forEach(tc => {
                // --> GENE
                const gene: Gene = results.addToGenes(tc.gene_id, VEPOutput.seq_region_name, VEPOutput.start, VEPOutput.end);
                /* Connecting the Input instance to this Gene instance */
                input.addToGenes(gene);
              });
          }
        });

      });

  }
}
