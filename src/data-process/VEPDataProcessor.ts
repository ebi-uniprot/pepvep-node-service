import SearchResults from '../data-structure/SearchResults';
import Input from '../data-structure/Input';
import Gene from '../data-structure/Gene';
import Protein from '../data-structure/Protein';
import Variation from '../data-structure/Variation';
import TranscriptSignificance from '../data-structure/significance/TranscriptSignificance';
import GenomicColocatedVariant from '../data-structure/significance/GenomicColocatedVariant';

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
          });

        /* Looping through genomic colocated variants to either define a novel variant or
          collect useful information */
        vepOutput.colocated_variants
          .forEach((cv) => {
            const genomicColocatedVariant : GenomicColocatedVariant =
              new GenomicColocatedVariant(cv.id);

            if (cv.pubmed) {
              cv.pubmed
                .forEach(pm => genomicColocatedVariant.addPubMedID(pm));
            }

            variation.addGenomicColocatedVariant(genomicColocatedVariant);
          });
      }
    });
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
  }

  private static collectTranscriptSignificancesData(
    transcriptSignificance: TranscriptSignificance,
    transcriptData: any,
    other: any
  ) {
    transcriptSignificance.biotype = transcriptData.biotype;
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

    if (transcriptData.consequence_terms !== undefined) {
      transcriptData.consequence_terms
        .forEach(term => transcriptSignificance.addConsequenceTerm(term));
    }
  }
}
