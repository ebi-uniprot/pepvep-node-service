import "mocha";
import { expect } from "chai";
import UniProtKbFetch from "../../src/data-fetch/UniProtKB";
import uniProtKbMock from "../mocks/uniprot.mock";

let accession: string;

describe("UniProtKB", () => {
  beforeEach(() => {
    uniProtKbMock();
    accession = "P05067";
  });

  describe("#proteinDetailsByAccession()", () => {
    it("should retrieve details for a given accession", () => {
      return UniProtKbFetch.getProteinDetailByAccession([accession]).then(
        ({ data }) => {
          expect(data).not.to.be.undefined;
          expect(data).not.to.be.null; 
          expect(data).not.to.be.empty;
          expect(data).not.to.be.a("function");
        }
      );
    });
  });

  describe("#getProteinsFeatures()", () => {
    it("should retrieve features for a list of protein accession", () => {
      return UniProtKbFetch.getProteinFeatures([
        "P05067",
        "P85552",
        "Q8A9S3"
      ]).then(({ data }) => {
        expect(data.length).to.equal(3);
      });
    });
  });

  // describe('#getProteinVariants()', () => {
  //   it('should retrieve variants for a given accession', () => {
  //     return UniProtKbFetch.getProteinVariants(accession)
  //       .then(({
  //         data
  //       }) => {
  //         expect(data).not.to.be.undefined;
  //         expect(data).not.to.be.null;
  //         expect(data).not.to.be.empty;
  //         expect(data).not.to.be.a('function');
  //       });
  //   });
  // });
});
