
import { Node } from '../index';

export default class ProteinNode extends Node {
  readonly ensp: string;
  readonly enst: string;
  readonly swissprotAccessions: string[];
  readonly tremblAccessions: string[];

  constructor(ensp: string, enst: string, swissprotAccessions: string[] | undefined, tremblAccessions: string[] | undefined) {
    super(`ENSP:${ensp}-ENST:${enst}`, 'ProteinNode');
    this.ensp = ensp;
    this.enst = enst;
    this.swissprotAccessions = swissprotAccessions || [];
    this.tremblAccessions = tremblAccessions || [];
  }

  get accessions() : string[] {
    return [...this.swissprotAccessions, ...this.tremblAccessions];
  }

  get preferredAccession() : string | null {
    // NOTE: this should be able to choose from iso-forms and canonicals
    if (0 < this.swissprotAccessions.length) {
      return this.swissprotAccessions[0];
    }
    // NOTE: this should be able to choose one or many trembl accessions
    // based on some logic.
    if (0 <this.tremblAccessions.length) {
      return this.tremblAccessions[0];
    }

    return null;
  }

  public toString() : string {
    let result: string = `${this.type}\n\tENSP: ${this.ensp}\n\tAccessions:\n`;

    if (0 < this.swissprotAccessions.length) {
      result += '\t[SwissProt: ';
      
      this.swissprotAccessions
        .forEach(accession => result += `${accession},`);

      result = result.substring(0, result.length - 1);
      result += `]\n`;
    }

    if (0 < this.tremblAccessions.length) {
      result += '\t[Trembl: ';
      
      this.tremblAccessions
        .forEach(accession => result += `${accession},`);

      result = result.substring(0, result.length - 1);
      result += `]\n`;
    }

    return result + `\n`;
  }
}
