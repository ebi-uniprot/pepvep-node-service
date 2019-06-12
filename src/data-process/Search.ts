import * as crypto from 'crypto';

import UniProtKB from '../data-fetch/UniProtKB';
import VEP from '../data-fetch/VEP';
import PDBe from '../data-fetch/PDBe';
import SignificancesHelper from './SignificancesHelper';
import SearchResults from '../data-structure/SearchResults';
import Input from '../data-structure/Input';
import Gene from '../data-structure/Gene';
import Protein from '../data-structure/Protein';
import Variation from '../data-structure/Variation';
import TranscriptSignificance from '../data-structure/significance/TranscriptSignificance';
import ClinicalSignificance from '../data-structure/significance/ClinicalSignificance';
import StructuralSignificance from '../data-structure/significance/StructuralSignificance';
import PositionalSignificance from '../data-structure/significance/PositionalSignificance';
import GenomicColocatedVariant from '../data-structure/significance/GenomicColocatedVariant';
import ProteinColocatedVariant from '../data-structure/significance/ProteinColocatedVariant';

export default class Search {
  private results: SearchResults = new SearchResults();

  public async vepInputSearch(organism: string, input: string, download: boolean = false) {

    const vepOutput = await VEP
      .variantConsequencesAllInputs(organism, input);
    await this.processVEPOutput(vepOutput.data);

    const proteinDetailsData = await UniProtKB
      .getProteinDetailByAccession(this.results.getAccessionsAsArray(false));
    await this.processProteinDetails(proteinDetailsData);

    const protainVariantsData = await UniProtKB
      .getProteinVariants(this.results.getAccessionsAsArray());
    await this.processProteinVariantData(protainVariantsData.data);

    const structuralQueryInput = this.results.getProteinAcccessionsAndPositionHits();
    const proteinStructuralData = await PDBe
      .getProteinStructureSummary(structuralQueryInput);
    await this.processPDBeOutput(proteinStructuralData);

    if (download) {
      return this.results.generateDownloadableData();
    }

    return this.results.generateResultTableData();
  }

