import 'mocha';
import { expect } from 'chai';
import PositionalSignificance from '../../../src/data-structure/significance/PositionalSignificance';
import Feature from '../../../src/data-structure/significance/Feature';

describe('PositionalSignificance', () => {
  describe('constructor()', () => {
    it('should always create an empty array for features', () => {
      const output = new PositionalSignificance();
      expect(output.getFeatures()).to.be.an('array');
    });
  });

  describe('addFeature()/getFeatures()', () => {
    it('should be able to add multiple features', () => {
      const features = [
        new Feature('A', 'B', 'C', 'D', 1, 2, []),
        new Feature('a', 'b', 'c', 'd', 1, 2, []),
      ];
      const output = new PositionalSignificance();
      features.forEach(f => output.addFeature(f));

      expect(output.getFeatures()).to.deep.equal(features);
    });
  });
});
