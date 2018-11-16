import UniProtKB from "../data-fetch/UniProtKB";
import Protein from "../data-structure/Protein";

export default class Significance {
  public static async getPositionalSignificance(
    proteins: Array<Protein>,
    callback: Function = null
  ) {
    const accessionList = proteins.map(p => p.accession);
    console.log(accessionList);
    const positionalSignificance = await UniProtKB.getProteinFeatures(
      accessionList
    ).then(proteins => {
      //   const matching = proteins.data.reduce((matches, protein) => {
      //     const matchingGeneCoordinates = this.getMatchingGeneCoordinates(
      //       protein.gnCoordinate,
      //       position,
      //       chromosome
      //     );
      //     const coordinatesWithmatchingFeatures = matchingGeneCoordinates.filter(
      //       geneCoordinate =>
      //         this.getMatchingFeatures(geneCoordinate.feature, position)
      //     );
      //     if (coordinatesWithmatchingFeatures.length > 0) {
      //       matches.push({
      //         accession: protein.accession,
      //         name: protein.name,
      //         protein: protein.protein,
      //         gene: protein.gene,
      //         geneCoordinates: coordinatesWithmatchingFeatures
      //       });
      //     }
      //     return matches;
      //   }, []);
      //   return matching;
    });
    return positionalSignificance;
  }

  private static getMatchingGeneCoordinates(
    coordinates,
    position: number,
    chromosome: string
  ) {
    return coordinates.filter(
      gnCoordinate =>
        gnCoordinate.genomicLocation.chromosome === chromosome &&
        Number(gnCoordinate.genomicLocation.start) <= position &&
        Number(gnCoordinate.genomicLocation.end) >= position
    );
  }

  private static getMatchingFeatures(features, position: Number) {
    return features.filter(
      feature =>
        feature.genomeLocation.begin.position >= position &&
        feature.genomeLocation.end.position <= position
    );
  }

  public static parseHGVS(hgvsString: string) {
    // NC_000021.9:g.25905030G>C
    var regex = /([\w.-]+)(:)([cgmnpr])\.(\d+)(.)>(.)/g;
    const matches = regex.exec(hgvsString);
    return {
      chromosome: matches[1],
      position: parseInt(matches[4]),
      wt: matches[5],
      allele: matches[6]
    };
  }

  //   public static async getClinicalSignificance(
  //     accession: string,
  //     chromosome: string,
  //     position: number,
  //     allele: string
  //   ) {
  //     const variants = await UniProtKB.getProteinVariants(accession);
  //     return variants.data.features.filter(variant => {
  //       if (!variant.genomicLocation) {
  //         return;
  //       }
  //       const hgvs = this.parseHGVS(variant.genomicLocation);
  //       //TODO we need to add the chromosome number
  //       return hgvs.position === position && hgvs.allele === allele;
  //     });
  //   }
}
