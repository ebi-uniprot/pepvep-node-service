
import {
  InputNode,
  GeneNode,
  Edge
} from '../index';

export default class InputToGeneEdge extends Edge {

  constructor(inputNode: InputNode, geneNode: GeneNode) {
    super('InputToGeneEdge', inputNode, geneNode);
  }

  get inputNode() : InputNode {
    return <InputNode>this.source;
  }

  get geneNode() : GeneNode {
    return <GeneNode>this.destination;
  }
}
