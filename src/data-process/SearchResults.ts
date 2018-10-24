
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
  InputToGeneEdge
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
        data.forEach(result => {
          // The `InputNode` will be used later to create the results table.
          let inputNode: InputNode = new InputNode(result.input);
          this.results.addNode(inputNode);

          // Looping through Transcript Consequences to collect some useful information.
          if ('undefined' !== typeof result.transcript_consequences) {
            result.transcript_consequences
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
                // Connecting this GeneNode to its respective InputNode.
                const inputToGeneEdge: InputToGeneEdge = new InputToGeneEdge(inputNode, geneNode);
                this.results.addEdge(inputToGeneEdge); 
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
