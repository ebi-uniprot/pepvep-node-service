import Feature from "./Feature";

export default class PositionalSignificance {
  private features: Array<Feature>;

  constructor() {
    this.features = new Array();
  }

  public addFeature(feature: Feature) {
    this.features.push(feature);
  }

  public getFeatures() {
    return this.features;
  }
}
