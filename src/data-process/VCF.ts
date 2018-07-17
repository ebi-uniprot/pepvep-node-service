
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

    let chromosome = undefined;
    let allele = undefined;
    let start = undefined;
    let end = undefined;
    let VEPData = undefined;
    let UNIData = undefined;

    let consequences = {};

    await VEP.variantConsequencesBatch(species, variants)
    .then(({ data }) => {

      data = data[0];
      chromosome = data.seq_region_name;
      const position: number = (data.start <= data.end)
        ? data.start
        : data.end;

      allele = data.allele_string;
      start = data.start;
      end = data.end;
      VEPData = data;

      data.transcript_consequences
        .forEach(item => {
          const id = item.transcript_id;
          const impact = item.impact;

          if ('undefined' === typeof consequences[id]) {
            consequences[id] = [];
          }

          consequences[id].push(impact);
        });

      return UniProtKB.getProteinsByPosition(chromosome, position);
    })
    .then(({ data }) => {
      data = data[0];

      UNIData = data;

      if ('undefined' !== typeof data) {

        data.gnCoordinate
          .forEach(item => {

            let row: any = emptyRow();

            row.allele = allele;
            row.start = start;
            row.end = end;
            row.chromosome = chromosome;
            row.proteinAccession = data.accession;
            row.proteinName = data.name;
            row.geneName = data.gene[0].value;
            row.transcriptId = item.ensemblTranscriptId;
            row.impact = consequences[item.ensemblTranscriptId].join(',');
            row.VEP = VEPData;
            row.UNI = UNIData;
            
            VCFResults.push(row);
          });
      }
    })
    .catch(err => console.log(err));

    return VCFResults;
  }
}
