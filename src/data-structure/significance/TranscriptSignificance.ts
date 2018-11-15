
/**
 * To define an object that holds various (optional) details
 * about a variation's positional consequences.
 *
 * The getters and setters are there, so in the future a proper
 * data validation layer can be implemented for each field.
 */
export default class TranscriptSignificance {
  private _biotype: string;
  private _impact: string;
  private _codons: string;
  private _polyphenPrediction: string;
  private _polyphenScore: number;
  private _siftPrediction: string;
  private _siftScore: number;
  private _consequenceTerms: string[] = [];

  get biotype() : string { return this._biotype; };
  set biotype(type: string) { this._biotype = type; };

  get impact() : string { return this._biotype; };
  set impact(type: string) { this._impact = type; };

  get codons() : string { return this._codons; };
  set codons(codons: string) { this._codons = codons; };

  get polyphenPrediction() : string { return this._polyphenPrediction; };
  set polyphenPrediction(prediction: string) { this._polyphenPrediction = prediction; };

  get polyphenScore() : number { return this._polyphenScore; };
  set polyphenScore(score: number) { this._polyphenScore = score; };

  get siftPrediction() : string { return this._siftPrediction; };
  set siftPrediction(prediction: string) { this._siftPrediction = prediction; };

  get siftScore() : number { return this._siftScore; };
  set siftScore(score: number) { this._siftScore = score; };

  get consequenceTerms() : string[] { return this._consequenceTerms; };

  public addConsequenceTerm(term: string) {
    this._consequenceTerms.push(term);
  }
}