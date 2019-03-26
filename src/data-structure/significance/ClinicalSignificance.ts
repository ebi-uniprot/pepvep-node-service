/**
 * To define an object that holds relevant infromation regarding
 * the clinical significances of a variation.
 *
 * This class is simply holds a single textual value e.g. "likely_pathogenic"
 * or "pathogenic", however, makes it possible to have proper data validation
 * or use of enum data-structures, if required.
 *
 * A variant may have more than one clinical significances, which should be
 * expressed by creating and passing multiple instances of this class to
 * the `VariationNode`.
 */
export default class ClinicalSignificance {
  readonly raw: string;
  readonly value: string[];
  readonly association: any[];

  constructor(raw: string, association: any[]) {
    this.raw = raw;
    this.value = this.parseInput(raw);
    this.association = association;
  }

  private parseInput(raw: string) : string[] {
    return raw.split(',');
  }

  public toJSON() {
    return {
      categories: this.value,
      association: this.association,
    };
  }
}
