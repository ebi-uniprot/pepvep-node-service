var expect = require('chai').expect;
var UniProtKbFetch = require('../src/data-fetch/UniProtKB');
var Significance = require('../src/data-process/significance');
var uniProtKbMock = require('./mocks/uniprot.mock');

describe('UniProtKB', function () {
  beforeEach(function () {
    uniProtKbMock();
  })

  describe('#getProteinsByPosition()', function () {
    it('should retrieve different entries for a given position', function () {
      return UniProtKbFetch.default.getProteinsByPosition('6', 26104031).then(d => {
        var response = d.data;
        expect(response.length).to.equal(5);
      });
    });
  });

  describe('#getPositionalSignificance()', function () {
    it('should get features which overlap with position', function () {
      return Significance.default.getPositionalSignificance('6', 26104031).then(d => {
        expect(d[0].geneCoordinates[0].feature[0].description).to.equal('TAF.');
      });
    });

    it('should get nothing', function () {
      return Significance.default.getPositionalSignificance('6', 11112).then(d => {
        expect(d.length).to.equal(0);
      });
    });

    it('should return 400', function () {
      // return Significance.default.getPositionalSignificance('66', 'aaaa').then(d => {
      //   expect(d.length).to.equal(0);
      // });
    });
  });

  describe('#getClinicalSignificance()', function(){
    it('should parse HGVS', function(){
      expect(Significance.default.parseHGVS('NC_000021.9:g.25905030G>C')).to.deep.equal({
        chromosome: 'NC_000021.9', //TODO there is a mapping to get the chromosome name
        position: 25905030,
        wt: 'G',
        allele: 'C'
      })
    });

    it('should return the correct variant for the given position/allele', function(){
      return Significance.default.getClinicalSignificance('P05067', '21', 25905030, 'C').then(variants =>{
        for (variant of variants) {
          expect(variant.genomicLocation).to.equal('NC_000021.9:g.25905030G>C');
        }
      })
    });
  });
});