
import { Node } from '../index';

export default class InputNode extends Node {
  readonly raw: string;

  constructor(input: string) {
    super(input, 'InputNode');
    this.raw = input;
  }

  public toString() : string {
    return `${this.role}\t"${this.raw}"\r\n`;
  }
}
