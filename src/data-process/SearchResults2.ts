
import * as crypto from 'crypto';

import UniProtKB from '../data-fetch/UniProtKB';
import VEP from '../data-fetch/VEP';
import Significance from './Significance';

import {
  Node,
  // Edge,
  SearchResultsGraph,
  InputNode,
  ProteinNode
} from '../data-graph';

export default class SearchResults {






  public results: SearchResultsGraph = new SearchResultsGraph();







  public async defaultSearch(organism: string, input: string) {
    // Storage for unique key/input pairs.
    // Usage: inputs['md5-key'] = 'original user input';
    let inputs: any = {};

    // Storage for all of the protein accessions that we would need to query later on.
    // Usage: proteinAccessions['accession'] = ['md5-key', 'md5-key', 'md5-key'];
    let proteinAccessions: any = {}; 

    // Storage for all of the ENSP IDs that we 'may' need to query later on.
    // Usage: enspIDs['ENSPID'] = ['md5-key', 'md5-key', 'md5-key'];
    let enspIDs: any = {};

    // Storage for all of the ENST IDs that we 'may' need to query later on.
    // Usage: enstIDs['ENSTID'] = ['md5-key', 'md5-key', 'md5-key'];
    let enstIDs: any = {};

    // Storage for all of the ENSG IDs that we 'may' need to query later on.
    // Usage: ensgIDs['ENSGID'] = ['md5-key', 'md5-key', 'md5-key'];
    let ensgIDs: any = {};

    // Storage for all the ranges we encounter for each protein. This might be
    // useful for filtering or getting further information for each protein.
    // The 'key' in the object is the Starting position and the 'value' is the
    // Ending position.
    // Usage: proteinRanges['ACCESSION'] = { '1': 1, '127': 284, '284': 285 }
    // Note: Should the key be Accession or ENSP?
    let proteinRanges: any = {};

    // Storage for all the ranges we encounter for each gene. This might be
    // useful for filtering or getting further information for each gene.
    // The 'key' in the object is the Starting position and the 'value' is the
    // Ending position.
    // Usage: geneRanges['ENSG'] = { '1000': 1000, '54000': 54550 };
    // Note: Should the key be Gene Symbol or ENSG?
    let geneRanges: any = {};

    // Assuming the input is one of the default VEP inputs, we would
    // just pass the input to VEP end-point and consume the result.
    // Note: this has to change later as we would need to handle both
    // Genomic (VEP) and Protein (UniProt) input variants.
    await VEP.variantConsequencesAllInputs(organism, input)
      .then(({ data }) => {
// console.log("Got data here:", JSON.stringify(data));
        data.forEach(result => {






          let inputNode: InputNode = new InputNode(result.input);
console.log(`input node: ${JSON.stringify(inputNode)}`)
          // this.results.addInputNode(inputNode);
          this.results.addNode(inputNode);






          // Create a unique key from the user input.
          const key: string = crypto.createHash('md5').update(result.input).digest('hex');

          // Store the key/input pair if it hasn't been stored yet.
          if ('undefined' === typeof inputs[key]) {
            inputs[key] = result.input;
          }

          // Looping through Transcript Consequences to collect some useful information.
          if ('undefined' !== typeof result.transcript_consequences) {
            result.transcript_consequences
              .forEach(tc => {
                // NOTE: Should the protein and/or genomic location be checked
                // before collecting any data in this block?

                // Protein Accession: It seems when there is a full mapping between
                // Ensembl data and UniProt, a UniProt accession provided under the
                // name of 'swissprot'. For other entires that a full mapping is not
                // done yet, a UniProt accession is provided under the name of 'trembl'.
                //
                // If needed, list of options for the result object can be find at:
                // https://rest.ensembl.org/documentation/info/vep_region_post
                // In order to change these options, check VEP.variantConsequencesAllInputs
                //
                // If 'swissprot' accession(s) provided.
                if ('undefined' !== typeof tc.swissprot) {
                  // tc.swissprot is an array of accessions.
                  tc.swissprot
                    .forEach(accession => {





                      let proteinNode: ProteinNode = new ProteinNode(accession);
                      this.results.addNode(proteinNode);
                      // this.results.addEdge(inputNode, proteinNode);



                    

                      // First time seeing this? Create an entry first.
                      if ('undefined' === typeof proteinAccessions[accession]) {
                        proteinAccessions[accession] = [];
                      }
                      // Store current input key for this accession, if it's not already stored.
                      if (-1 === proteinAccessions[accession].indexOf(key)) {
                        proteinAccessions[accession].push(key);
                      }
                    });
                }
                // If 'trembl' accession is provided.
                if ('undefined' !== typeof tc.trembl) {
                  // First time seeing this? Create an entry first.
                  if ('undefined' === typeof proteinAccessions[tc.trembl]) {
                    proteinAccessions[tc.trembl] = [];
                  }
                  // Store current input key for this accession, if it's not already stored.
                  if (-1 === proteinAccessions[tc.trembl].indexOf(key)) {
                    proteinAccessions[tc.trembl].push(key);
                  }
                }

                // Collecting the ENSP ID, if any.
                if ('undefined' !== typeof tc.protein_id) {
                  // First time seeing this? Create an entry first.
                  if ('undefined' === typeof enspIDs[tc.protein_id]) {
                    enspIDs[tc.protein_id] = [];
                  }
                  // Store current input key for this ENSP.
                  enspIDs[tc.protein_id].push(key);
                }

                // Collecting the ENST ID, if any.
                if ('undefined' !== typeof tc.transcript_id) {
                  // First time seeing this? Create an entry first.
                  if ('undefined' === typeof enstIDs[tc.transcript_id]) {
                    enstIDs[tc.transcript_id] = [];
                  }
                  // Store current input key for this ENST.
                  enstIDs[tc.transcript_id].push(key);
                }

                // Collecting the ENSG ID, if any.
                if ('undefined' !== typeof tc.gene_id) {
                  // First time seeing this? Create an entry frist.
                  if ('undefined' === typeof ensgIDs[tc.gene_id]) {
                    ensgIDs[tc.gene_id] = [];
                  }
                  // Store current input key for this ENSG.
                  ensgIDs[tc.gene_id].push(key);
                }

                // Collecting protein start and end positions.
                //
                // If we haven't stored the 'start' for this position yet, then
                // create a new entry and store both 'start' and 'end' without
                // any extra checks.
                //
                // Or, if the 'start' position is already added, check if the 'end'
                // position is larger than the current stored value. If it is,
                // replace the current value with the new 'end' position, otherwise
                // leave untouched.
                if ('undefined' === typeof proteinRanges[tc.protein_start] ||
                  parseInt(proteinRanges[tc.protein_start]) < tc.protein_end) {
                  proteinRanges[tc.protein_start] = parseInt(tc.protein_end);
                }
              });
          }

        });



console.log("NODES:", JSON.stringify(this.results.getNodes()));

let test = Object.keys(this.results.getNodes())
  .forEach(key => {
    console.log("KEY >>>", key);
    const node = this.results.getNode(key);

    console.log("VALUE ===", JSON.stringify(node));
  })
// console.log("KEYS:", test);
  

// console.log(`\n\r\n\r>>> input keys:`, JSON.stringify(inputs));
// console.log(`\n\r\n\r>>> GRAPH:`, JSON.stringify(this.results));
// console.log(`\n\r\n\r>>> ENSPs:`, JSON.stringify(enspIDs));
// console.log(`\n\r\n\r>>> ENSTs:`, JSON.stringify(enstIDs));
// console.log(`\n\r\n\r>>> ENSGs:`, JSON.stringify(ensgIDs));
// console.log(`\n\r\n\r>>> protien range:`, JSON.stringify(proteinRanges));
// console.log(`\n\r\n\r>>> gene range:`, JSON.stringify(geneRanges));


// console.log("**** VEP DATA:", JSON.stringify(data));
      });
  }
}
