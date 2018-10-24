
import {
  ProteinNode,
  GeneNode,
  Edge
} from '../index';

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
