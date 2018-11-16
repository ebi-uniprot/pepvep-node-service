import axios from "axios";
import Helpers from "./Helpers";

const taxID = "9606";

export default class UniProtKB {
  public static async proteinsDetailByAccession(accessions: string[]) {
    let queryString: string = Helpers.stringOrArrayToCommaSeparated(accessions);
    const url: string = `https://www.ebi.ac.uk/proteins/api/proteins?format=json&accession=${queryString}`;
    return await axios.get(url);
  }

  public static async getProteinFeatures(accessions: string[]) {
    const accessionsString: string = accessions.join(",");
    // TODO this call is limited to 100 only, we need to do it in batches
    const url: string = `https://www.ebi.ac.uk/proteins/api/features?accession=${accessionsString}`;
    return await axios.get(url);
  }

  public static async getProteinVariants(accessions: string[]) {
    const accessionsString: string = accessions.join(",");
    // TODO this call is limited to 100 only, we need to do it in batches
    const url: string = `https://www.ebi.ac.uk/proteins/api/variation/${accessionsString}`;
    return await axios.get(url);
  }
}
