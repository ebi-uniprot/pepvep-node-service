import UniProtKB from '../data-fetch/UniProtKB';

export default class Significance {

    public static getPositionalSignificance(chromosome: string, position: number, callback: Function = null): any {
        UniProtKB.getProteinsByPosition(chromosome, position).then(proteins => {
            for(let protein of proteins.data) {
                for(let gnCoordinate of protein.gnCoordinate) {
                    // console.log(gnCoordinate.genomicLocation.start, position, gnCoordinate.genomicLocation.end);
                    if(Number(gnCoordinate.genomicLocation.start) < position 
                        && Number(gnCoordinate.genomicLocation.end) > position) {
                            console.log(gnCoordinate.genomicLocation.start);
                        }
                }
            }
        });
    }

    private static getOverlappingFeatures(position:number): Array {

    }

}