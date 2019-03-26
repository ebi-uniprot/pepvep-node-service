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
import Helpers from '../data-fetch/Helpers';

interface TypedMap<T> {
  [id: string] : T;
}

export default class SearchResults {
  private _inputs: TypedMap<Input> = {};
  private _proteins: TypedMap<Protein> = {};
  private _genes: TypedMap<Gene> = {};
  private _variations: TypedMap<Variation> = {};

  public idGenerator(value: string) : string {
    return crypto.createHash('md5').update(value).digest('hex');
  }

  public addInput(rawInput: string) : Input {
    const input: Input = new Input(rawInput);
    const id: string = this.idGenerator(input.raw);

    if (typeof this._inputs[id] === 'undefined') {
      this._inputs[id] = input;
    }

    return this._inputs[id];
  }

  public addGene(ensg: string, chromosome: string) : Gene {
    const gene: Gene = new Gene(ensg, chromosome);
    const id: string = this.idGenerator(`${ensg}-${chromosome}`);
    if (typeof this._genes[id] === 'undefined') {
      this._genes[id] = gene;
    }

    return this._genes[id];
  }

  public addProtein(
    ensp: string,
    enst: string,
    swissprotAccessions: string[],
    tremblAccessions: string[],
    uniparcAccessions: string[],
  ) : Protein | null {
    // choosing what accession should be used for this protein
    let accession: string;

    if (typeof swissprotAccessions !== 'undefined' && swissprotAccessions.length > 0) {
      accession = swissprotAccessions[0];
    } else if (typeof tremblAccessions !== 'undefined' && tremblAccessions.length > 0) {
      accession = tremblAccessions[0];
    } else {
      return null;
    }

    const protein: Protein = new Protein(accession);
    protein.ensp = ensp;
    protein.enst = enst;
    protein.swissprotAccessions = swissprotAccessions;
    protein.tremblAccessions = tremblAccessions;
    protein.uniparcAccessions = uniparcAccessions;

    const id: string = this.idGenerator(`${ensp}-${enst}-${accession}`);

    if (typeof this._proteins[id] === 'undefined') {
      this._proteins[id] = protein;
    }

    return this._proteins[id];
  }

  public getProteinsAsArray(shouldExcludeNonPositional: boolean = false) : Protein[] {

    if (shouldExcludeNonPositional) {
      return values(this._proteins)
        .filter(p => p.hasVariationWithProteinPosition());
    }

    return values(this._proteins);
  }

  public getAccessionsAsArray(shouldExcludeNonPositional: boolean = false) : string[] {
    return this.getProteinsAsArray(shouldExcludeNonPositional)
      .map(p => p.accession)
      .reduce(
        (accessions, current) => {
          if (!accessions.includes(current)) {
            accessions.push(current);
          }

          return accessions;
        },
        [],
      );
  }

  public addVariation(allele: string, input: string) : Variation {
    const variation: Variation = new Variation(allele);
    // We are going to use the original raw `input` value to generate a unique key
    // for this variation instance.
    const id: string = this.idGenerator(input + Math.random().toString());

    if (typeof this._variations[id] === 'undefined') {
      this._variations[id] = variation;
    }

    return this._variations[id];
  }

  public getProteinsByAccession(accession: string) : Protein[] {
    return this.getProteinsAsArray()
      .filter(p => (accession === p.accession));
  }

