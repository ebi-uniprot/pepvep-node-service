import SearchResults from '../data-structure/SearchResults';
import Protein from '../data-structure/Protein';
import SignificancesHelper from './SignificancesHelper';
import Variation from '../data-structure/Variation';
import ProteinColocatedVariant from '../data-structure/significance/ProteinColocatedVariant';
import ClinicalSignificance from '../data-structure/significance/ClinicalSignificance';

export default abstract class UniProtDataProcessor {
  public static async processProteinDetails(results: SearchResults, data: any) {
    data.forEach((proteinFeaturesResult) => {
      results
        .getProteinsByAccession(proteinFeaturesResult.accession)
        .map((p) => {
          UniProtDataProcessor.collectProteinMetaData(p, proteinFeaturesResult);

          // Picking up the canonical isoform(s) per each protein
          return UniProtDataProcessor.collectIsoformData(
            p,
            proteinFeaturesResult.comments,
            proteinFeaturesResult.dbReferences,
          );
        })
        .forEach((p) => {
          if (!p.hasVariationWithProteinPosition()) {
            p.length = null;
          }
        });

      const proteins: Protein[] =
        results.getProteinsByAccession(proteinFeaturesResult.accession)
          .filter(p => p.canonical);

      if (proteinFeaturesResult.features === undefined) {
        proteinFeaturesResult.features = [];
      }

      SignificancesHelper.addPositionalSignificance(proteins, proteinFeaturesResult);
    });
  }

  public static async processProteinVariantData(results: SearchResults, data: any) {
    data.forEach((proteinVariationResult) => {
      proteinVariationResult.features.forEach((feature) => {
        const { accession } = proteinVariationResult;

        const {
          ftId,
          type,
          begin,
          end,
          wildType,
          alternativeSequence,
          genomicLocation,
          association,
          clinicalSignificances,
          sourceType,
          xrefs,
          polyphenScore,
          siftScore,
        } = feature;

        if ('VARIANT' !== type) {
          return;
        }

        const variationsInRange : Variation[] = results
          .getProteinVariationsInRange(accession, begin, end);

        const proteinColocatedVariant : ProteinColocatedVariant =
          new ProteinColocatedVariant(
            ftId,
            wildType,
            alternativeSequence,
            clinicalSignificances,
            sourceType,
            association,
            xrefs,
            polyphenScore,
            siftScore,
          );

        variationsInRange
          .forEach(v => v.addProteinColocatedVariant(proteinColocatedVariant));
      });

      // Clinical Significances
      const { accession, features } = proteinVariationResult;
      UniProtDataProcessor.collectClinicalSignificancesData(results, accession, features);
    });
  }

  private static collectProteinMetaData(protein: Protein, data: any) {
    if (protein !== undefined) {
      protein.name = {
        full: data.protein &&
          data.protein.recommendedName &&
          data.protein.recommendedName.fullName &&
          data.protein.recommendedName.fullName.value || 'NA',
        short: data.protein &&
          data.protein.recommendedName &&
          data.protein.recommendedName.shortName &&
          data.protein.recommendedName.shortName.value || 'NA',
      };

      protein.taxonomy = data.organism.taxonomy;
      protein.length = data.sequence.length;
      protein.setType(data.info.type);
    }
  }

  private static collectIsoformData(
    protein: Protein,
    comments: any[],
    dbReferences: any[],
  ) : Protein {
    let canonicalIsoforms : string[] = [];
    let canonicalAccession: string;

    if (comments) {
      const altProducts = comments
        .find(c => c.type === 'ALTERNATIVE_PRODUCTS');

      if (altProducts && altProducts.isoforms) {
        canonicalIsoforms = altProducts.isoforms
          .find(i => i.sequenceStatus === 'displayed')
          .ids;
      }
    }

    if (canonicalIsoforms.length > 0) {
      canonicalAccession = canonicalIsoforms[0]
        .split('-')[0];
    }

    // Adding 'isoform' value
    dbReferences
      .forEach((ref) => {
        if (ref.type !== 'Ensembl') {
          return;
        }

        if (ref.id !== protein.enst) {
          return;
        }

        if (ref.isoform === undefined) {
          return;
        }

        protein.isoform = ref.isoform;

        if (canonicalIsoforms.length > 0 && protein.isoform === canonicalIsoforms[0]) {
          protein.canonical = true;
          protein.canonicalAccession = canonicalAccession;
        }
      });

    return protein;
  }

  private static collectClinicalSignificancesData(
    results: SearchResults,
    accession: string,
    features: any[],
  ) {
    features.forEach((feature) => {
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

      if (type !== 'VARIANT') {
        return;
      }

      if (genomicLocation === undefined) {
        return;
      }

      if (association === undefined) {
        return;
      }

      if (clinicalSignificances === undefined) {
        return;
      }

      results.getProteinsByAccession(accession)
        .forEach((protein) => {
          if (!protein.canonical) {
            return
          }

          protein
            .getVariations()
            .forEach((variation) => {
              if (!variation.isInRange(begin, end)) {
                return;
              }

              if (variation.wildType !== wildType
                || variation.alternativeSequence !== alternativeSequence
              ) {
                return;
              }

              const diseaseAssociation: any[] = association
                .filter(a => a.disease);

              if (!diseaseAssociation.length) {
                return;
              }

              const cs: ClinicalSignificance =
                new ClinicalSignificance(clinicalSignificances, diseaseAssociation);

              variation.addClinicalSignificance(cs);
            });
        });
    });
  }
}
