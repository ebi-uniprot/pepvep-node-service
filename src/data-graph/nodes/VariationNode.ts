
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
  readonly aminoAcids: string;
  readonly proteinStart: number;
  readonly proteinEnd: number;
  private _transcriptConsequences: TranscriptConsequence[] = [];
  private _positionalSignificances: any[] = [];

  constructor(
    allele: string,
    aminoAcids: string | undefined,
    proteinStart: number | undefined,
    proteinEnd: number | undefined
  ) {
    super(`${allele}-${Math.random()}`);
    this.allele = allele;
    this.aminoAcids = aminoAcids;
    this.proteinStart = proteinStart;
    this.proteinEnd = proteinEnd;
  }

  get transcriptConsequences() : TranscriptConsequence[] {
    return this._transcriptConsequences;
  }

  public addTranscriptConsequence(consequence: TranscriptConsequence) : void {
    this._transcriptConsequences.push(consequence);
  }
}
