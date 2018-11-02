
import { Node } from '../index';

/**
 * To define a 'Gene' node in the graph. The ENSG ID
 * is used as the identifier for the instances of this
 * node.
 */
export default class GeneNode extends Node {
  readonly ensg: string;

  constructor(ensg: string) {
    super(ensg);
    this.ensg = ensg;
  }
}
