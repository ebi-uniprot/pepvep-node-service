import SearchResults from '../data-structure/SearchResults';
import Input from '../data-structure/Input';
import Gene from '../data-structure/Gene';
import Protein from '../data-structure/Protein';
import Variation from '../data-structure/Variation';
import TranscriptSignificance from '../data-structure/significance/TranscriptSignificance';
import GenomicSignificance from '../data-structure/significance/GenomicSignificance';
import GenomicColocatedVariant from '../data-structure/significance/GenomicColocatedVariant';
import Helpers from '../data-fetch/Helpers';

export default abstract class VEPDataProcessor {
  public static async process(results: SearchResults, data: any) {
    data.forEach((vepOutput) => {
      // --> INPUT
      const input: Input = results.addInput(vepOutput.input);

      let gene: Gene;
      let protein: Protein;
      let variation: Variation;
      let transcriptSignificance: TranscriptSignificance;

      // Looping through Transcript Consequences to collect some useful information.
      if (vepOutput.transcript_consequences !== undefined) {
        vepOutput.transcript_consequences
          .forEach((tc) => {
            // If entry doesn't have any UniProt/Trembl accessions, ignore and quit.
            if (
              (!tc.swissprot || !tc.swissprot.length) &&
              (!tc.trembl || !tc.trembl.length)
            ) {
              return;
            }

            // --> GENE
            gene = results.addGene(vepOutput.input, tc.gene_id, vepOutput.seq_region_name);
            gene.symbol = tc.gene_symbol;
            gene.symbolSource = tc.gene_symbol_source;
            gene.assemblyName = vepOutput.assembly_name;
            gene.strand = vepOutput.strand;
            gene.hgncId = tc.hgnc_id;
            input.addGene(gene);

            // --> PROTEIN
            protein =
              results.addProtein(
                vepOutput.input,
                tc.protein_id,
                tc.transcript_id,
                tc.swissprot,
                tc.trembl,
                tc.uniparc,
              );
            gene.addProtein(protein);

            // --> VARIATION
            variation =
              results.addVariation(vepOutput.allele_string, vepOutput.input);
            VEPDataProcessor.collectVariationData(variation, gene, tc, vepOutput);

            transcriptSignificance = new TranscriptSignificance();
            VEPDataProcessor.collectTranscriptSignificancesData(transcriptSignificance, tc, vepOutput);

            variation.addTranscriptSignificance(transcriptSignificance);
            protein.addVariation(variation);

            let genomicVariantIDs = {};

            const genomicSignificance: GenomicSignificance =
              new GenomicSignificance();

            VEPDataProcessor.collectConsequencePredictionData(
              genomicSignificance,
              tc,
            );

            // ClinVar
            if (tc.phenotypes) {
              tc.phenotypes
                .forEach(ph => {
                  if (ph.source === 'ClinVar') {
                    variation.addClinVarRecord(ph);
                  }
                })
            }

            /* Looping through genomic colocated variants to either define a novel variant or
              collect useful information */
            VEPDataProcessor.collectColocatedVariants(
              vepOutput.colocated_variants,
              variation,
              genomicSignificance,
              transcriptSignificance,
              genomicVariantIDs,
            );

            variation.addGenomicSignificance(genomicSignificance);
            variation.addGenomicColocatedVariantIDs(genomicVariantIDs);
          });
      }
    });
  }

