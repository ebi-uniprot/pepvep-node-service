import UniProtKB from '../data-fetch/UniProtKB';
import Protein from '../data-structure/Protein';
import Feature from '../data-structure/significance/Feature';
import Evidence from '../data-structure/significance/Evidence';
import { featureTypes } from '../data-structure/Variation';

export default class SignificancesHelper {
  public static async addPositionalSignificance (proteins: Protein[], featuresResults: any) {
    proteins
      .filter(p => (p.accession === featuresResults.accession))
      .filter(p => p.hasVariationWithProteinPosition())
      .forEach((p) => {
        const features = featuresResults.features
        .map((feature) => {
          return {
            ...feature,
            typeDescription: featureTypes[feature.type],
          };
        });

        p.getVariations()
          .forEach(v => v.addOverlappingFeatures(features));
      });
  }
}
