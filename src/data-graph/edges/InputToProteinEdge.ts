
import {
  InputNode,
  ProteinNode,
  Edge
} from '../index';

/**
 * To express the relationship between an `InputNode`
 * and a `ProteinNode`.
 */
export default class InputToProteinEdge extends Edge {

  constructor(inputNode: InputNode, proteinNode: ProteinNode) {
    super('InputToProteinEdge', inputNode, proteinNode);
  }

  get inputNode() : InputNode {
    return <InputNode>this.source;
  }

  get proteinNode() : ProteinNode {
    return <ProteinNode>this.destination;
  }
}
