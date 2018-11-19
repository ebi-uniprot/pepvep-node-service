import Feature from './Feature';

export default class PositionalSignificance {
  private _features: Feature[];

  constructor() {
    this._features = [];
  }

  public addFeature(feature: Feature) {
    this._features.push(feature);
  }

  public getFeatures() {
    return this._features;
  }
}
