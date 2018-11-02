
import { Node } from '../index';

/**
 * To define an 'Input' node in the graph, where
 * the original user inputer -- raw variant queries,
 * are stored.
 */
export default class InputNode extends Node {
  readonly raw: string;

  constructor(input: string) {
    super(input);
    this.raw = input;
  }

  public toString() : string {
    return `${this.role}\t"${this.raw}"\r\n`;
  }
}