  private async processVEPOutput(data: any) {
    data.forEach((vepOutput) => {
      // --> INPUT
      const input: Input = this.results.addInput(vepOutput.input);

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
              (tc.swissprot === undefined || 0 >= tc.swissprot.length) &&
              (tc.trembl === undefined || 0 >= tc.trembl.length)
            ) {
              return;
            }

            // --> GENE
            gene = this.results.addGene(vepOutput.input, tc.gene_id, vepOutput.seq_region_name);
            gene.symbol = tc.gene_symbol;
            gene.symbolSource = tc.gene_symbol_source;
            gene.assemblyName = vepOutput.assembly_name;
            gene.strand = vepOutput.strand;
            gene.hgncId = tc.hgnc_id;
            input.addGene(gene);

            // --> PROTEIN
            protein =
              this.results.addProtein(
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
              this.results.addVariation(vepOutput.allele_string, vepOutput.input);
            this.collectVariationData(variation, gene, tc, vepOutput);

            transcriptSignificance = new TranscriptSignificance();
            this.collectTranscriptSignificancesData(transcriptSignificance, tc, vepOutput);

            variation.addTranscriptSignificance(transcriptSignificance);
            protein.addVariation(variation);
          });

        /* Looping through genomic colocated variants to either define a novel variant or
          collect useful information */
        vepOutput.colocated_variants
          .forEach((cv) => {
            const genomicColocatedVariant : GenomicColocatedVariant =
              new GenomicColocatedVariant(cv.id);

            if (cv.pubmed !== undefined) {
              cv.pubmed
                .forEach(pm => genomicColocatedVariant.addPubMedID(pm));
            }

            variation.addGenomicColocatedVariant(genomicColocatedVariant);
          });
      }
    });
  }

  private async processProteinDetails(data: any) {
    data.data.forEach((proteinFeaturesResult) => {
      this.results
        .getProteinsByAccession(proteinFeaturesResult.accession)
        .map((p) => {
          this.collectProteinMetaData(p, proteinFeaturesResult);

          // Picking up the canonical isoform(s) per each protein
          return this.collectIsoformData(
            p,
            proteinFeaturesResult.comments,
            proteinFeaturesResult.dbReferences,
          );
        })
        .forEach((p) => {
          if (!p.hasVariationWithProteinPosition()) {
            p.length = null;
          }
        });

      const proteins: Protein[] =
        this.results.getProteinsByAccession(proteinFeaturesResult.accession)
          .filter(p => p.canonical);

      if (proteinFeaturesResult.features === undefined) {
        proteinFeaturesResult.features = [];
      }

      SignificancesHelper.addPositionalSignificance(proteins, proteinFeaturesResult);
    });
  }

  private async processProteinVariantData(data: any) {
    data.forEach((proteinVariationResult) => {
      proteinVariationResult.features.forEach((feature) => {
        const { accession } = proteinVariationResult;

        const {
          ftId,
          type,
          begin,
          end,
          wildType,
          alternativeSequence,
          genomicLocation,
          association,
          clinicalSignificances,
          sourceType,
          xrefs,
          polyphenScore,
          siftScore,
        } = feature;

        if ('VARIANT' !== type) {
          return;
        }

        const variationsInRange : Variation[] = this.results
          .getProteinVariationsInRange(accession, begin, end);

        const proteinColocatedVariant : ProteinColocatedVariant =
          new ProteinColocatedVariant(
            ftId,
            wildType,
            alternativeSequence,
            clinicalSignificances,
            sourceType,
            association,
            xrefs,
            polyphenScore,
            siftScore,
          );

        variationsInRange
          .forEach(v => v.addProteinColocatedVariant(proteinColocatedVariant));
      });

      // Clinical Significances
      const { accession, features } = proteinVariationResult;
      this.collectClinicalSignificancesData(accession, features);
    });
  }

  // private async processPDBeOutput(data: any, downloadResults: boolean) {
  private async processPDBeOutput(data: any) {
    data.reduce((all, current) => {
      current.data
        .forEach((i) => {
          const accession = Object.keys(i)[0];
          const item = i[accession];

          if (Object.keys(item.all_structures).length > 0) {

            const x = {};
            x[accession] = item;
            all.push(x);
          }
        });

      return all;
    }, [])
    .forEach((pdbeResult) => {
      const accession = Object.keys(pdbeResult)[0];
      const pdbeDetails = pdbeResult[accession];

      this.results.getProteinsByAccession(accession)
        .forEach((protein) => {
          protein.getVariations()
            .forEach((variation) => {
              const structrualSignificance : StructuralSignificance
                = new StructuralSignificance();

              this.collectStructuralSignificancesData(
                structrualSignificance,
                variation,
                pdbeDetails,
              );
            });
        });
    });
  }

  private collectClinicalSignificancesData(accession: string, features: any[]) {
    features.forEach((feature) => {
      const {
        type,
        begin,
        end,
        wildType,
        alternativeSequence,
        genomicLocation,
        association,
        clinicalSignificances,
      } = feature;

      if (type !== 'VARIANT') {
        return;
      }

      if (genomicLocation === undefined) {
        return;
      }

      if (association === undefined) {
        return;
      }

      if (clinicalSignificances === undefined) {
        return;
      }

      this.results.getProteinsByAccession(accession)
        .filter(p => p.canonical)
        .forEach((protein) => {
          protein
            .getVariations()
            .map(v => (v.isInRange(begin, end)) ? v : null)
            .filter(v => v !== null)
            .filter(v => v.wildType === wildType && v.alternativeSequence === alternativeSequence)
            .forEach((variation) => {
              const diseaseAssociation: any[] = association
                .filter(a => a.disease);

              if (0 >= diseaseAssociation.length) {
                return;
              }

              const cs: ClinicalSignificance =
                new ClinicalSignificance(clinicalSignificances, diseaseAssociation);

              variation.addClinicalSignificance(cs);
            });
        });
    });
  }

  private collectVariationData(
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

  private collectTranscriptSignificancesData(
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

  private collectIsoformData(
    protein: Protein,
    comments: any[],
    dbReferences: any[],
  ) : Protein {
    let canonicalIsoforms : string[] = [];
    let canonicalAccession: string;

    if (comments) {
      const altProducts = comments
        .find(c => c.type === 'ALTERNATIVE_PRODUCTS');

      if (altProducts && altProducts.isoforms) {
        canonicalIsoforms = altProducts.isoforms
          .find(i => i.sequenceStatus === 'displayed')
          .ids;
      }
    }

    if (canonicalIsoforms.length > 0) {
      canonicalAccession = canonicalIsoforms[0]
        .split('-')[0];
    }

    // Adding 'isoform' value
    dbReferences
      .forEach((ref) => {
        if (ref.type !== 'Ensembl') {
          return;
        }

        if (ref.id !== protein.enst) {
          return;
        }

        if (ref.isoform === undefined) {
          return;
        }

        protein.isoform = ref.isoform;

        if (canonicalIsoforms.length > 0 && protein.isoform === canonicalIsoforms[0]) {
          protein.canonical = true;
          protein.canonicalAccession = canonicalAccession;
        }
      });

    return protein;
  }

  private collectProteinMetaData(protein: Protein, data: any) {
    if (protein !== undefined) {
      protein.name = {
        full: data.protein &&
          data.protein.recommendedName &&
          data.protein.recommendedName.fullName &&
          data.protein.recommendedName.fullName.value || 'NA',
        short: data.protein &&
          data.protein.recommendedName &&
          data.protein.recommendedName.shortName &&
          data.protein.recommendedName.shortName.value || 'NA',
      };

      protein.taxonomy = data.organism.taxonomy;
      protein.length = data.sequence.length;
      protein.setType(data.info.type);
    }
  }

  private collectStructuralSignificancesData(
    structuralSignificance: StructuralSignificance,
    variation: Variation,
    pdbeDetails: any,
  ) {
    structuralSignificance.proteinLength = parseInt(pdbeDetails.length, 10);

    structuralSignificance.addAllStructures(pdbeDetails.all_structures);

    pdbeDetails.annotations.positions
      .forEach((annotation) => {
        if (variation.isInRange(annotation.position, annotation.position)) {
          structuralSignificance.addAnnotation(annotation);
        }
      });

    pdbeDetails.ligands.positions
      .forEach((ligand) => {
        if (variation.isInRange(ligand.position, ligand.position)) {
          structuralSignificance.addLigand(ligand);
        }
      });

    pdbeDetails.interactions.positions
      .forEach((interaction) => {
        if (variation.isInRange(interaction.position, interaction.position)) {
          structuralSignificance.addInteraction(interaction);
        }
      });

    pdbeDetails.structures.positions
      .forEach((structure) => {
        if (variation.isInRange(structure.position, structure.position)) {
          structuralSignificance.addStructure(structure);
        }
      });

    variation.addStructuralSignificance(structuralSignificance);
  }
}
