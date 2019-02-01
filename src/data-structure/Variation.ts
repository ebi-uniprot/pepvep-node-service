import TranscriptSignificance from './significance/TranscriptSignificance';
import PositionalSignificance from './significance/PositionalSignificance';
import StructuralSignificance from './significance/StructuralSignificance';
import ClinicalSignificance from './significance/ClinicalSignificance';
import ColocatedVariant from './significance/ColocatedVariant';
import Feature from './significance/Feature';
import Evidence from './significance/Evidence';

const specialFeatureTypes: string[] = ["MUTAGEN", "CONFLICT"];
export const featureTypes: any = {
  "SIGNAL": "Single Peptide",
  "PROPEP": "Propeptide",
  "CHAIN": "Chain",
  "DOMAIN": "Functional Domain",
  "ACT_SITE": "Active Site Residue",
  "METAL": "Metal Ion Binding Site Residue",
  "SITE": "Functionally Important Residue",
  "MOD_RES": "PTM Modified Residue",
  "CARBOHYD": "PTM Carbohydrate",
  "DISULFID": "PTM Disulfide Bond Residue",
  "MUTAGEN": "Mutated Residue",
  "INIT_MET": "Cleaved Initiator Methionine",
  "TRANSIT": "Cleaved Transit Peptide",
  "TOPO_DOM": "Transmembrane Protein Topological Region",
  "TRANSMEM": "Helical Transmembrane Peptide",
  "REPEAT": "Repeated Sequence",
  "CA_BIND": "Calcium Binding Residue",
  "ZN_FING": "Zinc Finger Residue",
  "DNA_BIND": "DNA Binding Residue",
  "NP_BIND": "Nucleotide Phosphate Binding Residue",
  "COILED": "Coiled-coil Region",
  "MOTIF": "Functional Motif",
  "COMPBIAS": "AA Composition Bias",
  "BINDING": "Binding Site Residue",
  "NON_STD": "Non-standard Amino Acid",
  "LIPID": "PTM bound Lipid",
  "CROSSLINK": "Covalent Link To Another Protein",
  "CONFLICT": "Difference In Reported Protein Sequences",
  "HELIX": "Alpha-helix",
  "STRAND": "Beta-strand",
};

const threeLetterCode: any = {
 'A': 'Ala',
 'R': 'Arg',
 'N': 'Asn',
 'D': 'Asp',
 'B': 'Asx',
 'C': 'Cys',
 'E': 'Glu',
 'Q': 'Gln',
 'Z': 'Glx',
 'G': 'Gly',
 'H': 'His',
 'I': 'Ile',
 'L': 'Leu',
 'K': 'Lys',
 'M': 'Met',
 'F': 'Phe',
 'P': 'Pro',
 'S': 'Ser',
 'T': 'Thr',
 'W': 'Trp',
 'Y': 'Tyr',
 'V': 'Val',
};

export default class Variation {
  readonly allele: string;
  private _baseAndAllele: string;
  private _aminoAcids: string;
  private _threeLetterCodes: string;
  private _codons: string;
  private _proteinStart: number;
  private _proteinEnd: number;
  private _genomicVariationStart: number;
  private _genomicVariationEnd: number;
  private _hgvsg: string;
  private _hgvsp: string;
  // private _mostSevereConsequence: string;
  private _canonical: boolean;
  private _transcriptSignificance: TranscriptSignificance[] = [];
  private _positionalSignificance: PositionalSignificance;
  private _clinicalSignificance: ClinicalSignificance;
  private _structuralSignificances: StructuralSignificance[] = [];
  private _colocatedVariants: ColocatedVariant[] = [];

  constructor(allele: string) {
    this.allele = allele;
    this._positionalSignificance = new PositionalSignificance();
  }

  // Full Allele with Base
  public get baseAndAllele() : string {
    return this._baseAndAllele;
  }
  public set baseAndAllele(fullAllele: string) {
    this._baseAndAllele = fullAllele;
  }

  // Amino Acids
  public get aminoAcids() : string {
    return this._aminoAcids;
  }
  public set aminoAcids(aminoAcids: string) {
    this._aminoAcids = aminoAcids;

    const oneLetterCodes = aminoAcids.split('/');
    const left: string = threeLetterCode[oneLetterCodes[0]];
    const right: string = threeLetterCode[oneLetterCodes[1]];
    this._threeLetterCodes = `${left}/${right}`;
  }

  // Three Letter Codes
  public get threeLetterCodes() : string {
    return this._threeLetterCodes;
  }

  // Codons
  public get codons() : string {
    return this._codons;
  }
  public set codons(codons: string) {
    this._codons = codons;
  }

  // Protien Start
  public get proteinStart() : number {
    return this._proteinStart;
  }
  public set proteinStart(start: number) {
    this._proteinStart = start;
  }

