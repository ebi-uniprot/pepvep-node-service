
import {
  VariationNode,
  ProteinNode,
  Edge
} from '../index';

/**
 * To express the relationship between a `VariationNode`
 * and a `ProteinNode`.
 */
export default class VariationToProteinEdge extends Edge {

  constructor(variationNode: VariationNode, proteinNode: ProteinNode) {
    super(variationNode, proteinNode);
  }

  get variationNode() : VariationNode {
    return <VariationNode>this.source;
  }

  get proteinNode() : ProteinNode {
    return <ProteinNode>this.destination;
  }
}
