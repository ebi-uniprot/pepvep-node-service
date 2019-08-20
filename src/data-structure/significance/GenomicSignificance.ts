
export default class GenomicSignificance {
  private _populationFrequencies: any;
  private _polyphenPrediction: string;
  private _polyphenScore: number;
  private _siftPrediction: string;
  private _siftScore: number;
  private _caddPhred: number;
  private _caddRaw: number;

  // Population Frequencies
  public get populationFrequencies() : any {
    return this._populationFrequencies;
  }
  public set populationFrequencies(frequencies: any) {
    this._populationFrequencies = frequencies;
  }

  // Polyphen Prediction
  get polyphenPrediction() : string { return this._polyphenPrediction; }
  set polyphenPrediction(prediction: string) { this._polyphenPrediction = prediction; }

  // Polyphen Score
  get polyphenScore() : number { return this._polyphenScore; }
  set polyphenScore(score: number) { this._polyphenScore = score; }

  // SIFT Prediction
  get siftPrediction() : string { return this._siftPrediction; }
  set siftPrediction(prediction: string) { this._siftPrediction = prediction; }

  // SIFT Score
  get siftScore() : number { return this._siftScore; }
  set siftScore(score: number) { this._siftScore = score; }

  // CADD PHRED
  public get caddPhred() : number { return this._caddPhred; }
  public set caddPhred(phred: number) { this._caddPhred = phred; }

  // CADD Raw
  public get caddRaw() : number { return this._caddRaw; }
  public set caddRaw(raw: number) { this._caddRaw = raw; }

  public toJSON() {
    return {
      populationFrequencies: this.populationFrequencies,
      consequencePrediction: {
        polyphenPrediction: this.polyphenPrediction,
        polyphenScore: this.polyphenScore,
        siftPrediction: this.siftPrediction,
        siftScore: this.siftScore,
        caddPhred: this.caddPhred,
        caddRaw: this.caddRaw,
      },
    };
  }
}
