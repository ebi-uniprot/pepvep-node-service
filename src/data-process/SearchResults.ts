
import * as crypto from 'crypto';

import UniProtKB from '../data-fetch/UniProtKB';
import VEP from '../data-fetch/VEP';

export default class SearchResults {
  public static async defaultSearch(organism: string, input: string) {
    let results: any[] = [];
    let features: any = {};
    let consequences: any = {};

    const emptyGroup = () => ({
      key: undefined,
      input: undefined,
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

        results = data
          .map(query => {
            positions
              .push(`${query.seq_region_name}:${query.start}-${query.end}`);

            let group = emptyGroup();
            group.key = crypto.createHash('md5').update(query.input).digest('hex');
            group.input = query.input;
            group.rows = query.transcript_consequences
              .map(con => {
                let row: any = emptyRow();
                const enst: string = con.transcript_id;
console.log("ENST/ENSG:", enst, con.gene_id);
                if ('undefined' === typeof features[enst]) {
                  features[enst] = [];
                  consequences[enst] = [];
                }

                if ('undefined' !== typeof query.transcript_consequences) {
                  query.transcript_consequences
                    .forEach(c => {
                      if (c.transcript_id === enst) {
                        consequences[enst].push(c);
                      }
                    });
                }

                if ('undefined' !== typeof query.colocated_variants) {
                  query.colocated_variants
                    .forEach(c => consequences[enst].push(c));
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
                row.features = features[enst];
                row.consequences = consequences[enst];
                return row;
              });
            return group;
          });
        return UniProtKB.getProteinsByMultiplePositions(positions);
      })
      .then(response => {
// console.log("**** DATA:", JSON.stringify(response.data));
        response.data
          .forEach(c => {
            const { gnCoordinate } = c;
            gnCoordinate
              .forEach(g => {
                const enst : string = g.ensemblTranscriptId;
console.log(">>> ENST/ENSG:", enst, g.ensemblGeneId);
                if ('undefined' === typeof features[enst]) {
                  return;
                }

                g.feature.forEach(f => features[enst].push(f));
              });
          });
console.log("features:", features);
        });
    return results;
  }
}
