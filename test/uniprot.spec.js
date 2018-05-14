var expect = require('chai').expect;
var UniProtKbFetch = require('../src/data-fetch/UniProtKB');
var Significance = require('../src/data-process/significance');
var uniProtKbMock = require('./mocks/uniprot.mock');

describe('UniProtKB', function() {
  beforeEach(function(){
    uniProtKbMock();
  })

  describe('#getProteinsByPosition()', function() {
    it('should retrieve different entries for a given position', function() {
      return UniProtKbFetch.default.getProteinsByPosition('6',26104031).then(d => {
        var response = d.data;
        expect(response.length).to.equal(5);
      });
    });
  });

  describe('#getPositionalSignificance()', function(){
    it('should get features which overlap with position', function() {
      return Significance.default.getPositionalSignificance('6',26104031).then(d => {
        expect(d.length).to.equal(2);
        expect(d[0].accession).to.equal('B2R4R0');
        expect(d[0].geneCoordinates[0].feature.length).to.equal(1);
        expect(d[0].geneCoordinates[0].feature[0].description).to.equal('TAF.');
      });
    });

    it('should get nothing', function() {
      return Significance.default.getPositionalSignificance('6', 11112).then(d => {
        expect(d.length).to.equal(0);
      });
    });
  })
});