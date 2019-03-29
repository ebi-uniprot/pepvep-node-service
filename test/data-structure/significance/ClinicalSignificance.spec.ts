import 'mocha';
import { expect } from 'chai';
import ClinicalSignificance from '../../../src/data-structure/significance/ClinicalSignificance';

describe('ClinicalSignificance', () => {
  describe('constructor()', () => {
    it('should parse the raw input and store it within the "value" property', () => {
      const raw = 'Likely pathogenic,Pathogenic,Disease';
      const association = [];
      const output = new ClinicalSignificance(raw, association);

      expect(output.value).to.eql([
        'Likely pathogenic',
        'Pathogenic',
        'Disease',
      ]);
    });

    it('should store the "association" value', () => {
      const raw = '';
      const association = [{ test: 'Okay' }];
      const output = new ClinicalSignificance(raw, association);

      expect(output.association).to.deep.equal(association);
    });
  });

  describe('toJSON()', () => {
    it('should output correct JSON', () => {
      const raw = 'Likely pathogenic,Pathogenic,Disease';
      const association = [{ test: 'Okay' }];
      const output = new ClinicalSignificance(raw, association);

      expect(output.toJSON()).to.deep.equal({
        categories: [
          'Likely pathogenic',
          'Pathogenic',
          'Disease',
        ],
        association,
      })
    });
  });
});
