
import {
  Node,
  TranscriptConsequence,
  ColocatedVariant,
  ClinicalSignificance
} from '../index';

/**
 * To represent a 'Variation' both in terms of Genomic
 * and Protein changes.
 */
export default class VariationNode extends Node {
  readonly allele: string;
  private _aminoAcids: string = null;
  private _transcriptConsequences: TranscriptConsequence[] = [];
  private _colocatedVariants: ColocatedVariant[] = [];
  private _clinicalSignificances: ClinicalSignificance[] = [];

  constructor(allele: string) {
    super(`${allele}-${Math.random()}`);
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

  get colocatedVariants() : ColocatedVariant[] {
    return this._colocatedVariants;
  };

  public addColocatedVariant(variant: ColocatedVariant) : void {
    this._colocatedVariants.push(variant);
  }

  get clinicalSignificances() : ClinicalSignificance[] {
    return this._clinicalSignificances;
  }

  public addClinicalSignificance(significance: ClinicalSignificance) {
    this._clinicalSignificances.push(significance);
  }
}
