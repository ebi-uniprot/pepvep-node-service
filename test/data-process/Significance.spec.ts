import "mocha";
import { expect } from "chai";
import Significance from "../../src/data-process/Significance";
import Protein from "../../src/data-structure/Protein";
import uniProtKbMock from "../mocks/uniprot.mock";
import Variation from "../../src/data-structure/Variation";

describe("Significance", function() {
  beforeEach(function() {
    uniProtKbMock();
  });

  describe("#addPositionalSignificance()", function() {
    it("should get features which overlap with position", function() {
      const accessions = ["P05067", "P85552", "Q8A9S3"];
      const proteinArray = accessions.map(acc => new Protein(acc));
      proteinArray.forEach(protein => {
        let variation = new Variation("A");
        variation.proteinStart = 2;
        variation.proteinEnd = 10;
        protein.addVariation(variation);
      });
      return Significance.addPositionalSignificance(proteinArray).then(d => {
        expect(
          proteinArray[0]
            .getVariations()[0]
            .getPositionalSignificance()
            .getFeatures().length
        ).to.equal(2);
        expect(
          proteinArray[1]
            .getVariations()[0]
            .getPositionalSignificance()
            .getFeatures().length
        ).to.equal(1);
        expect(
          proteinArray[2]
            .getVariations()[0]
            .getPositionalSignificance()
            .getFeatures().length
        ).to.equal(1);
      });
    });

    it("should get nothing", function() {
      // return Significance.getPositionalSignificance("6", 11112).then(d => {
      //   expect(d.length).to.equal(0);
      // });
    });

    it("should return 400", function() {
      // return Significance.default.getPositionalSignificance('66', 'aaaa').then(d => {
      //   expect(d.length).to.equal(0);
      // });
    });
  });

  describe("#getPositionalSignificanceForProtein", function() {
    // it("should get the right number of features", function() {
    //   return Significance.getPositionalSignificanceForProtein(
    //     "P05067",
    //     20
    //   ).then(d => {
    //     expect(d.length).to.equal(6);
    //   });
    // });
    // it("should not find anything outside of range", function() {
    //   return Significance.getPositionalSignificanceForProtein(
    //     "P05067",
    //     999999
    //   ).then(d => {
    //     expect(d.length).to.equal(0);
    //   });
    // });
  });
});
