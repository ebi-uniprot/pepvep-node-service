
import { Node } from '../index';

/**
 * To define a Chromosome in the graph. The 'name' of the
 * chromosome is used as the identifier.
 */
export default class ChromosomeNode extends Node {
  readonly name: string;

  constructor(name: string) {
    super(name, 'ChromosomeNode');
    this.name = name;
  }
}
