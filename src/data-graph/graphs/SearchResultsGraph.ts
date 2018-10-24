
import {
  Graph,
  InputNode,
  ProteinNode,
  GeneNode,
  InputToProteinEdge
} from '../index';

/**
 * To provide methods specifically used in 'Search Results' table.
 *
 * Please note if you are going to write a method that queries the
 * data stored in the graph, always start by getting your `InputNode`s
 * first and then travers through their edges to achieve the desirable
 * output.
 *
 * This is to avoid extracting data from unreachable/oraphan nodes
 * and/or edges. Even though there should be safety checks before
 * each node/edge is created, there are still chances that some nodes
 * and/or edges being created which are not of interest from the
 * original user input point-of-view. 
 */
export default class SearchResultsGraph extends Graph {
  /**
   * This should return all of the 'accessions' collected for all of
   * input values. This may include accessions that are different in
   * different databases -- e.g. SwissProt vs. Trembl, but in fact
   * they do point out to the same entry.
   *
   * If you would like to exclude these types of accessions, use the
   * `getPreferredProteinAccessions` method instead.
   *
   * Unless for debugging purposes, it's unlikely that you need to
   * use this method for any business logic or integeration purposes.
   */
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

  /**
   * This should return all the 'accessions' available in the graph
   * that are pointing to a unique protein entry. For example if 
   * two accessions are stored for a single `ProteinNode`, one from
   * SwissProt and another one from Trembl, which both effectly point
   * to a single protein entry -- while being two completely different
   * accessions, this method will only return one of them.
   *
   * The logic behind defining and choosing these so called 'prefered'
   * accessions is in the `preferredAccession` property (getter method)
   * of the `InputNode` class.
   */
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

  /**
   * This will extract all of the ENSG IDs related to our original
   * input variants.
   */
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
