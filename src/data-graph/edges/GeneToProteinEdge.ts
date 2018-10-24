
import {
  ProteinNode,
  GeneNode,
  Edge
} from '../index';

/**
 * To express the relationship between a `GeneNode` and
 * a `ProteinNode`.
 */
export default class GeneToProteinEdge extends Edge {

  constructor(geneNode: GeneNode, proteinNode: ProteinNode) {
    super('GeneToProteinEdge', geneNode, proteinNode);
  }

  get geneNode() : GeneNode {
    return <GeneNode>this.source;
  }

  get proteinNode() : ProteinNode {
    return <ProteinNode>this.destination;
  }
}
