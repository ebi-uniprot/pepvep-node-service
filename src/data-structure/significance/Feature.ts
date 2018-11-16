import Evidence from "./Evidence";
class Feature {
  readonly type: string;
  readonly category: string;
  readonly description: string;
  readonly begin: number;
  readonly end: number;
  readonly evidences: Array<Evidence>;

  constructor(
    type: string,
    category: string,
    description: string,
    begin: number,
    end: number,
    evidences: Array<Evidence>
  ) {
    this.type = type;
    this.category = category;
    this.description = description;
    this.begin = begin;
    this.end = end;
    this.evidences = evidences;
  }
}

export default Feature;
