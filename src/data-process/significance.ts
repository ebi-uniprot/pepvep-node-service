import UniProtKB from '../data-fetch/UniProtKB';

export default class Significance {

    public static async getPositionalSignificance(chromosome: string, position: number, callback: Function = null) {
        const positionalSignificance = await UniProtKB.getProteinsByPosition(chromosome, position).then(proteins => {
            const matching = proteins.data.reduce((matches, protein) => {
                const matchingGeneCoordinates = this.getMatchingGeneCoordinates(protein.gnCoordinate, position, chromosome);
                const coordinatesWithmatchingFeatures = matchingGeneCoordinates.filter(geneCoordinate => this.getMatchingFeatures(geneCoordinate.feature, position));
                if (coordinatesWithmatchingFeatures.length > 0) {
                    matches.push({
                        accession: protein.accession,
                        name: protein.name,
                        protein: protein.protein,
                        gene: protein.gene,
                        geneCoordinates: coordinatesWithmatchingFeatures,
                    });
                }
                return matches;
            }, []);
            return matching;
        });
        return positionalSignificance;
    }

    private static getMatchingGeneCoordinates(coordinates, position: number, chromosome: string) {
        return coordinates.filter(gnCoordinate => gnCoordinate.genomicLocation.chromosome === chromosome && Number(gnCoordinate.genomicLocation.start) <= position &&
            Number(gnCoordinate.genomicLocation.end) >= position);
    }

    private static getMatchingFeatures(features, position: Number) {
        return features.filter(feature => feature.genomeLocation.begin.position >= position && feature.genomeLocation.end.position <= position);
    }
}