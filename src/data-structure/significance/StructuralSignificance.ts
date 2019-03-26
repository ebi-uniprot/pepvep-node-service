
export default class StructuralSignificance {
  readonly id: string;
  readonly method: string;
  readonly range: number[];

  constructor(id: string, method: string, range: number[]) {
    this.id = id;
    this.method = method;
    this.range = range;
  }

  public toJSON() {
    return {
      id: this.id,
      method: this.method,
      range: this.range,
    };
  }
}
