import 'mocha';
import { expect } from 'chai';
import Significance from '../../src/data-process/Significance';
import uniProtKbMock from '../mocks/uniprot.mock';

describe('Significance', function () {
  beforeEach(function () {
    uniProtKbMock();
  })

  describe('#getPositionalSignificance()', function () {
    it('should get features which overlap with position', function () {
      return Significance.getPositionalSignificance('6', 26104031).then(d => {
        expect(d[0].geneCoordinates[0].feature[0].description).to.equal('TAF.');
      });
    });

    it('should get nothing', function () {
      return Significance.getPositionalSignificance('6', 11112).then(d => {
        expect(d.length).to.equal(0);
      });
    });

    it('should return 400', function () {
      // return Significance.default.getPositionalSignificance('66', 'aaaa').then(d => {
      //   expect(d.length).to.equal(0);
      // });
    });
  })
});