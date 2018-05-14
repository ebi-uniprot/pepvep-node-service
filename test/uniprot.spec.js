var expect = require('chai').expect;
var UniProtKbFetch = require('../src/data-fetch/UniProtKB');
var Significance = require('../src/data-process/significance');
var uniProtKbMock = require('./mocks/uniprot.mock');

describe('UniProtKB', function() {
  beforeEach(function(){
    uniProtKbMock();
  })

  describe('#getProteinsByPosition()', function() {
    it('should get the coordinates', function() {
      UniProtKbFetch.default.getProteinsByPosition('1',27873210, d => {
        expect(response.length).to.equal(5);
      })
    });
  });

  describe('#getPositionalSignificance()', function(){
    it('should do something', function() {
      Significance.default.getPositionalSignificance('1',27873210, d => {
        var response = d.data;
        expect(response.length).to.equal(4);
      })
    });
  })
});