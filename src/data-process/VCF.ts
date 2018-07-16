
import UniProtKB from '../data-fetch/UniProtKB';
import VEP from '../data-fetch/VEP';

export default class VCF {

  public static async processVCFInput(species: string, variants: string[]) {
    let VCFResults: any[] = [];

    const emptyRow = () => ({
      proteinAccession: undefined,
      proteinName: undefined,
      geneName: undefined,
      start: undefined,
      end: undefined,
      chromosome: undefined,
      allele: undefined,
    });

    await VEP.variantConsequencesBatch(species, variants)
    .then(({ data }) => {
// console.log("VEP:::", data);
      data = data[0];
      const chromosome: string = data.seq_region_name;
      const position: number = (data.start <= data.end)
        ? data.start
        : data.end;

      // VCFResults = data;
      let row: any = emptyRow();

      row.allele = data.allele_string;
      row.start = data.start;
      row.end = data.end;
      row.chromosome = data.seq_region_name;

      row.VEP = data;
      VCFResults[0] = row;

      return UniProtKB.getProteinsByPosition(chromosome, position);
    })
    .then(({ data }) => {
// console.log("UNI:::", data);
      data = data[0];

      if ('undefined' !== typeof data) {
        let row = VCFResults[0];
        row.proteinAccession = data.accession;
        row.proteinName = data.name;
        row.geneName = data.gene[0].value;
        row.transcriptIds = data.gnCoordinate
          .reduce((a, c) => {
            return ('undefined' !== typeof c.ensemblTranscriptId)
              ? c.ensemblTranscriptId + ';' + a
              : '';
            }, '');
        row.UNI = data;
      }


      // VCFResults = ('undefined' !== typeof data)
      //   ? data
      //   : ['No Data'];
    })
    .catch(err => console.log(err));

    return VCFResults;
  }
}
