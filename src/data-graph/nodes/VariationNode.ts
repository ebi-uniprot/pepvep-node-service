
import { Node } from '../index';

/**
 * To represent a 'Variation' both in terms of Genomic
 * and Protein changes.
 */
export default class VariationNode extends Node {
  readonly aminoAcids: string;
  readonly allele: string;

  constructor(aminoAcids: string, allele: string) {
    super(`${aminoAcids}-${allele}-${Math.random()}`, 'VariationNode');
    this.aminoAcids = aminoAcids;
    this.allele = allele;
  }
}