  private static collectColocatedVariants(
    collocatedVariants: any[],
    variation: Variation,
    genomicSignificance: GenomicSignificance,
    transcriptSignificance: TranscriptSignificance,
    genomicVariantIDs,
  ) {
    collocatedVariants && collocatedVariants
      .forEach((cv) => {
        const genomicColocatedVariant : GenomicColocatedVariant =
          new GenomicColocatedVariant(cv.id);

        if (cv.pubmed) {
          cv.pubmed
            .forEach(pm => genomicColocatedVariant.addPubMedID(pm));
        }

        variation.addGenomicColocatedVariant(genomicColocatedVariant);

        const variantIDs = VEPDataProcessor
          .extractGenomicVariantIDs(genomicColocatedVariant);

        Object.keys(variantIDs)
          .forEach((id) => {
            if (!genomicVariantIDs[id] && variantIDs[id]) {
              genomicVariantIDs[id] = variantIDs[id];
            }
          });

        if (cv.allele_string === 'COSMIC_MUTATION') {
          genomicVariantIDs['cosmicId'] = cv.id;
        }

        if (cv.clin_sig) {
          transcriptSignificance.pathogenicity = cv
            .clin_sig
            .map(cs => Helpers.toHummanReadable(cs));
        }

        if (cv.frequencies && cv.frequencies[variation.variantAllele]) {
          const frequencies = VEPDataProcessor
            .generatePopulationFrequencies(cv.frequencies, variation.variantAllele);

          genomicColocatedVariant.populationFrequencies = frequencies;
          genomicSignificance.populationFrequencies = frequencies;
        }
      });
  }

  private static generatePopulationFrequencies(frequencies: any, allele: string) : any {
    const rawFrequencies = frequencies[allele];

    const { gnomAD, oneK } = VEPDataProcessor
      .generateDefaultPopulationFrequencyValues();

    const result = {
      gnomAD,
      '1kg': oneK,
    };

    if (rawFrequencies.gnomad > 0) {
      gnomAD.all.value = rawFrequencies.gnomad;
    }

    Object.keys(gnomAD)
      .forEach((key) => {
        if (rawFrequencies[`gnomad_${key}`] > 0) {
          gnomAD[key].value = rawFrequencies[`gnomad_${key}`];
        }
      });

    Object.keys(oneK)
      .forEach((key) => {
        if (rawFrequencies[key] > 0) {
          oneK[key].value = rawFrequencies[key];
        }
      });

    return result;
  }

  private static generateDefaultPopulationFrequencyValues() : any {
    const gnomAD = {
      all: {
        label: 'All',
        value: undefined,
      },
      afr: {
        label: 'African',
        value: undefined,
      },
      amr: {
        label: 'Latino',
        value: undefined,
      },
      asj: {
        label: 'Ashkenazi Jewish',
        value: undefined,
      },
      eas: {
        label: 'East Asian',
        value: undefined,
      },
      fin: {
        label: 'Finnish',
        value: undefined,
      },
      nfe: {
        label: 'non-Finish European',
        value: undefined,
      },
      oth: {
        label: 'Other',
        value: undefined,
      },
      sas: {
        label: 'South Asian',
        value: undefined
      },
    };

    const oneK = {
      afr: {
        label: 'African',
        value: undefined,
      },
      amr: {
        label: 'American',
        value: undefined,
      },
      eas: {
        label: 'East Asian',
        value: undefined,
      },
      eur: {
        label: 'European',
        value: undefined,
      },
      sas: {
        label: 'South Asian',
        value: undefined
      },
    };

    return {
      gnomAD,
      oneK,
    };
  }

  private static extractGenomicVariantIDs(colocatedVariant: GenomicColocatedVariant) {
    const cosmicPattern: RegExp = /^COSM.*/ig;
    const dbSNIPPattern: RegExp = /^rs.*/ig;
    const uniprotVariantId: RegExp = /^VAR_.*/ig;

    let cosmicId;
    let dbSNIPId;
    let uniProtVariationId;

    if (cosmicPattern.test(colocatedVariant.id)) {
      cosmicId = colocatedVariant.id;
    }

    if (dbSNIPPattern.test(colocatedVariant.id)) {
      dbSNIPId = colocatedVariant.id;
    }

    if (uniprotVariantId.test(colocatedVariant.id)) {
      uniProtVariationId = colocatedVariant.id;
    }

    return {
      cosmicId,
      dbSNIPId,
      uniProtVariationId,
    };
  }

