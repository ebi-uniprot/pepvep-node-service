
import {
  Node,
  TranscriptConsequence
} from '../index';

/**
 * To represent a 'Variation' both in terms of Genomic
 * and Protein changes.
 */
export default class VariationNode extends Node {
  readonly allele: string;
  private _aminoAcids: string = null;
  private _transcriptConsequences: TranscriptConsequence[] = [];

  constructor(allele: string) {
    super(`${allele}-${Math.random()}`, 'VariationNode');
    this.allele = allele;
  }

  get aminoAcids() : string { return this._aminoAcids; };
  set aminoAcids(aminoAcids: string) { this._aminoAcids = aminoAcids; };

  get transcriptConsequences() : TranscriptConsequence[] {
    return this._transcriptConsequences;
  }

  public addTranscriptConsequence(consequence: TranscriptConsequence) : void {
    this._transcriptConsequences.push(consequence);
  }
}
