
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
  readonly start: number;
  readonly end: number;

  constructor(variationNode: VariationNode, proteinNode: ProteinNode, start: number, end: number) {
    super(variationNode, proteinNode);
    this.start = start;
    this.end = end;
  }

  get variationNode() : VariationNode {
    return <VariationNode>this.source;
  }

  get proteinNode() : ProteinNode {
    return <ProteinNode>this.destination;
  }
}
