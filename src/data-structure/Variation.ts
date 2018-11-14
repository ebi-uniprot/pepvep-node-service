
// import TranscriptSignificance from './significance/TranscriptSignificance';
// import PositionalSignificance from './significance/PositionalSignificance';


export default class Variation {
  readonly allele: string;
  private _aminoAcids: string;
  private _proteinStart: number;
  private _proteinEnd: number;
  private _transcriptSignificance = [];
  private _positionalSignificance = [];
  private _clinicalSignificance = [];
  private _colocatedVariants = [];

  constructor(allele: string) {
    this.allele = allele;
  }
}
