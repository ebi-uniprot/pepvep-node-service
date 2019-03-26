import UniProtKB from '../data-fetch/UniProtKB';
import VEP from '../data-fetch/VEP';

export default class VCF {
  public static async processVCFInput(species: string, variants: string[]) {
    const vcfResults: any[] = [];

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
    let vepData = undefined;
    let uniprotData = undefined;

    const consequences = {};

    await VEP.variantConsequencesBatch(species, variants)
    .then(({ data }) => {
      const result = data[0];
      chromosome = result.seq_region_name;
      const position: number = (result.start <= result.end)
        ? result.start
        : result.end;

      allele = result.allele_string;
      start = result.start;
      end = result.end;
      vepData = result;

      result.transcript_consequences
        .forEach((item) => {
          const id = item.transcript_id;
          const impact = item.impact;

          if (typeof consequences[id] === 'undefined') {
            consequences[id] = [];
          }

          consequences[id].push(impact);
        });

      return UniProtKB.getProteinsByPosition(chromosome, position);
    })
    .then(({ data }) => {
      const result = data[0];

      uniprotData = result;

      if (typeof result !== 'undefined') {
        result.gnCoordinate
          .forEach((item) => {
            const row: any = emptyRow();

            row.allele = allele;
            row.start = start;
            row.end = end;
            row.chromosome = chromosome;
            row.proteinAccession = result.accession;
            row.proteinName = result.name;
            row.geneName = result.gene[0].value;
            row.transcriptId = item.ensemblTranscriptId;
            row.impact = consequences[item.ensemblTranscriptId].join(',');
            row.VEP = vepData;
            row.UNI = uniprotData;

            vcfResults.push(row);
          });
      }
    })
    .catch(err => console.log(err));

    return vcfResults;
  }
}
