
import * as crypto from 'crypto';

import UniProtKB from '../data-fetch/UniProtKB';
import VEP from '../data-fetch/VEP';
import Significance from './Significance';
import SearchResults from '../data-structure/SearchResults';
import Input from '../data-structure/Input';
import Gene from '../data-structure/Gene';
import Protein from '../data-structure/Protein';
import Variation from '../data-structure/Variation';

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
        data.forEach((vepOutput) => {
          // --> INPUT
          const input: Input = results.addInput(vepOutput.input);

          /* Looping through Transcript Consequences to collect some useful information. */
          if ('undefined' !== typeof vepOutput.transcript_consequences) {
            vepOutput.transcript_consequences
              .forEach((tc) => {
                /* If entry doesn't have any UniProt/Trembl accessions, ignore and quit */
                if ('undefined' === typeof tc.swissprot || 0 >= tc.swissprot.length) {
                  return;
                }

                if ('undefined' === typeof tc.trembl || 0 >= tc.trembl.length) {
                  return;
                }

                // --> GENE
                const gene: Gene = results.addGene(tc.gene_id, vepOutput.seq_region_name);
                input.addGene(gene);

                // --> PROTEIN
                const protein: Protein =
                  results.addProtein(tc.protein_id, tc.transcript_id, tc.swissprot, tc.trembl);
                gene.addProtein(protein);

                // --> VARIATION
                const variation: Variation =
                  results.addVariation(tc.allele_string, vepOutput.input);
                protein.addVariation(variation);
              });
          }
        });

      });

  }
}