  // Protein End
  public get proteinEnd() : number {
    return this._proteinEnd;
  }
  public set proteinEnd(end: number) {
    this._proteinEnd = end;
  }

  // Genomic Variation Start
  public get genomicVariationStart() : number {
    return this._genomicVariationStart;
  }

  public set genomicVariationStart(start: number) {
    this._genomicVariationStart = start;
  }

  // Genomic Variation End
  public get genomicVariationEnd() : number {
    return this._genomicVariationEnd;
  }

  public set genomicVariationEnd(end: number) {
    this._genomicVariationEnd = end;
  }

  // // Most Severe Consequence
  // public get mostSevereConsequence() : string {
  //   return this._mostSevereConsequence;
  // }
  // public set mostSevereConsequence(consequence: string) {
  //   this._mostSevereConsequence = consequence;
  // }

  // HGVSg
  public get hgvsg() : string {
    return this._hgvsg;
  }

  // HGVSP
  public get hgvsp() : string {
    return this._hgvsp;
  }

  public set hgvsp(hgvsp: string) {
    this._hgvsp = hgvsp;
  }

  // Canonical
  public get canonical() : boolean {
    return this._canonical;
  }

  public set canonical(canonical: boolean) {
    this._canonical = canonical;
  }

  // Transcript Significances
  public getTranscriptSignificance() : TranscriptSignificance[] {
    return this._transcriptSignificance;
  }

  public addTranscriptSignificance(
    transcriptSignificance: TranscriptSignificance,
  ) {
    this._transcriptSignificance.push(transcriptSignificance);
  }

  // Positional Significances
  public getPositionalSignificance() : PositionalSignificance {
    return this._positionalSignificance;
  }

  public addPositionalSignificance(
    positionalSignificance: PositionalSignificance,
  ) {
    this._positionalSignificance = positionalSignificance;
  }

  // Clinical Significances
  public getClinicalSignificances() : ClinicalSignificance {
    return this._clinicalSignificance;
  }

  public addClinicalSignificance(clinicalSignificance: ClinicalSignificance) {
    this._clinicalSignificance = clinicalSignificance;
  }

  // Structural Significances
  public getStructuralSignificances() : StructuralSignificance[] {
    return this._structuralSignificances;
  }

  public addStructuralSignificance(structuralSignificance: StructuralSignificance) {
    this._structuralSignificances.push(structuralSignificance);
  }

  // Colocated Variants
  public getColocatedVariants() : ColocatedVariant[] {
    return this._colocatedVariants;
  }

  public addColocatedVariant(colocatedVariant: ColocatedVariant) {
    this._colocatedVariants.push(colocatedVariant);
  }

  // Check if this variation overlaps with the suplied range.
  public isInRange(start: number, end: number) : boolean {
    const maxStarts: number = Math.max(this.proteinStart, start);
    const minEnds: number = Math.min(this.proteinEnd, end);

    return (0 >= maxStarts - minEnds);
  }

  public addOverlappingFeatures(rawFeatures: any) {
    rawFeatures.forEach((rawFeature) => {
      // overal range.
      const maxStarts: number = Math.max(this.proteinStart, rawFeature.begin);
      const minEnds: number = Math.min(this.proteinEnd, rawFeature.end);

      if (0 < maxStarts - minEnds) {
        // not in range.
        return;
      }

      // feature type.
      if ('undefined' === typeof featureTypes[rawFeature.type]) {
        // not a type that we are interested in.
        return;
      }

      // TODO: Where should the following data be collected? How is it represented?
      // special types.
      if (specialFeatureTypes.includes(rawFeature.type)) {
        // collect this somewhere...
      }

      // evidence.
      const evidences: Evidence[] = [];

      if ('undefined' !== typeof rawFeature.evidences) {
        rawFeature.evidences.forEach(ev => {
          // TODO: ev.source is 'undefined' in some cases.
          if ('undefined' === typeof ev.source) {
            return;
          }

          const evidence: Evidence = new Evidence(
            ev.code,
            ev.source.name,
            ev.source.id,
            ev.source.url,
            ev.source.alternativeUrl,
          );

          evidences.push(evidence);
        });
      }

      // feature.
      const feature: Feature = new Feature(
        rawFeature.type,
        rawFeature.typeDescription,
        rawFeature.category,
        rawFeature.description,
        rawFeature.begin,
        rawFeature.end,
        evidences,
      );

      this.getPositionalSignificance()
        .addFeature(feature);
    });
  }

  public buildHGVSg(geneId: string) : void {
    const allele: string = this.allele.replace('/', '>');
    const hgvsg: string = `${geneId}:g.${this.genomicVariationStart}${allele}`;
    this._hgvsg = hgvsg;
  }

  // public toJSON() : any {
  //   return {
  //     allele: this.allele,
  //     baseAndAllele: this.baseAndAllele,

  //   }
  // }
}
