import * as crypto from 'crypto';
import * as values from 'object.values';

import Input from './Input';
import Protein, { ProteinType } from './Protein';
import Gene from './Gene';
import Variation from './Variation';
import ClinicalSignificance from './significance/ClinicalSignificance';
import PositionalSignificance from './significance/PositionalSignificance';
import StructuralSignificance from './significance/StructuralSignificance';
import TranscriptSignificance from './significance/TranscriptSignificance';
import GenomicSignificance from './significance/GenomicSignificance';
import Helpers from './../data-fetch/Helpers';

// A generic type for dictionary-like objects
interface TypedMap<T> {
  [id: string] : T;
}

export default class SearchResults {
  private _inputs: TypedMap<Input> = {};
  private _proteins: TypedMap<Protein> = {};
  private _genes: TypedMap<Gene> = {};
  private _variations: TypedMap<Variation> = {};
  public errors: any[] = [];

  public idGenerator(value: string) : string {
    return crypto.createHash('md5').update(value).digest('hex');
  }

  public addInput(rawInput: string) : Input {
    const input: Input = new Input(rawInput);
    const id: string = this.idGenerator(input.raw);

    if (this._inputs[id] === undefined) {
      this._inputs[id] = input;
    }

    return this._inputs[id];
  }

  public addGene(input: string, ensg: string, chromosome: string) : Gene {
    const gene: Gene = new Gene(ensg, chromosome);
    const id: string = this.idGenerator(`${input}-${ensg}-${chromosome}`);
    if (this._genes[id] === undefined) {
      this._genes[id] = gene;
    }

    return this._genes[id];
  }

