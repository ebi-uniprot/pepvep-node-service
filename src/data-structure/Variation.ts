
import TranscriptSignificance from './significance/TranscriptSignificance';
import PositionalSignificance from './significance/PositionalSignificance';
import StructuralSignificance from './significance/StructuralSignificance';
import ClinicalSignificance from './significance/ClinicalSignificance';
import ColocatedVariant from './significance/ColocatedVariant';

export default class Variation {
  readonly allele: string;
  private _aminoAcids: string;
  private _proteinStart: number;
  private _proteinEnd: number;
  private _transcriptSignificance: TranscriptSignificance[] = [];
  private _positionalSignificance: PositionalSignificance[]  = [];
  private _clinicalSignificance: ClinicalSignificance[] = [];
  private _colocatedVariants: ColocatedVariant[] = [];

  constructor(allele: string) {
    this.allele = allele;
  }

  // Amino Acids
  public get aminoAcids() : string { return this._aminoAcids; };
  public set aminoAcids(aminoAcids: string) { this._aminoAcids = aminoAcids; };

  // Protien Start
  public get proteinStart() : number { return this._proteinStart; };
  public set proteinStart(start: number) { this._proteinStart = start; };

  // Protein End
  public get proteinEnd() : number { return this._proteinEnd; };
  public set proteinEnd(end: number) { this._proteinEnd = end; };

  // Transcript Significances
  public getTranscriptSignificance() : TranscriptSignificance[] {
    return this._transcriptSignificance;
  }

  public addToTranscriptSignificances(transcriptSignificance: TranscriptSignificance) {
    this._transcriptSignificance.push(transcriptSignificance);
  }

  // Positional Significances
  public getPositionalSignificance() : PositionalSignificance[] {
    return this._positionalSignificance;
  }

  public addToPositionalSignificances(positionalSignificance: PositionalSignificance) {
    this._positionalSignificance.push(positionalSignificance);
  }

  // Clinical Significances
  public getClinicalSignificances() : ClinicalSignificance[] {
    return this._clinicalSignificance;
  }

  public addToClinicalSignificances(clinicalSignificance: ClinicalSignificance) {
    this._clinicalSignificance.push(clinicalSignificance);
  }

  // Colocated Variants
  public getColocatedVariants() : ColocatedVariant[] {
    return this._colocatedVariants;
  }

  public addToColocatedVariants(colocatedVariant: ColocatedVariant) {
    this._colocatedVariants.push(colocatedVariant);
  }
}
