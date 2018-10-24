
import { Node } from '../index';

export default class VariationNode extends Node {
  readonly aminoAcids: string;
  readonly allele: string;

  constructor(aminoAcids: string, allele: string) {
    super(`${aminoAcids}-${allele}-${Math.random()}`, 'VariationNode');
    this.aminoAcids = aminoAcids;
    this.allele = allele;
  }
}
