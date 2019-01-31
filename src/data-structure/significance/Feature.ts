import Evidence from './Evidence';

class Feature {
  readonly type: string;
  readonly typeDescription: string;
  readonly category: string;
  readonly description: string;
  readonly begin: number;
  readonly end: number;
  readonly evidences: Evidence[];

  constructor(
    type: string,
    typeDescription: string,
    category: string,
    description: string,
    begin: number,
    end: number,
    evidences: Evidence[],
  ) {
    this.type = type;
    this.typeDescription = typeDescription;
    this.category = category;
    this.description = description;
    this.begin = begin;
    this.end = end;
    this.evidences = evidences;
  }
}

export default Feature;
