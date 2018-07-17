import 'mocha';
import { expect } from 'chai';
import UniProtKbFetch from '../../src/data-fetch/UniProtKB';
import uniProtKbMock from '../mocks/uniprot.mock';

let accession: string;

describe('UniProtKB', () => {
  beforeEach(() => {
    uniProtKbMock();
    accession = 'P05067';
  })

  describe('#proteinDetailsByAccession()', () => {
    it('should retrieve details for a given position', () => {
      return UniProtKbFetch.proteinsDetailByAccession([accession])
        .then(({ data }) => {
          expect(data).not.to.be.undefined;
          expect(data).not.to.be.null;
          expect(data).not.to.be.empty;
          expect(data).not.to.be.a('function');
        });
    });
  });

  describe('#getProteinsByPosition()', () => {
    it('should retrieve different entries for a given position', () => {
      return UniProtKbFetch.getProteinsByPosition('6', 26104031).then(d => {
        var response = d.data;
        expect(response.length).to.equal(5);
      });
    });
  });
});
