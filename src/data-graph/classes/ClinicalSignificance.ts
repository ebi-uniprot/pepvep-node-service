
/**
 * To define an object that holds relevant infromation regarding
 * the clinical significances of a variation.
 */
export default class ClinicalSignificance {
  readonly raw: string;
  readonly value: string;

  constructor(raw: string) {
    this.raw = raw;
    this.value = this.parseInput(raw);
  }

  private parseInput(raw: string) : string {
    return raw;
  }
}
