
import * as crypto from 'crypto';

import UniProtKB from '../data-fetch/UniProtKB';
import VEP from '../data-fetch/VEP';
import Significance from './Significance';

import {
  Node,
  Edge,
  SearchResultsGraph,
  InputNode,
  ProteinNode,
  InputToProteinEdge,
  GeneNode,
  GeneToProteinEdge,
  VariationNode,
  InputToVariationEdge,
  VariationToProteinEdge,
  ChromosomeNode,
  GeneToChromosomeEdge,
  TranscriptConsequence,
  ColocatedVariant,
  ClinicalSignificance
} from '../data-graph';

export default class SearchResults {
  // All data from API calls will be added to this graph and later
  // can be quired.
  public results: SearchResultsGraph = new SearchResultsGraph();

  public async defaultSearch(organism: string, input: string) {
    
    // Assuming the input is one of the default VEP inputs, we would
    // just pass the input to VEP end-point and consume the result.
    // Note: this has to change later as we would need to handle both
    // Genomic (VEP) and Protein (UniProt) input variants.
    await VEP.variantConsequencesAllInputs(organism, input)
      .then(({ data }) => {
// console.log("Got data here:", JSON.stringify(data));
        data.forEach(VEPOutput => {
          // The `InputNode` will be used later to create the results table.
          let inputNode: InputNode = new InputNode(VEPOutput.input);
          this.results.addNode(inputNode);

          // The variation details is constant for all of the results set
          // we receive per input line, however, the details are only returned
          // within the `transcript_consequences` object and repeated for
          // each and every one of them. Therefore, we would need to define the
          // placeholder variable for the variation node before looping though
          // the `transcript_consequences` and set the data once in its first
          // occurance.
          let variationNode: VariationNode = null;
          let inputToVariationEdge: InputToVariationEdge = null;

          // CHROMOSOME NODE: We will use the Chromosome name (seq_region_name field) to create and identify
          // our chromosome node.
          const chromosomeNode: ChromosomeNode = new ChromosomeNode(VEPOutput.seq_region_name);
          this.results.addNode(chromosomeNode);

          // Our genomic position
          const genomicPosition = {
            start: VEPOutput.start,
            end: VEPOutput.end
          };

          // Looping through Transcript Consequences to collect some useful information.
          if ('undefined' !== typeof VEPOutput.transcript_consequences) {
            VEPOutput.transcript_consequences
              .forEach(tc => {
                // PROTEIN NODE: We will use the ENSP ID (protein_id field) to create and identify 
                // our protein nodes, however, we will store the ENST ID as well (transcript_id field)
                // which can be used as an identifier too -- if needed.
                // Both `swissprot` and `trembl` fields are a type of array and may or may not contain
                // any protein accessions. This is handle inside `ProteinNode` class.
                const proteinNode: ProteinNode = new ProteinNode(tc.protein_id, tc.transcript_id, tc.swissprot, tc.trembl);
                this.results.addNode(proteinNode);

                // Connecting this ProteinNode to its respective InputNode.
                const inputToProteinEdge: InputToProteinEdge = new InputToProteinEdge(inputNode, proteinNode);
                this.results.addEdge(inputToProteinEdge);

                // GENE NODE: We will use ENSG ID (gene_id field) to create and identify our gene nodes.
                const geneNode: GeneNode = new GeneNode(tc.gene_id);
                this.results.addNode(geneNode);

                // Conneting this GeneNode to its respective ProteinNode.
                const geneToProteinEdge: GeneToProteinEdge = new GeneToProteinEdge(geneNode, proteinNode);
                this.results.addEdge(geneToProteinEdge);

                // Connecting this GeneNode to it the ChromosomeNode, while storing its genomic position.
                const geneToChromosomeEdge: GeneToChromosomeEdge =
                  new GeneToChromosomeEdge(geneNode, chromosomeNode, genomicPosition.start, genomicPosition.end);
                this.results.addEdge(geneToChromosomeEdge);

                // Check if the VariationNode/InputToVariationEdge is already created. If not,
                // create one here.
                if (null === variationNode && null === inputToVariationEdge) {
                  // VARIATION NODE: We will use Allele (allele_string field) to create and identify our
                  // variation node. Later we will add the Amino Acids value (amino_acids field) to the
                  // object, whenever it is availble.
                  variationNode = new VariationNode(tc.allele_string);
                  this.results.addNode(variationNode);

                  // Connectig this VariationNode to its respective InputNode.
                  inputToVariationEdge = new InputToVariationEdge(inputNode, variationNode);
                  this.results.addEdge(inputToVariationEdge);
                }

                // Add Amino Acids to the `VariationNode`, once and only when it's available.
                if (null === variationNode.aminoAcids && 'undefined' !== typeof tc.amino_acids) {
                  variationNode.aminoAcids = tc.amino_acids;
                }

                // TODO: Don't add duplicated edges, if the same start and end positions is already added.
                // TODO: See if 'addEdge' method can take care of NOT adding duplicated edges, same as 'addNode'.
                // If protein start and end positions are available (protein_start and protein_end fields),
                // then create a `VariationToProtienEdge`.
                if ('undefined' !== typeof tc.protein_start && 'undefined' !== typeof tc.protein_end) {
                  const variationToProteinEdge: VariationToProteinEdge =
                    new VariationToProteinEdge(variationNode, proteinNode, tc.protein_start, tc.protein_end);
                  this.results.addEdge(variationToProteinEdge);
                }

                // TRANSCRIPT CONSEQUENCE: Since the transcript consequence can have a
                // variaty of optional details, we won't be inforcing any in the constructor,
                // but add them later one-by-one, whenever they are avialable.
                const transcriptConsequence: TranscriptConsequence = new TranscriptConsequence();

                // We don't need to check for data availability here. It should be taken care of
                // inside the `setter` method itself.
                transcriptConsequence.biotype = tc.biotype;
                transcriptConsequence.impact = tc.impact;
                transcriptConsequence.codons = tc.codons;
                transcriptConsequence.polyphenPrediction = tc.polyphen_prediction;
                transcriptConsequence.polyphenScore = tc.polyphen_score;
                transcriptConsequence.siftPrediction = tc.sift_prediction;
                transcriptConsequence.siftScore = tc.sift_score;

                if (Array.isArray(tc.consequence_terms)) {
                  tc.consequence_terms
                    .forEach(term => transcriptConsequence.addConsequenceTerm(term));
                }

                // Adding this 'Transcript Consequence' to the `VariationNode`.
                variationNode.addTranscriptConsequence(transcriptConsequence);
              });
          }

          // Looping through Colocated Variants and collecting relevant details.
          if ('undefined' !== typeof VEPOutput.colocated_variants) {
            VEPOutput.colocated_variants
              .forEach(cv => {
                // COLOCATED VARIANT: We'll use the ID of the colocated variant
                // in order to create an instance, then, if any PubMed data was
                // available too, we'll add them too.
                const colocatedVariant: ColocatedVariant = new ColocatedVariant(cv.id);

                if (Array.isArray(cv.pubmed)) {
                  cv.pubmed.forEach(id => colocatedVariant.addPubMedID(id));
                }

                // Adding this 'Colocated Variant' to the `VariationNode`.
                variationNode.addColocatedVariant(colocatedVariant);

                // Here we can look to see if there are any clinical significance details
                // are available too.
                if (Array.isArray(cv.clin_sig)) {
                  cv.clin_sig.forEach(cs => {
                    // CLINICAL SIGNIFICANCE
                    const clinicalSignificance: ClinicalSignificance = new ClinicalSignificance(cs);

                    // Adding this 'Clinical Significance' to the `VariationNode`.
                    variationNode.addClinicalSignificance(clinicalSignificance);
                  });
                }
              });
          }

        });

        // console.log(this.results.toString());
        // console.log(this.results.toJSON());

        console.log(`All Accessions:\n`, this.results.getAllProteinAccessions());
        console.log(`Preferred Accessions:\n`, this.results.getPreferredProteinAccessions());
        console.log(`All Gene IDs:\n`, this.results.getAllGeneIDs());

      });
  }
}
