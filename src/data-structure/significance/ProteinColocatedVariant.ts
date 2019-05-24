/**
 * To define an object that holds relevant details regarding
 * protein colocated variants of a variation.
 */
export default class ProteinColocatedVariant {
  readonly featureId: string;
  readonly wildType: string;
  readonly alternativeSequence: string;
  readonly clinicalSignificances: string;
  readonly sourceType: string;
  readonly association: any[];
  readonly xrefs: any[];
  readonly polyphenScore: number;
  readonly siftScore: number;
  readonly disease: boolean;
  readonly nonDisease: boolean;
  readonly uniprot: boolean;
  readonly largeScaleStudy: boolean;
  readonly uncertain: boolean;

  private consequencesRegEx = {
    likelyDisease: [/disease/i, /pathogenic\b/i, /risk factor/i],
    likelyBenign: [/benign/i],
    uncertain: [/uncertain/i, /conflicting/i, /unclassified/i]
  };

  constructor(
    featureId: string,
    wildType: string,
    alternativeSequence: string,
    clinicalSignificances: string,
    sourceType: string,
    association: any[],
    xrefs: any[],
    polyphenScore: number,
    siftScore: number,
  ) {
    this.featureId = featureId;
    this.wildType = wildType;
    this.alternativeSequence = alternativeSequence;
    this.clinicalSignificances = clinicalSignificances;
    this.sourceType = sourceType;
    this.association = association || [];
    this.xrefs = xrefs;
    this.polyphenScore = polyphenScore;
    this.siftScore = siftScore;
    this.disease = this.isDisease();
    this.nonDisease = this.isNonDisease();
    this.uniprot = this.isUniProt();
    this.largeScaleStudy = this.isLargeScaleStudy();
    this.uncertain = this.isUncertain();
  }

  private isDisease() : boolean {
    return this.consequencesRegEx
      .likelyDisease
      .some(rx => rx.test(this.clinicalSignificances));
  }

  private isNonDisease() : boolean {
    return this.consequencesRegEx
      .likelyBenign
      .some(rx => rx.test(this.clinicalSignificances));
  }

  private isUniProt() : boolean {
    return this.xrefs
      && this.xrefs
        .reduce((names, current) => {
          return names
            .concat(current.name);
        }, [])
        .some(el => (el === 'uniprot' || el === 'UniProt'));
  }

  private isLargeScaleStudy() : boolean {
    return this.sourceType === 'large_scale_study' ||
      this.sourceType === 'mixed';
  }

  private isUncertain() : boolean {
    return (
      typeof this.clinicalSignificances === 'undefined'
      && typeof this.polyphenScore === 'undefined'
      && typeof this.siftScore === 'undefined'
    ) || (
      this.consequencesRegEx
        .uncertain
        .some(rx => rx.test(this.clinicalSignificances))
    );
  }
}
