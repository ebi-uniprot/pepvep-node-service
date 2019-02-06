
import * as crypto from 'crypto';
import * as values from 'object.values';

import Input from './Input';
import Protein from './Protein';
import Gene from './Gene';
import Variation from './Variation';
import ClinicalSignificance from './significance/ClinicalSignificance';
import PositionalSignificance from './significance/PositionalSignificance';
import StructuralSignificance from './significance/StructuralSignificance';
import TranscriptSignificance from './significance/TranscriptSignificance';

interface TypedMap<T> {
  [id: string] : T;
}

export default class SearchResults {
  private _inputs : TypedMap<Input> = {};
  private _proteins : TypedMap<Protein> = {};
  private _genes : TypedMap<Gene> = {};
  private _variations : TypedMap<Variation> = {};

  public idGenerator(value: string) : string {
    return crypto.createHash('md5').update(value).digest('hex');
  }

  public addInput(rawInput: string) : Input {
    const input: Input = new Input(rawInput);
    const id: string = this.idGenerator(input.raw);

    if ('undefined' === typeof this._inputs[id]) {
      this._inputs[id] = input;
    }

    return this._inputs[id];
  }

  public addGene(ensg: string, chromosome: string) : Gene {
    const gene: Gene = new Gene(ensg, chromosome);
    const id: string = this.idGenerator(`${ensg}-${chromosome}`);
    if ('undefined' === typeof this._genes[id]) {
      this._genes[id] = gene;
    }

    return this._genes[id];
  }

  public addProtein(
    ensp: string,
    enst: string,
    uniprotAccessions: string[],
    tremblAccessions: string[],
  ) : Protein | null {
    // choosing what accession should be used for this protein
    let accession: string;

    if ('undefined' !== typeof uniprotAccessions && 0 < uniprotAccessions.length) {
      accession = uniprotAccessions[0];
    } else if ('undefined' !== typeof tremblAccessions && 0 < tremblAccessions.length) {
      accession = tremblAccessions[0];
    } else {
      return null;
    }

    const protein: Protein = new Protein(accession);
    protein.ensp = ensp;
    protein.enst = enst;

    const id: string = this.idGenerator(`${ensp}-${enst}-${accession}`);

    if ('undefined' === typeof this._proteins[id]) {
      this._proteins[id] = protein;
    }

    return this._proteins[id];
  }

  public getProteinsAsArray(shouldExcludeNonPositional: boolean = false) : Protein[] {

    if (shouldExcludeNonPositional) {
      return Object.values(this._proteins)
        .filter(p => p.hasVariationWithProteinPosition());
    }

    return values(this._proteins);
  }

  public getAccessionsAsArray(shouldExcludeNonPositional: boolean = false) : string[] {
    return this.getProteinsAsArray(shouldExcludeNonPositional)
      .map(p => p.accession)
      .reduce((accessions, current) => {
        if (!accessions.includes(current)) {
          accessions.push(current);
        }

        return accessions;
      }, []);
  }

  public addVariation(allele: string, input: string) : Variation {
    const variation: Variation = new Variation(allele);
    // We are going to use the original raw `input` value to generate a unique key
    // for this variation instance.
    const id: string = this.idGenerator(input + Math.random().toString());

    if ('undefined' === typeof this._variations[id]) {
      this._variations[id] = variation;
    }

    return this._variations[id];
  }

  public getProteinsByAccession(accession: string) : Protein[] {
    return this.getProteinsAsArray()
      .filter(p => (accession === p.accession))
  }

  public getProteinVariationsInRange(accession: string, start: number, end: number) : Variation[] {
    const variations: Variation[] = [];

    this.getProteinsByAccession(accession)
      .forEach(protein => {
        protein
          .getVariations()
          .map((v) => (v.isInRange(start, end)) ? v : null)
          .filter(v => v !== null)
          .forEach(v => variations.push(v));
      });

    return variations;
  }

  public getAccessionToVariationMap() {
    const map = {};

    Object.keys(this._inputs)
      .forEach((groupId) => {
        this._inputs[groupId]
          .getGenes()
          .forEach((gene) => {
            gene.getProteins()
              .forEach((protein) => {
                protein.getVariations()
                  .forEach((variation) => {
                    const {
                      accession,
                      ensp,
                      enst,
                    } = protein;

                    const {
                      aminoAcids,
                      proteinStart,
                      proteinEnd,
                    } = variation;

                    const key: string = `${accession}-${proteinStart}:${proteinEnd}-${aminoAcids}-${ensp}-${enst}`;
                    // const key: string = `${accession}-${proteinStart}:${proteinEnd}-${aminoAcids}`;

                    map[key] = variation;
                  });
              });
          });
      });

      return map;
  }

  public generateResultTableData() {
    const json = {};

    Object.keys(this._inputs)
      .forEach((groupId) => {
        if ('undefined' === typeof json[groupId]) {
          json[groupId] = {
            key: groupId,
            input: this._inputs[groupId].raw,
            rows: this._inputs[groupId]
              .getGenes()
              .reduce(
                (accu, gene) => {
                  gene.getProteins()
                    .forEach((protein) => {
                      const row: any = {
                        gene: {},
                        protein: {},
                        significances: {},
                      };

                      row.gene['ensgId'] = gene.ensg;
                      row.gene['chromosome'] = gene.chromosome;
                      row.gene['enstId'] = protein.enst;
                      row.gene['symbol'] = gene.symbol;
                      row.gene['source'] = gene.source;

                      protein.getVariations()
                        .forEach((variation) => {
                          row.gene.allele = variation.allele;
                          row.gene.start = variation.genomicVariationStart;
                          row.gene.end = variation.genomicVariationEnd;
                          // row.gene.mostSevereConsequence = variation.mostSevereConsequence;
                          row.gene.hgvsg = variation.hgvsg;
                          row.gene.hgvsp = variation.hgvsp;
                          row.gene.codons = variation.codons;
                          row.protein.accession = protein.accession;
                          row.protein.variant = variation.aminoAcids;
                          row.protein.threeLetterCodes = variation.threeLetterCodes;
                          row.protein.start = variation.proteinStart;
                          row.protein.end = variation.proteinEnd;
                          row.protein.name = protein.name;
                          row.protein.length = protein.length;
                          // row.variation = variation
                          row.protein.canonical = variation.canonical;                      

                          const positinalSignificances: any = {
                            features: variation.getPositionalSignificance().getFeatures(),
                          };

                          row.significances['positional'] = (0 < positinalSignificances.features.length)
                            ? positinalSignificances
                            : undefined;

                          const transcriptSignificances = variation
                            .getTranscriptSignificance()
                            .map(ts => ts.toJSON());

                          row.significances['transcript'] = (0 < transcriptSignificances.length)
                            ? transcriptSignificances
                            : undefined;

                          const clinicalSignificances: ClinicalSignificance = variation
                            .getClinicalSignificances();

                          row.significances['clinical'] = (clinicalSignificances)
                            ? clinicalSignificances.toJSON()
                            : undefined;

                          const structuralSignificances = variation
                            .getStructuralSignificances()
                            .map(ss => ss.toJSON());

                          row.significances['structural'] = (0 < structuralSignificances.length)
                            ? structuralSignificances
                            : undefined;
                        });
                      
                      accu.push(row);
                    });

                  return accu;
                },
                [],
            ),
          };
        }
      });

    return json;
  }
}
