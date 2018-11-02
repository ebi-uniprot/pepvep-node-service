
import {
  InputNode,
  VariationNode,
  Edge
} from '../index';

/**
 * To express a relationship beetwen an `InputNode` and
 * a `VariationNode`.
 */
export default class InputToVariationEdge extends Edge {
  constructor(inputNode: InputNode, variationNode: VariationNode) {
    super(inputNode, variationNode);
  }

  get inputNode() : InputNode {
    return <InputNode>this.source;
  }

  get variationNode() : VariationNode {
    return <VariationNode>this.destination;
  }
}
