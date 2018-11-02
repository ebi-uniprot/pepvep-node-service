
import { Node } from '../index';

/**
 * To represent a 'Protein' node in the graph. While
 * multiple accessions can be assigned to a single protein
 * node, the node itself should be a unique protein entry,
 * which is deinfed by ENSP/ENST IDs here.
 */
export default class ProteinNode extends Node {
  readonly ensp: string;
  readonly enst: string;
  readonly swissprotAccessions: string[];
  readonly tremblAccessions: string[];

  constructor(ensp: string, enst: string, swissprotAccessions: string[] | undefined, tremblAccessions: string[] | undefined) {
    super(`ENSP:${ensp}-ENST:${enst}`);
    this.ensp = ensp;
    this.enst = enst;
    this.swissprotAccessions = swissprotAccessions || [];
    this.tremblAccessions = tremblAccessions || [];
  }

  /**
   * This method will return an array of all of the accessions
   * assigned to this node. There may be different accessions
   * here from SwissProt and Trembl that both point to the same
   * entry.
   *
   * If you would like to exclude the accessions that are possibly
   * pointing to the same protin entry, use the `prefereedAccession`
   * method. 
   */
  get accessions() : string[] {
    return [...this.swissprotAccessions, ...this.tremblAccessions];
  }

  /**
   * Since there may be multiple accessions per each individual protein
   * node in which multilpe accessions may point to a unique protein
   * entry, this method can be used to filter such accessions out and
   * (at the moment) return only one accession for the `ProteinNode`.
   */
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
