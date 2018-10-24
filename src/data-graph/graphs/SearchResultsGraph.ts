
import {
  Graph,
  InputNode,
  ProteinNode,
  GeneNode,
  InputToProteinEdge
} from '../index';

export default class SearchResultsGraph extends Graph {

  public getAllProteinAccessions() : string[] {
    return Object.values(this.getNodes('InputNode'))
      .reduce((accessions, inputNode) => {
        Object.values((<InputNode>inputNode).getEdges('ProteinNode'))
          .forEach(edge => {
            accessions = [...(<InputToProteinEdge>edge).proteinNode.accessions, ...accessions];
          });
          return accessions;
      }, []);
  }

  public getPreferredProteinAccessions() : string[] {
    return Object.values(this.getNodes('InputNode'))
      .reduce((accessions, inputNode) => {
        Object.values((<InputNode>inputNode).getEdges('ProteinNode'))
          .forEach(edge => {
            const accession: string = (<InputToProteinEdge>edge).proteinNode.preferredAccession;
            if ('undefined' !== typeof accession && null !== accession) {
              accessions.push(accession);
            }
          });
          return accessions;
      }, []);
  }

  public getAllGeneIDs() : string[] {
    const nodes = this.getNodes('InputNode');
    return Object.keys(nodes)
      .reduce((geneIDs, nodeID) => {
        Object.keys(nodes[nodeID].getEdges('GeneNode'))
          .map(id => {
            const edge = <GeneNode>this.getNode('GeneNode', id);
            geneIDs.push(edge.ensg);
          })
        return geneIDs;
      }, []);
  }
}
