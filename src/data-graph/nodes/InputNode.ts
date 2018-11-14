
import {
  Node,
  ColocatedVariant,
  ClinicalSignificance
} from '../index';

/**
 * To define an 'Input' node in the graph, where
 * the original user inputer -- raw variant queries,
 * are stored.
 */
export default class InputNode extends Node {
  readonly raw: string;
  private _colocatedVariants: ColocatedVariant[] = [];
  private _clinicalSignificances: ClinicalSignificance[] = [];

  constructor(input: string) {
    super(input);
    this.raw = input;
  }

  public toString() : string {
    return `${this.role}\t"${this.raw}"\r\n`;
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
