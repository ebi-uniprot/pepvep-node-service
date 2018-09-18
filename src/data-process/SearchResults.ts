
import * as crypto from 'crypto';

import UniProtKB from '../data-fetch/UniProtKB';
import VEP from '../data-fetch/VEP';

export default class SearchResults {
  public static async defaultSearch(organism: string, input: string) {
    let results: any[] = [];
    let proteinFeatures: any = {};
    let transcriptConsequences: any = {};

    const emptyGroup = () => ({
      key: undefined,
      input: undefined,
      colocatedVariants: undefined,
      rows: [],
    });

    const emptyRow = () => ({
      protein: {
        accession: undefined,
        name: undefined,
        length: undefined,
        start: undefined,
        end: undefined,
        variant: undefined,
      },
      gene: {
        name: undefined,
        ensgId: undefined,
        enstId: undefined,
        chromosome: undefined,
        start: undefined,
        end: undefined,
        allele: undefined,
      },
      significance: undefined,
    });

    await VEP.variantConsequencesAllInputs(organism, input)
      .then(({ data }) => {
        let positions: string[] = [];
// console.log("**** DATA:", JSON.stringify(data));
        results = data
          .map(query => {
            positions
              .push(`${query.seq_region_name}:${query.start}-${query.end}`);

            let group = emptyGroup();
            group.key = crypto.createHash('md5').update(query.input).digest('hex');
            group.input = query.input;
            group.colocatedVariants = query.colocated_variants;
            group.rows = query.transcript_consequences
              .map(con => {
                let row: any = emptyRow();
                const ensg: string = con.gene_id;
                const enst: string = con.transcript_id;

                if ('undefined' === typeof proteinFeatures[ensg]) {
                  proteinFeatures[ensg] = {};
                  transcriptConsequences[ensg] = {};
                }

                if ('undefined' === typeof proteinFeatures[ensg][enst]) {
                  proteinFeatures[ensg][enst] = [];
                  transcriptConsequences[ensg][enst] = [];
                }

                if ('undefined' !== typeof query.transcript_consequences) {
                  query.transcript_consequences
                    .forEach(c => {
                      if (c.gene_id === ensg && c.transcript_id === enst) {
                        transcriptConsequences[ensg][enst].push(c);
                      }
                    });
                }

                row.protein.start = con.protein_start;
                row.protein.end = con.protein_end;
                row.protein.variant = con.amino_acids;
                row.gene.chromosome = query.seq_region_name;
                row.gene.start = query.start;
                row.gene.end = query.end;
                row.gene.allele = query.allele_string;
                row.gene.ensgId = con.gene_id;
                row.gene.enstId = enst;
                row.proteinFeatures = proteinFeatures[ensg][enst];
                row.transcriptConsequences = transcriptConsequences[ensg][enst];
                return row;
              });
            return group;
          });
        return UniProtKB.getProteinsByMultiplePositions(positions);
      })
      .then(({ data }) => {
        let geneNames : any = {};
// console.log("**** DATA:", JSON.stringify(response.data));
        data.forEach(c => {
            const { gnCoordinate } = c;
            gnCoordinate
              .forEach(g => {
                const ensg : string = g.ensemblGeneId;
                const enst : string = g.ensemblTranscriptId;

                if ('undefined' === typeof proteinFeatures[ensg][enst]) {
                  return;
                }

                geneNames[ensg] = c.gene
                  .find(e => e.type === 'primary')
                  ['value'];      // Pick the value from the object

                g.feature.forEach(f => proteinFeatures[ensg][enst].push(f));
              });
          });

          results.forEach(group => {
            group.rows.forEach(row => {
              row.gene.name = geneNames[row.gene.ensgId];
            });
          });
        });
    return results;
  }
}
