
import * as crypto from 'crypto';

import UniProtKB from '../data-fetch/UniProtKB';
import VEP from '../data-fetch/VEP';
import Significance from './Significance';
import SearchResults from '../data-structure/SearchResults';
import Input from '../data-structure/Input';
import Gene from '../data-structure/Gene';
import Protein from '../data-structure/Protein';
import Variation from '../data-structure/Variation';
import TranscriptSignificance from '../data-structure/significance/TranscriptSignificance';
import ClinicalSignificance from '../data-structure/significance/ClinicalSignificance';
import StructuralSignificance from '../data-structure/significance/StructuralSignificance';
import PositionalSignificance from '../data-structure/significance/PositionalSignificance';

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
    return await VEP.variantConsequencesAllInputs(organism, input)
      .then(({ data }) => {

        data.forEach((vepOutput) => {
          // --> INPUT
          const input: Input = results.addInput(vepOutput.input);
// console.log('        ---> VEP output:', JSON.stringify(vepOutput));
          /* Looping through Transcript Consequences to collect some useful information. */
          if ('undefined' !== typeof vepOutput.transcript_consequences) {
            vepOutput.transcript_consequences
              .forEach((tc) => {
                /* If entry doesn't have any UniProt/Trembl accessions, ignore and quit */
                if (
                  ('undefined' === typeof tc.swissprot || 0 >= tc.swissprot.length) &&
                  ('undefined' === typeof tc.trembl || 0 >= tc.trembl.length)
                ) {
                  return;
                }

                // --> GENE
                const gene: Gene = results.addGene(tc.gene_id, vepOutput.seq_region_name);
                gene.symbol = tc.gene_symbol;
                gene.source = tc.gene_symbol_source;
                input.addGene(gene);

                // --> PROTEIN
                const protein: Protein =
                  results.addProtein(tc.protein_id, tc.transcript_id, tc.swissprot, tc.trembl);
                gene.addProtein(protein);

                // --> VARIATION
                const variation: Variation =
                  results.addVariation(vepOutput.allele_string, vepOutput.input);

                variation.proteinStart = (tc.protein_start)
                  ? parseInt(tc.protein_start, 10)
                  : undefined;
                variation.proteinEnd = (tc.protein_end)
                  ? parseInt(tc.protein_end, 10)
                  : undefined;
                variation.genomicVariationStart = parseInt(vepOutput.start, 10);
                variation.genomicVariationEnd = parseInt(vepOutput.end, 10);
                variation.aminoAcids = tc.amino_acids;
                variation.codons = tc.codons;
                variation.baseAndAllele = vepOutput.allele_string;
                variation.buildHGVSg(gene.ensg);
                variation.canonical = (1 === tc.canonical) ? true : false;
                variation.hgvsp = tc.hgvsp;

                const transcriptSignificance: TranscriptSignificance = new TranscriptSignificance();
                transcriptSignificance.biotype = tc.biotype;
                transcriptSignificance.impact = tc.impact;
                transcriptSignificance.polyphenPrediction = tc.polyphen_prediction;
                transcriptSignificance.polyphenScore = tc.polyphen_score;
                transcriptSignificance.siftPrediction = tc.sift_prediction;
                transcriptSignificance.siftScore = tc.sift_score;
                transcriptSignificance.mostSevereConsequence = vepOutput.most_severe_consequence;

                if ('undefined' !== typeof tc.consequence_terms) {
                  tc.consequence_terms
                    .forEach(term => transcriptSignificance.addConsequenceTerm(term));
                }

                variation.addTranscriptSignificance(transcriptSignificance);
                protein.addVariation(variation);
              });
          }

        });

        const shouldExcludeNonPositional: boolean = true;
        return UniProtKB
          .getProteinDetailByAccession(results.getAccessionsAsArray(shouldExcludeNonPositional));
      })
      .then((response) => {
        response.data.forEach((proteinFeaturesResult) => {
// console.log("      >>> Protein Features:", JSON.stringify(proteinFeaturesResult));
        const proteins: Protein[] = results.getProteinsByAccession(proteinFeaturesResult.accession);

          if ('undefined' === typeof proteinFeaturesResult.features) {
            proteinFeaturesResult.features = [];
          }

          Significance.addPositionalSignificance(proteins, proteinFeaturesResult);

          results
            .getProteinsByAccession(proteinFeaturesResult.accession)
            .forEach(p => {
              if ('undefined' !== typeof p) {
                p.name = {
                  full: proteinFeaturesResult.protein && 
                    proteinFeaturesResult.protein.recommendedName &&
                    proteinFeaturesResult.protein.recommendedName.fullName && 
                    proteinFeaturesResult.protein.recommendedName.fullName.value || 'NA',
                  short: proteinFeaturesResult.protein &&
                    proteinFeaturesResult.protein.recommendedName &&
                    proteinFeaturesResult.protein.recommendedName.shortName &&
                    proteinFeaturesResult.protein.recommendedName.shortName.value || 'NA',
                };

                p.taxonomy = proteinFeaturesResult.organism.taxonomy;
                p.length = proteinFeaturesResult.sequence.length;
              }
            });
        });

        return UniProtKB.getProteinVariants(results.getAccessionsAsArray());
      })
      .then((response) => {
        response.data.forEach((proteinVariationResult) => {
          const clinicalSignificances: ClinicalSignificance[] = [];

          proteinVariationResult.features.forEach((feature) => {
            const { accession } = proteinVariationResult;

            const {
              type,
              begin,
              end,
              wildType,
              alternativeSequence,
              genomicLocation,
              association,
              clinicalSignificances,
            } = feature;

            if ('VARIANT' !== type) {
              return;
            }

            if ('undefined' === typeof genomicLocation) {
              return;
            }

            if ('undefined' === typeof association) {
              return;
            }

            if ('undefined' === typeof clinicalSignificances) {
              return;
            }

            const key: string =
              `${accession}-${begin}:${end}-${wildType}/${alternativeSequence}`;

            const accessionToVariationMap = results.getAccessionToVariationMap();
            const variation: Variation = accessionToVariationMap[key];

            if ('undefined' === typeof variation) {
              return;
            }

            const diseaseAssociation: any[] = association
              .filter(a => a.disease);

            if (0 >= diseaseAssociation.length) {
              return;
            }

            const cs: ClinicalSignificance = new ClinicalSignificance(clinicalSignificances, diseaseAssociation);
            variation.addClinicalSignificance(cs);
          });
        });

        return UniProtKB.getProteinDetailByAccession(results.getAccessionsAsArray());
      })
      .then((response) => {
        // Structural Significances
        response.data.forEach((proteinDetails) => {
          const structuralSignificance: StructuralSignificance[] = [];
          let inRange: boolean = false;

          if ('undefined' === typeof proteinDetails.dbReferences || 0 >= proteinDetails.dbReferences.length) {
            return;
          }

          proteinDetails.dbReferences.forEach((dbRef) => {
            const { id, type, properties } = dbRef;

            if ('undefined' === typeof properties) {
              return;
            }

            const { method, chains } = properties;

            if ('PDB' !== type) {
              return;
            }

            if (!['X-ray', 'NMR', 'Model'].includes(method)) {
              return;
            }

            const rangeRegExp = /([0-9]*)-([0-9]*)/g;

            let range;
            while (null !== (range = rangeRegExp.exec(chains))) {
              const rangeStart = parseInt(range[1]);
              const rangeEnd = parseInt(range[2]);

              const structuralSignificance: StructuralSignificance =
                new StructuralSignificance(id, method, [rangeStart, rangeEnd]);

              const variations: Variation[] = results
                .getProteinVariationsInRange(proteinDetails.accession, rangeStart, rangeEnd);

              variations
                .forEach(v => {
                  if (v.isInRange(rangeStart, rangeEnd)) {
                    v.addStructuralSignificance(structuralSignificance);
                  }
                });
            }
          });
        });

        // Positional Significances/Features
        response.data.forEach((proteinDetails) => {

        });

// console.log(">>> RESULTS. >>> ", JSON.stringify(results));

        return results.generateResultTableData();
      })
      .catch(error => {

        if ('undefined' !== typeof error.response) {
          console.log("===> EXCEPTION:", error.response);
        }

        else {
          console.log("===> EXCEPTION:", error);
        }
      })
  }
}
