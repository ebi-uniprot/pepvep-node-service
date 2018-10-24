
import { Node } from '../index';

export default class GeneNode extends Node {
  readonly ensg: string;

  constructor(ensg: string) {
    super(ensg, 'GeneNode');
    this.ensg = ensg;
  }
}
