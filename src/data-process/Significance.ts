import UniProtKB from '../data-fetch/UniProtKB';
import Protein from '../data-structure/Protein';
import Feature from '../data-structure/significance/Feature';
import Evidence from '../data-structure/significance/Evidence';

export default class Significance {
  public static async addPositionalSignificance (proteins: Protein[], featuresResults: any) {
    const protein: Protein = proteins
      .find(p => (p.accession === featuresResults.accession));

    protein.getVariations()
      .forEach(v => v.addOverlappingFeatures(featuresResults.features));
  }

  public static parseHGVS(hgvsString: string) {
    // NC_000021.9:g.25905030G>C
    const regex = /([\w.-]+)(:)([cgmnpr])\.(\d+)(.)>(.)/g;
    const matches = regex.exec(hgvsString);
    return {
      chromosome: matches[1],
      position: parseInt(matches[4], 10),
      wt: matches[5],
      allele: matches[6],
    };
  }

  // public static async getClinicalSignificance(
  //   accession: string,
  //   chromosome: string,
  //   position: number,
  //   allele: string
  // ) {
  //   const variants = await UniProtKB.getProteinVariants(accession);
  //   return variants.data.features.filter(variant => {
  //     if (!variant.genomicLocation) {
  //       return;
  //     }
  //     const hgvs = this.parseHGVS(variant.genomicLocation);
  //     //TODO we need to add the chromosome number
  //     return hgvs.position === position && hgvs.allele === allele;
  //   });
  // }
}