  private static collectVariationData(
    variation: Variation,
    gene: Gene,
    transcriptData: any,
    other: any
  ) {
    variation.proteinStart = (transcriptData.protein_start)
      ? parseInt(transcriptData.protein_start, 10)
      : undefined;
    variation.proteinEnd = (transcriptData.protein_end)
      ? parseInt(transcriptData.protein_end, 10)
      : undefined;
    variation.genomicVariationStart = parseInt(other.start, 10);
    variation.genomicVariationEnd = parseInt(other.end, 10);
    variation.aminoAcids = transcriptData.amino_acids;
    variation.codons = transcriptData.codons;
    variation.baseAndAllele = other.allele_string;
    variation.variantAllele = transcriptData.variant_allele;
    variation.buildHGVSg(gene.ensg);
    variation.canonical = (transcriptData.canonical === 1) ? true : false;
    variation.hgvsp = transcriptData.hgvsp;
    variation.hgvsc = transcriptData.hgvsc;
    variation.cdnaStart = transcriptData.cdna_start;
    variation.cdnaEnd = transcriptData.cdna_end;
    variation.cdsStart = transcriptData.cds_start;
    variation.cdsEnd = transcriptData.cds_end;
    variation.exon = transcriptData.exon;
    variation.hasENSP = (transcriptData.protein_id !== undefined);
    variation.hasENST = (transcriptData.transcript_id !== undefined);
  }

  private static collectTranscriptSignificancesData(
    transcriptSignificance: TranscriptSignificance,
    transcriptData: any,
    other: any
  ) {
    transcriptSignificance.biotype = Helpers.toHummanReadable(transcriptData.biotype);
    transcriptSignificance.impact = transcriptData.impact;
    transcriptSignificance.polyphenPrediction = transcriptData.polyphen_prediction;
    transcriptSignificance.polyphenScore = transcriptData.polyphen_score;
    transcriptSignificance.siftPrediction = transcriptData.sift_prediction;
    transcriptSignificance.siftScore = transcriptData.sift_score;
    transcriptSignificance.mostSevereConsequence = other.most_severe_consequence;
    transcriptSignificance.mutationTasterPrediction = transcriptData.mutationtaster_pred;
    transcriptSignificance.mutationTasterScore = transcriptData.mutationtaster_score;
    transcriptSignificance.lrtPrediction = transcriptData.lrt_pred;
    transcriptSignificance.lrtScore = transcriptData.lrt_score;
    transcriptSignificance.fathmmPrediction = transcriptData.fathmm_pred;
    transcriptSignificance.fathmmScore = transcriptData.fathmm_score;
    transcriptSignificance.proveanPrediction = transcriptData.provean_pred;
    transcriptSignificance.proveanScore = transcriptData.provean_score;
    transcriptSignificance.caddPhred = transcriptData.cadd_phred;
    transcriptSignificance.caddRaw = transcriptData.cadd_raw;
    transcriptSignificance.appris = transcriptData.appris;
    transcriptSignificance.mutPredScore = transcriptData.mutpred_score;
    transcriptSignificance.blosum62 = transcriptData.blosum62;
    transcriptSignificance.tsl = transcriptData.tsl;

    if (transcriptData.consequence_terms) {
      transcriptData.consequence_terms
        .forEach(term => transcriptSignificance.addConsequenceTerm(term));
    }
  }

  private static collectConsequencePredictionData(
    genomicSignificance: GenomicSignificance,
    transcriptData: any,
  ) {
    genomicSignificance.polyphenPrediction = transcriptData.polyphen_prediction;
    genomicSignificance.polyphenScore = transcriptData.polyphen_score;
    genomicSignificance.siftPrediction = transcriptData.sift_prediction;
    genomicSignificance.siftScore = transcriptData.sift_score;
    genomicSignificance.caddPhred = transcriptData.cadd_phred;
    genomicSignificance.caddRaw = transcriptData.cadd_raw;
  }
}
