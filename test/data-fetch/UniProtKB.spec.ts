import 'mocha';
import { expect } from 'chai';
import UniProtKbFetch from '../../src/data-fetch/UniProtKB';
import uniProtKbMock from '../mocks/uniprot.mock';

describe('UniProtKB', function () {
  beforeEach(function () {
    uniProtKbMock();
  })

  describe('#getProteinsByPosition()', function () {
    it('should retrieve different entries for a given position', function () {
      return UniProtKbFetch.getProteinsByPosition('6', 26104031).then(d => {
        var response = d.data;
        expect(response.length).to.equal(5);
      });
    });
  });
});
