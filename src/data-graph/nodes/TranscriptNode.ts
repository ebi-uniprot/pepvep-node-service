
import { Node } from '../index';

export default class TranscriptNode extends Node {
  readonly enst: string;

  constructor(enst: string) {
    super(enst, 'TranscriptNode');
    this.enst = enst;
  }
}
