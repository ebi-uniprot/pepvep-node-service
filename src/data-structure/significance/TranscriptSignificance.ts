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
  private _polyphenPrediction: string;
  private _polyphenScore: number;
  private _siftPrediction: string;
  private _siftScore: number;
  private _mostSevereConsequence: string;
  private _consequenceTerms: string[] = [];
  private _mutationTasterPrediction: string;
  private _mutationTasterScore: string;
  private _lrtPrediction: string;
  private _lrtScore: number;
  private _fathmmPrediction: string;
  private _fathmmScore: string;
  private _proveanPrediction: string;
  private _proveanScore: number;
  private _caddPhred: number;
  private _caddRaw: number;
  private _appris: string;
  private _mutPredScore: number;
  private _blosum62: number;
  private _tsl: number;
  private _pathogenicity: string[];

  // Biotype
  get biotype() : string { return this._biotype; }
  set biotype(type: string) { this._biotype = type; }

  // Impact
  get impact() : string { return this._impact; }
  set impact(type: string) { this._impact = type; }

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

  // Most Severe Consequence
  public get mostSevereConsequence() : string {
    return this._mostSevereConsequence;
  }
  public set mostSevereConsequence(consequence: string) {
    this._mostSevereConsequence = consequence;
  }

  get consequenceTerms() : string[] { return this._consequenceTerms; }

  public addConsequenceTerm(term: string) {
    this._consequenceTerms.push(term);
  }

  // Mutation Taster Prediction
  public get mutationTasterPrediction() : string {
    return this._mutationTasterPrediction;
  }
  public set mutationTasterPrediction(prediction: string) {
    this._mutationTasterPrediction = prediction;
  }

  // Mutation Taster Score
  public get mutationTasterScore() : string {
    return this._mutationTasterScore;
  }
  public set mutationTasterScore(score: string) {
    this._mutationTasterScore = score;
  }

  // LRT Prediction
  public get lrtPrediction() : string { return this._lrtPrediction; }
  public set lrtPrediction(prediction: string) { this._lrtPrediction = prediction; }

  // LRT Score
  public get lrtScore() : number { return this._lrtScore; }
  public set lrtScore(score: number) { this._lrtScore = score; }

  // Fathmm Prediction
  public get fathmmPrediction() : string { return this._fathmmPrediction; }
  public set fathmmPrediction(prediction: string) { this._fathmmPrediction = prediction; }

  // Fathmm Score
  public get fathmmScore() : string { return this._fathmmScore; }
  public set fathmmScore(score: string) { this._fathmmScore = score; }

  // Provean Prediction
  public get proveanPrediction() : string { return this._proveanPrediction; }
  public set proveanPrediction(prediciton: string) { this._proveanPrediction = prediciton; }

  // Provean Score
  public get proveanScore() : number { return this._proveanScore; }
  public set proveanScore(score: number) { this._proveanScore = score; }

  // CADD PHRED
  public get caddPhred() : number { return this._caddPhred; }
  public set caddPhred(phred: number) { this._caddPhred = phred; }

  // CADD Raw
  public get caddRaw() : number { return this._caddRaw; }
  public set caddRaw(raw: number) { this._caddRaw = raw; }

  // APPRIS
  public get appris() : string { return this._appris; }
  public set appris(appris: string) { this._appris = appris; }

  // MutPred Score
  public get mutPredScore() : number { return this._mutPredScore; }
  public set mutPredScore(score: number) { this._mutPredScore = score; }

  // Blosum 62
  public get blosum62() : number { return this._blosum62; }
  public set blosum62(value: number) { this._blosum62 = value; }

  // TSL
  public get tsl() : number { return this._tsl; }
  public set tsl(value: number) { this._tsl = value; }

  // Pathogenicity
  public get pathogenicity() : string[] { return this._pathogenicity; }
  public set pathogenicity(pathogenicity: string[]) { this._pathogenicity = pathogenicity; }

  public toJSON() {
    return {
      biotype: this.biotype,
      impact: this.impact,
      polyphenPrediction: this.polyphenPrediction,
      polyphenScore: this.polyphenScore,
      siftPrediction: this.siftPrediction,
      siftScore: this.siftScore,
      mostSevereConsequence: this.mostSevereConsequence,
      consequenceTerms: this.consequenceTerms,
      mutationTasterPrediction: this.mutationTasterPrediction,
      mutationTasterScore: this.mutationTasterScore,
      lrtPrediction: this.lrtPrediction,
      lrtScore: this.lrtScore,
      fathmmPrediction: this.fathmmPrediction,
      fathmmScore: this.fathmmScore,
      proveanPrediction: this.proveanPrediction,
      proveanScore: this.proveanScore,
      caddPhred: this.caddPhred,
      caddRaw: this.caddRaw,
      appris: this.appris,
      mutPredScore: this.mutPredScore,
      blosum62: this.blosum62,
      tsl: this.tsl,
      pathogenicity: this.pathogenicity,
    };
  }
}