  public getProteinVariationsInRange(
    accession: string,
    start: number,
    end: number,
  ) : Variation[] {
    const variations: Variation[] = [];

    this.getProteinsByAccession(accession)
      .forEach((protein) => {
        protein
          .getVariations()
          .map(v => (v.isInRange(start, end)) ? v : null)
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

                    // tslint:disable:max-line-length
                    const key: string = `${accession}-${proteinStart}:${proteinEnd}-${aminoAcids}`;

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
        if (typeof json[groupId] === 'undefined') {
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
                      row.gene['source'] = gene.symbolSource;

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

                          row.significances['positional'] =
                            (0 < positinalSignificances.features.length)
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

  public generateDownloadableData() {
    const data: any[] = [];

    Object.keys(this._inputs)
      .forEach((groupId) => {
        this._inputs[groupId]
          .getGenes()
          .forEach((gene) => {
            gene.getProteins()
              .forEach((protein) => {
                const row = {
                  input: this._inputs[groupId].raw,
                  most_sever_consequence: null,
                  assembly: gene.assemblyName,
                  chromosome: gene.chromosome,
                  genomic_start: null,
                  genomic_end: null,
                  allele_string: null,
                  variant_allele: null,
                  gene_symbol: gene.symbol,
                  gene_symbol_source: gene.symbolSource,
                  hgnc_id: gene.hgncId,
                  gene_id: gene.ensg,
                  transcript_id: protein.enst,
                  translation_id: protein.ensp,
                  biotype: null,
                  impact: null,
                  consequence_terms: null,
                  swissprot_accessions: (protein.swissprotAccessions || []).join(';'),
                  trembl_accessions: (protein.tremblAccessions || []).join(';'),
                  protein_start: null,
                  protein_end: null,
                  amino_acid_change: null,
                  associated_to_disease: null,
                  disease_categories: null,
                  polyphen_prediction: null,
                  polyphen_score: null,
                  mutation_taster_prediction: null,
                  mutation_taster_score: null,
                  lrt_prediction: null,
                  lrt_score: null,
                  fathmm_prediction: null,
                  fathmm_score: null,
                  provean_prediction: null,
                  provean_score: null,
                  cadd_raw: null,
                  cadd_phred: null,
                  sift_prediction: null,
                  sift_score: null,
                  mutpred_score: null,
                  blosum62: null,
                  appris: null,
                  tsl: null,
                  strand: gene.strand,
                  codons: null,
                  cdna_start: null,
                  cdna_end: null,
                  cds_start: null,
                  cds_end: null,
                  exon: null,
                  uniparc_accessions: (protein.uniparcAccessions || []).join(';'),
                  hgvs_c: null,
                  hgvs_p: null,
                  hgvs_g: null,
                  disease_associations: [],
                  protein_annotations: [],
                };

                protein.getVariations()
                  .forEach((variation) => {
                    if (!row.genomic_start && variation.genomicVariationStart) {
                      row.genomic_start = variation.genomicVariationStart;
                    }

                    if (!row.genomic_end && variation.genomicVariationEnd) {
                      row.genomic_end = variation.genomicVariationEnd;
                    }

                    if (!row.protein_start && variation.proteinStart) {
                      row.protein_start = variation.proteinStart;
                    }

                    if (!row.protein_end && variation.proteinEnd) {
                      row.protein_end = variation.proteinEnd;
                    }

                    if (variation.getTranscriptSignificance().length > 0) {
                      const transcriptConsequence = variation
                          .getTranscriptSignificance()[0];

                      if (transcriptConsequence) {
                        if (!row.most_sever_consequence) {
                          row.most_sever_consequence = transcriptConsequence
                            .mostSevereConsequence;
                        }

                        if (!row.impact) {
                          row.impact = Helpers.toHummanReadable(
                            transcriptConsequence.impact, true, true, true,
                          );
                        }

                        if (!row.consequence_terms) {
                          row.consequence_terms = transcriptConsequence
                            .consequenceTerms
                            .map(term => Helpers.toHummanReadable(term, true, true, true))
                            .join('; ');
                        }

                        if (!row.polyphen_prediction) {
                          row.polyphen_prediction = Helpers.toHummanReadable(
                            transcriptConsequence.polyphenPrediction, true, true, true,
                          );
                        }

                        if (!row.polyphen_score) {
                          row.polyphen_score = transcriptConsequence
                            .polyphenScore;
                        }

                        if (!row.mutation_taster_prediction) {
                          row.mutation_taster_prediction = transcriptConsequence
                            .mutationTasterPrediction;
                        }

                        if (!row.mutation_taster_score) {
                          row.mutation_taster_score = transcriptConsequence
                            .mutationTasterScore;
                        }

                        if (!row.lrt_prediction) {
                          row.lrt_prediction = transcriptConsequence
                            .lrtPrediction;
                        }

                        if (!row.lrt_score) {
                          row.lrt_score = transcriptConsequence
                            .lrtScore;
                        }

                        if (!row.fathmm_prediction) {
                          row.fathmm_prediction = transcriptConsequence
                            .fathmmPrediction;
                        }

                        if (!row.fathmm_score) {
                          row.fathmm_score = transcriptConsequence
                            .fathmmScore;
                        }

                        if (!row.provean_prediction) {
                          row.provean_prediction = transcriptConsequence
                            .proveanPrediction;
                        }

                        if (!row.provean_score) {
                          row.provean_score = transcriptConsequence
                            .proveanScore;
                        }

                        if (!row.biotype) {
                          row.biotype = Helpers.toHummanReadable(
                            transcriptConsequence.biotype, true, true, true,
                          );
                        }

                        if (!row.cadd_phred) {
                          row.cadd_phred = transcriptConsequence.caddPhred;
                        }

                        if (!row.cadd_raw) {
                          row.cadd_raw = transcriptConsequence.caddRaw;
                        }

                        if (!row.appris) {
                          row.appris = transcriptConsequence.appris;
                        }

                        if (!row.sift_prediction) {
                          row.sift_prediction = Helpers.toHummanReadable(
                            transcriptConsequence.siftPrediction, true, true, true,
                          );
                        }

                        if (!row.sift_score) {
                          row.sift_score = transcriptConsequence.siftScore;
                        }

                        if (!row.mutpred_score) {
                          row.mutpred_score = transcriptConsequence
                            .mutPredScore;
                        }

                        if (!row.blosum62) {
                          row.blosum62 = transcriptConsequence.blosum62;
                        }

                        if (!row.tsl) {
                          row.tsl = transcriptConsequence.tsl;
                        }
                      }
                    }

                    if (!row.allele_string && variation.baseAndAllele) {
                      row.allele_string = variation.baseAndAllele;
                    }

                    if (!row.amino_acid_change && variation.aminoAcids) {
                      row.amino_acid_change = variation.aminoAcids;
                    }

                    if (!row.variant_allele && variation.variantAllele) {
                      row.variant_allele = variation.variantAllele;
                    }

                    if (!row.hgvs_c && variation.hgvsc) {
                      row.hgvs_c = variation.hgvsc;
                    }

                    if (!row.hgvs_p && variation.hgvsp) {
                      row.hgvs_p = variation.hgvsp;
                    }

                    if (!row.hgvs_g && variation.hgvsg) {
                      row.hgvs_g = variation.hgvsg;
                    }

                    if (!row.codons) {
                      row.codons = variation.codons;
                    }

                    if (!row.cdna_start) {
                      row.cdna_start = variation.cdnaStart;
                    }

                    if (!row.cdna_end) {
                      row.cdna_end = variation.cdnaEnd;
                    }

                    if (!row.cds_start) {
                      row.cds_start = variation.cdsStart;
                    }

                    if (!row.cds_end) {
                      row.cds_end = variation.cdsEnd;
                    }

                    if (!row.exon) {
                      row.exon = variation.exon;
                    }

                    variation.getPositionalSignificance()
                      .getFeatures()
                      .forEach((feature) => {
                        let featureDetails = `type=${
                          Helpers.toHummanReadable(feature.type, true, true, true)
                        }`;
                        featureDetails += `,category=${
                          Helpers.toHummanReadable(feature.category, true, true, true)
                        }`;
                        featureDetails += (feature.description)
                          ? `,description=${feature.description.replace(/,/ig, '')}`
                          : '';
                        featureDetails += `,start=${feature.begin}`;
                        featureDetails += `,end=${feature.end}`;

                        const featureEvidences = [];
                        feature.evidences
                          .forEach((featureEvidence) => {
                            featureEvidences.push(
                              `${featureEvidence.sourceName}:${featureEvidence.sourceId}`,
                            );
                          });

                        if (featureEvidences.length > 0) {
                          featureDetails += `,evidences=${featureEvidences.join(';')}`;
                        }

                        row.protein_annotations.push(featureDetails);
                      });

                    const clinicalSignificances = variation.getClinicalSignificances();

                    if (clinicalSignificances) {
                      if (clinicalSignificances.association.length > 0) {
                        row.associated_to_disease = 'Yes';

                        clinicalSignificances.association
                          .forEach((disease) => {
                            let diseaseDetails = `disease=${disease.disease}`;
                            diseaseDetails += (disease.name)
                              ? `,name=${disease.name.replace(/,/ig, '')}`
                              : '';
                            diseaseDetails += (disease.description)
                              ? `,description=${disease.description.replace(/,/ig, '')}`
                              : '';

                            const diseaseEvidences = [];
                            disease.evidences
                              .forEach((diseaseEvidence) => {
                                diseaseEvidences.push(
                                  `${diseaseEvidence.source.name}:${diseaseEvidence.source.id}`,
                                );
                              });

                            if (diseaseEvidences.length > 0) {
                              diseaseDetails += `,evidences=${diseaseEvidences.join(';')}`;
                            }

                            row.disease_associations.push(diseaseDetails);
                          });
                      }
                      row.disease_categories = clinicalSignificances
                        .value
                        .map(category => Helpers.toHummanReadable(category, true, true, true))
                        .join(', ');
                    }
                  });

                // Add the row to the results
                data.push(row);
              });
          });
      });

    if (data.length === 0) {
      return '';
    }

    // Add "double-qoutes" to all fields
    data.forEach((row) => {
      Object.keys(row)
        .forEach((key) => {
          if (row[key]) {
            if (key === 'protein_annotations') {
              row.protein_annotations = row.protein_annotations.join('|');
            }

            row[key] = JSON.stringify(row[key].toString());
          }
        });
    });

    // Create the headers dynamically
    data.unshift(Object.keys(data[0]).map(k => k.toUpperCase()));

    return this.jsonToCSV(data);
  }

  jsonToCSV(json: any[]) : string {
    return json
      .reduce(
        (csv, row) => {
          let output = csv;

          output += values(row)
            .join(',');

          output += '\n';

          return output;
        },
        '',
      );
  }
}
