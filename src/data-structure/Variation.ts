import TranscriptSignificance from "./significance/TranscriptSignificance";
import PositionalSignificance from "./significance/PositionalSignificance";
import StructuralSignificance from "./significance/StructuralSignificance";
import ClinicalSignificance from "./significance/ClinicalSignificance";
import ColocatedVariant from "./significance/ColocatedVariant";
import Feature from "./significance/Feature";
import Evidence from "./significance/Evidence";

// interface RawFeature {
//   begin : number;
//   end: number;
// }
export default class Variation {
  readonly allele: string;
  private _aminoAcids: string;
  private _proteinStart: number;
  private _proteinEnd: number;
  private _transcriptSignificance: TranscriptSignificance[] = [];
  private _positionalSignificance: PositionalSignificance;
  private _clinicalSignificance: ClinicalSignificance[] = [];
  private _colocatedVariants: ColocatedVariant[] = [];

  constructor(allele: string) {
    this.allele = allele;
    this._positionalSignificance = new PositionalSignificance();
  }

  // Amino Acids
  public get aminoAcids(): string {
    return this._aminoAcids;
  }
  public set aminoAcids(aminoAcids: string) {
    this._aminoAcids = aminoAcids;
  }

  // Protien Start
  public get proteinStart(): number {
    return this._proteinStart;
  }
  public set proteinStart(start: number) {
    this._proteinStart = start;
  }

  // Protein End
  public get proteinEnd(): number {
    return this._proteinEnd;
  }
  public set proteinEnd(end: number) {
    this._proteinEnd = end;
  }

  // Transcript Significances
  public getTranscriptSignificance(): TranscriptSignificance[] {
    return this._transcriptSignificance;
  }

  public addTranscriptSignificance(
    transcriptSignificance: TranscriptSignificance
  ) {
    this._transcriptSignificance.push(transcriptSignificance);
  }

  // Positional Significances
  public getPositionalSignificance(): PositionalSignificance {
    return this._positionalSignificance;
  }

  public addPositionalSignificance(
    positionalSignificance: PositionalSignificance
  ) {
    this._positionalSignificance = positionalSignificance;
  }

  // Clinical Significances
  public getClinicalSignificances(): ClinicalSignificance[] {
    return this._clinicalSignificance;
  }

  public addClinicalSignificance(clinicalSignificance: ClinicalSignificance) {
    this._clinicalSignificance.push(clinicalSignificance);
  }

  // Colocated Variants
  public getColocatedVariants(): ColocatedVariant[] {
    return this._colocatedVariants;
  }

  public addColocatedVariant(colocatedVariant: ColocatedVariant) {
    this._colocatedVariants.push(colocatedVariant);
  }

  public addOverlappingFeatures(rawFeatures) {
    const featuresToAdd = rawFeatures.filter(
      rawFeature =>
        this.proteinStart >= rawFeature.begin &&
        this.proteinEnd <= rawFeature.end
    );
    featuresToAdd.forEach(rawFeature => {
      const evidences = rawFeature.evidences
        ? rawFeature.evidences.map(
            ev =>
              new Evidence(
                ev.code,
                ev.source.name,
                ev.source.id,
                ev.source.url,
                ev.source.alternativeUrl
              )
          )
        : [];
      const featureToAdd = new Feature(
        rawFeature.type,
        rawFeature.category,
        rawFeature.description,
        rawFeature.begin,
        rawFeature.end,
        evidences
      );
      this.getPositionalSignificance().addFeature(featureToAdd);
    });
  }
}