  public addProtein(
    input: string,
    ensp: string,
    enst: string,
    swissprotAccessions: string[],
    tremblAccessions: string[],
    uniparcAccessions: string[],
  ) : Protein | null {
    // choosing what accession should be used for this protein
    let accession: string;

    if (swissprotAccessions !== undefined && swissprotAccessions.length > 0) {
      accession = swissprotAccessions[0];
    } else if (tremblAccessions !== undefined && tremblAccessions.length > 0) {
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

    const id: string = this.idGenerator(`${input}-${ensp}-${enst}-${accession}`);

    if (this._proteins[id] === undefined) {
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
    const id: string = this.idGenerator(input + crypto.randomBytes(20).toString('hex'));

    if (this._variations[id] === undefined) {
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

  public getProteinAcccessionsAndPositionHits() {
    let hits = {};

    Object.keys(this._inputs)
      .forEach((groupId) => {
        this._inputs[groupId]
          .getGenes()
          .forEach((gene) => {
            gene.getProteins()
              .forEach((protein) => {
                protein.getVariations()
                  .forEach((variation) => {
                    const { accession } = protein;
                    const {
                      proteinStart,
                      proteinEnd,
                    } = variation;

                    if (!hits[accession]) {
                      hits[accession] = {
                        accession,
                        'positions': [],
                      };
                    }

                    if (proteinStart !== null && proteinStart !== undefined) {
                      let range;

                      if (proteinStart === proteinEnd) {
                        range = [proteinStart];
                      } else {
                        range = new Array(proteinEnd - proteinStart)
                          .fill(0)
                          .map((_, i) => proteinStart + i);
                      }

                      range.forEach((pos) => {
                        // if not already in the 
                        if (hits[accession].positions.indexOf(pos) === -1) {
                          hits[accession].positions.push(pos);
                        }
                      });

                      hits[accession].positions.concat(range);
                    }
                  });
              });
          });
      });

    hits = values(hits)
      .filter(el => el.positions.length > 0)
      .map(el => {
        el.positions = el.positions
          .sort((a, b) => a - b)
          .map(p => p.toString());

        return el;
      });

    return hits;
  }

  private createEmptyResultsTableRow() {
    return {
      gene: {},
      protein: {},
      significances: {},
      variation: {},
    }
  }

  private addGeneDataToSearchResultsRow(row: any, gene: Gene) {
    row.gene['ensgId'] = gene.ensg;
    row.gene['chromosome'] = gene.chromosome;
    row.gene['symbol'] = gene.symbol;
    row.gene['source'] = gene.symbolSource;
  }

  private addProteinDataToSearchResultsRow(row: any, protein: Protein) {
    row.gene['enstId'] = protein.enst;
  }

  private addVariationDataToSearchresultsRow(row: any, variation: Variation) {
    row.gene.allele = variation.allele;
    row.gene.start = variation.genomicVariationStart;
    row.gene.end = variation.genomicVariationEnd;
    row.gene.hgvsg = variation.hgvsg;
    row.gene.hgvsp = variation.hgvsp;
    row.gene.codons = variation.codons;
    row.gene.hasENSP = variation.hasENSP;
    row.gene.hasENST = variation.hasENST;
    row.protein.variant = variation.aminoAcids;
    row.protein.threeLetterCodes = variation.threeLetterCodes;
    row.protein.start = variation.proteinStart;
    row.protein.end = variation.proteinEnd;
    row.protein.canonical = variation.canonical;
  }

  private addVariationProteinDataToSearchResultsRow(row: any, protein: Protein) {
    row.protein.accession = protein.accession;
    row.protein.name = protein.name;
    row.protein.length = protein.length;
    row.protein.type = protein.type;
    row.protein.isoform = protein.isoform;
    row.protein.canonical = protein.canonical;
    row.protein.canonicalAccession = protein.canonicalAccession;
  }

  private addNovelFlagToSearchResultsTableRow(row: any, variation: Variation) {
    row.variation.novel = (!variation.hasGenomicColocatedVariant()
      && !variation.hasProteinColocatedVariant());
  }

  private addColocatedVariantsToSearchResultsRow(row: any, variation: Variation) {
    row.variation.cosmicId = variation.cosmicId;
    row.variation.dbSNIPId = variation.dbSNIPId;
    row.variation.clinVarIDs = variation.getClinVarRecords();
    row.variation.uniProtVariationId = variation.uniProtVariationId;

    row.variation.proteinColocatedVariants =
      variation.getProteinColocatedVariants();

    row.variation.genomicColocatedVariants =
      variation
        .getGenomicColocatedVariants()
        .map(cv => cv.toJSON());

    row.variation.proteinColocatedVariantsCount =
      variation.countUniqueProteinColocatedVariants();

    row.variation.diseasAssociatedProteinColocatedVariantsCount =
      variation.countDiseasAssociatedProteinColocatedVariants();
  }

  private addSignificancesToSearchResultsRow(row: any, variation: Variation) {
    const positinalSignificances: any = {
      features: variation.getPositionalSignificance().getFeatures(),
      colocatedVariants: variation.getProteinColocatedVariants(),
      variationDetails: {
        begin: variation.proteinStart,
        end: variation.proteinEnd,
        ids: {
          rsId: variation.dbSNIPId,
          dbSNIPId: variation.dbSNIPId,
          clinVarIDs: variation.getClinVarRecords(),
          uniprotVariantId: variation.uniProtVariationId,
          cosmicId: variation.cosmicId,
        }
      }
    };

    let clinicalSignificances: any = variation
      .getClinicalSignificances();

    if (clinicalSignificances) {
      clinicalSignificances = clinicalSignificances.toJSON();

      clinicalSignificances.colocatedVariants =
        variation.getProteinColocatedVariants();

      clinicalSignificances.variationDetails = {
        begin: variation.proteinStart,
        end: variation.proteinEnd,
        ids: {
          rsId: variation.dbSNIPId,
          dbSNIPId: variation.dbSNIPId,
          clinVarIDs: variation.getClinVarRecords(),
          uniprotVariantId: variation.uniProtVariationId,
          cosmicId: variation.cosmicId,
        }
      };
    }

    let genomicSignificance: any = variation
      .getGenomicSignificance();

    if (genomicSignificance) {
      genomicSignificance = genomicSignificance.toJSON();

      genomicSignificance.variationDetails = {
        begin: variation.proteinStart,
        end: variation.proteinEnd,
        ids: {
          rsId: variation.dbSNIPId,
          dbSNIPId: variation.dbSNIPId,
          clinVarIDs: variation.getClinVarRecords(),
          uniprotVariantId: variation.uniProtVariationId,
          cosmicId: variation.cosmicId,
        }
      };
    }

    row.significances['functional'] =
      (0 < positinalSignificances.features.length)
        ? positinalSignificances
        : undefined;

    const transcriptSignificances = variation
      .getTranscriptSignificance()
      .map(ts => ts.toJSON());

    row.significances['transcript'] = (0 < transcriptSignificances.length)
      ? transcriptSignificances
      : undefined;

    row.significances['clinical'] = (clinicalSignificances)
      ? clinicalSignificances
      : undefined;

    const structuralSignificances = variation
      .getStructuralSignificances();

    row.significances['structural'] = (structuralSignificances)
      ? structuralSignificances.toJSON()
      : undefined;

    row.significances['genomic'] = (genomicSignificance)
      ? genomicSignificance
      : undefined;
  }

  public generateResultTableData() {
    const output = {
      errors: this.errors,
      results: {},
    };

    Object.keys(this._inputs)
      .forEach((groupId) => {
        if (output.results[groupId] === undefined) {
          output.results[groupId] = {
            key: groupId,
            input: this._inputs[groupId].raw,
            rows: this._inputs[groupId]
              .getGenes()
              .reduce(
                (accu, gene) => {
                  gene.getProteins()
                    .forEach((protein) => {
                      const row: any = this.createEmptyResultsTableRow();

                      this.addGeneDataToSearchResultsRow(row, gene);
                      this.addProteinDataToSearchResultsRow(row, protein);

                      protein.getVariations()
                        .forEach((variation) => {
                          this.addVariationDataToSearchresultsRow(row, variation);
                          this.addVariationProteinDataToSearchResultsRow(row, protein);
                          this.addNovelFlagToSearchResultsTableRow(row, variation);
                          this.addColocatedVariantsToSearchResultsRow(row, variation);
                          this.addSignificancesToSearchResultsRow(row, variation);
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

    return output;
  }

  private createEmptyDownloadableResultsRow(groupId: string, gene: Gene, protein: Protein) {
    return {
      input: this._inputs[groupId].raw,
      most_sever_consequence: undefined,
      assembly: gene.assemblyName,
      chromosome: gene.chromosome,
      genomic_start: undefined,
      genomic_end: undefined,
      allele_string: undefined,
      variant_allele: undefined,
      gene_symbol: gene.symbol,
      gene_symbol_source: gene.symbolSource,
      hgnc_id: gene.hgncId,
      gene_id: gene.ensg,
      transcript_id: protein.enst,
      translation_id: protein.ensp,
      biotype: undefined,
      impact: undefined,
      consequence_terms: undefined,
      swissprot_accessions: (protein.swissprotAccessions || []).join(';'),
      trembl_accessions: (protein.tremblAccessions || []).join(';'),
      protein_start: undefined,
      protein_end: undefined,
      structures: undefined,
      ligands: undefined,
      structural_interaction_partners: undefined,
      amino_acid_change: undefined,
      associated_to_disease: undefined,
      disease_categories: undefined,
      polyphen_prediction: undefined,
      polyphen_score: undefined,
      mutation_taster_prediction: undefined,
      mutation_taster_score: undefined,
      lrt_prediction: undefined,
      lrt_score: undefined,
      fathmm_prediction: undefined,
      fathmm_score: undefined,
      provean_prediction: undefined,
      provean_score: undefined,
      cadd_raw: undefined,
      cadd_phred: undefined,
      sift_prediction: undefined,
      sift_score: undefined,
      mutpred_score: undefined,
      blosum62: undefined,
      appris: undefined,
      tsl: undefined,
      strand: gene.strand,
      codons: undefined,
      cdna_start: undefined,
      cdna_end: undefined,
      cds_start: undefined,
      cds_end: undefined,
      exon: undefined,
      uniparc_accessions: (protein.uniparcAccessions || []).join(';'),
      hgvs_c: undefined,
      hgvs_p: undefined,
      hgvs_g: undefined,
      disease_associations: [],
      protein_annotations: [],
      colocated_variants: [],
    };
  }

  private addTranscriptDataToDownloadableResultsRow(
    row: any,
    variation: Variation,
  ) {
    if (variation.getTranscriptSignificance().length > 0) {
      const transcriptConsequence = variation
        .getTranscriptSignificance()[0];

      if (!transcriptConsequence) {
        return;
      }

      row.most_sever_consequence = (!row.most_sever_consequence)
        ? transcriptConsequence.mostSevereConsequence : undefined;

      row.impact = (!row.impact) 
        ? Helpers.toHummanReadable(transcriptConsequence.impact) : undefined;

      if (!row.consequence_terms) {
        row.consequence_terms = transcriptConsequence
          .consequenceTerms
          .map(term => Helpers.toHummanReadable(term))
          .join('; ');
      }

      row.polyphen_prediction = (!row.polyphen_prediction)
        ? Helpers.toHummanReadable(transcriptConsequence.polyphenPrediction) : undefined;

      row.polyphen_score = (typeof row.polyphen_score !== 'number')
        ? transcriptConsequence.polyphenScore
        : undefined;

      row.mutation_taster_prediction = (!row.mutation_taster_prediction)
        ? transcriptConsequence.mutationTasterPrediction : undefined;

      row.mutation_taster_score = (!row.mutation_taster_score)
        ? transcriptConsequence.mutationTasterScore : undefined;

      row.lrt_prediction = (!row.lrt_prediction)
        ? transcriptConsequence.lrtPrediction : undefined;

      row.lrt_score = (typeof row.lrt_score !== 'number')
        ? transcriptConsequence.lrtScore
        : undefined;

      row.fathmm_prediction = (!row.fathmm_prediction)
        ? transcriptConsequence.fathmmPrediction : undefined;

      row.fathmm_score = (!row.fathmm_score)
        ? transcriptConsequence.fathmmScore : undefined;

      row.provean_prediction = (!row.provean_prediction)
        ? transcriptConsequence.proveanPrediction : undefined;

      row.provean_score = (!row.provean_score)
        ? transcriptConsequence.proveanScore : undefined;

      row.biotype = (!row.biotype)
        ? Helpers.toHummanReadable(transcriptConsequence.biotype) : undefined;

      row.cadd_phred = (typeof row.cadd_phred !== 'number')
        ? transcriptConsequence.caddPhred
        : undefined;

      row.cadd_raw = (typeof !row.cadd_raw !== 'number')
        ? transcriptConsequence.caddRaw
        : undefined;

      row.appris = (!row.appris) ? transcriptConsequence.appris : undefined;

      row.sift_prediction = (!row.sift_prediction)
        ? Helpers.toHummanReadable(transcriptConsequence.siftPrediction) : undefined;

      row.sift_score = (typeof row.sift_score !== 'number')
        ? transcriptConsequence.siftScore
        : undefined;

      row.mutpred_score = (typeof row.mutpred_score !== 'number')
        ? transcriptConsequence.mutPredScore
        : undefined;

      row.blosum62 = (typeof row.blosum62 !== 'number')
        ? transcriptConsequence.blosum62
        : undefined;

      row.tsl = (typeof row.tsl !== 'number')
        ? transcriptConsequence.tsl
        : undefined;
    }
  }

  private addPositionalDataToDownloadableResultsRow(row: any, variation: Variation) {
    variation.getPositionalSignificance()
      .getFeatures()
      .forEach((feature) => {
        let featureDetails = `type=${
          Helpers.toHummanReadable(feature.type)
        }`;
        featureDetails += `,category=${
          Helpers.toHummanReadable(feature.category)
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
  }

  private addClinicalDataToDownloadableResultsRow(row: any, variation: Variation) {
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

            if (diseaseEvidences.length) {
              diseaseDetails += `,evidences=${diseaseEvidences.join(';')}`;
            }

            row.disease_associations.push(diseaseDetails);
          });
      }
      row.disease_categories = clinicalSignificances
        .value
        .map(category => Helpers.toHummanReadable(category))
        .join(', ');
    }
  }

  private addStructuralDataToDownloadableResultsRow(
    row: any,
    variation: Variation,
    protein: Protein,
  ) {
    const structuralSignificances = variation.getStructuralSignificances();

    if (!structuralSignificances) {
      return;
    }

    row.structures = structuralSignificances.getStructures()
      .reduce((output, structure) => {
        let result = output;

        if (variation.threeLetterAminoAcidBase.toUpperCase() !== structure.position_code) {
          return output;
        }

        result += structure.best_structures
          .join(',');

        return result;
      }, '');

    row.ligands = structuralSignificances.getLigands()
      .reduce((output, ligandObject) => {
        let result = [];

        if (variation.threeLetterAminoAcidBase.toUpperCase() !== ligandObject.position_code) {
          return output;
        }

        ligandObject.ligands
          .forEach((ligand) => {
            const ligandSerilised = [
              `id:${ligand.ligand_id}`,
              `formula:${ligand.formula}`,
              `InChi:${ligand.InChi}`,
              `ligand_name:${ligand.ligand_name}`,
            ].join(',');

            result.push(ligandSerilised);
          });

          return output + result.join('|');
      }, '');

    row.structural_interaction_partners = structuralSignificances.getInteractions()
      .reduce((output, interaction) => {
        let result = output;

        if (variation.threeLetterAminoAcidBase.toUpperCase() !== interaction.position_code) {
          return output;
        }

        result += interaction.partners
          .join(',');

        return result;
      }, '');
  }

  private addVariationDataToDownloadableResultsRow(row: any, variation: Variation) {
    if (typeof row.genomic_start !== 'number' && variation.genomicVariationStart) {
      row.genomic_start = variation.genomicVariationStart;
    }

    if (typeof row.genomic_end !== 'number' && variation.genomicVariationEnd) {
      row.genomic_end = variation.genomicVariationEnd;
    }

    if (typeof row.protein_start !== 'number' && variation.proteinStart) {
      row.protein_start = variation.proteinStart;
    }

    if (typeof row.protein_end !== 'number' && variation.proteinEnd) {
      row.protein_end = variation.proteinEnd;
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

    row.colocated_variants = variation
      .getProteinColocatedVariants()
      .map((cv) => {
        return [
          `alternative_sequence:${cv.alternativeSequence}`,
          `clinical_significances:${cv.clinicalSignificances}`,
          `disease:${(cv.disease) ? 1 : 0}`,
          `large_scale_study:${cv.largeScaleStudy}`,
          `polyphen_score:${cv.polyphenScore}`,
          `sift_score:${cv.siftScore}`,
          `source_type:${cv.sourceType}`,
          `uniprot:${cv.uniprot}`,
          `wildType:${cv.wildType}`,
        ].join(',');
      }).join('|');
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
                const row = this.createEmptyDownloadableResultsRow(groupId, gene, protein);

                protein.getVariations()
                  .forEach((variation) => {
                    this.addTranscriptDataToDownloadableResultsRow(row, variation);
                    this.addPositionalDataToDownloadableResultsRow(row, variation);
                    this.addClinicalDataToDownloadableResultsRow(row, variation);
                    this.addStructuralDataToDownloadableResultsRow(row, variation, protein);
                    this.addVariationDataToDownloadableResultsRow(row, variation);
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
