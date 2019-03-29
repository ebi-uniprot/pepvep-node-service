import 'mocha';
import { expect } from 'chai';
import Protein from '../../src/data-structure/Protein';
import Variation from '../../src/data-structure/Variation';

describe('Protein', () => {
  describe('constructor()', () => {
    it('should create an instance and set the "accession" correctly', () => {
      const accession = 'accession';
      const output = new Protein(accession);

      expect(output.accession).to.eql(accession);
    });
  });

  describe('ensp', () => {
    it('should get/set values correctly', () => {
      const accession = 'accession';
      const ensp = 'ensp';
      const output = new Protein(accession);
      output.ensp = ensp;

      expect(output.ensp).to.eql(ensp);
    });
  });

  describe('enst', () => {
    it('should get/set values correctly', () => {
      const accession = 'accession';
      const enst = 'enst';
      const output = new Protein(accession);
      output.enst = enst;

      expect(output.enst).to.eql(enst);
    });
  });

  describe('taxonomy', () => {
    it('should get/set values correctly', () => {
      const accession = 'accession';
      const taxonomy = 1;
      const output = new Protein(accession);
      output.taxonomy = taxonomy;

      expect(output.taxonomy).to.eql(taxonomy);
    });
  });

  describe('name', () => {
    it('should get/set values correctly', () => {
      const accession = 'accession';
      const name = {
        full: 'full name',
      };
      const output = new Protein(accession);
      output.name = name;

      expect(output.name).to.deep.equal(name);
    });
  });

  describe('length', () => {
    it('should get/set values correctly', () => {
      const accession = 'accession';
      const length = 1;
      const output = new Protein(accession);
      output.length = length;

      expect(output.length).to.eql(length);
    });
  });

  describe('swissprotAccessions', () => {
    it('should get/set values correctly', () => {
      const accession = 'accession';
      const swissprotAccessions = ['A', 'B'];
      const output = new Protein(accession);
      output.swissprotAccessions = swissprotAccessions;

      expect(output.swissprotAccessions).to.eql(swissprotAccessions);
    });
  });

  describe('tremblAccessions', () => {
    it('should get/set values correctly', () => {
      const accession = 'accession';
      const tremblAccessions = ['A', 'B'];
      const output = new Protein(accession);
      output.tremblAccessions = tremblAccessions;

      expect(output.tremblAccessions).to.eql(tremblAccessions);
    });
  });

  describe('uniparcAccessions', () => {
    it('should get/set values correctly', () => {
      const accession = 'accession';
      const uniparcAccessions = ['A', 'B'];
      const output = new Protein(accession);
      output.uniparcAccessions = uniparcAccessions;

      expect(output.uniparcAccessions).to.eql(uniparcAccessions);
    });
  });

  describe('addVariation()/getVariations()', () => {
    it('should get/set values correctly', () => {
      const accession = 'accession';
      const variations = [
        new Variation('A'),
        new Variation('B'),
        new Variation('C'),
      ];
      const output = new Protein(accession);
      variations.forEach(v => output.addVariation(v));

      expect(output.getVariations()).to.eql(variations);
    });
  });

  describe('getVariationsInRange()', () => {
    it('should only return the variations which are in range', () => {
      const accession = 'accession';
      
      const variantionA = new Variation('A');
      variantionA.proteinStart = 1;
      variantionA.proteinEnd = 10;

      const variantionB = new Variation('B');
      variantionB.proteinStart = 5;
      variantionB.proteinEnd = 15;

      const variantionC = new Variation('C');
      variantionC.proteinStart = 20;
      variantionC.proteinEnd = 25;

      const variations = [
        variantionA,
        variantionB,
        variantionC,
      ];

      const output = new Protein(accession);
      variations.forEach(v => output.addVariation(v));

      expect(output.getVariationsInRange(0, 10)).to.eql([
        variantionA,
        variantionB,
      ]);
    });
  });

  describe('hasVariationWithProteinPosition()', () => {
    it('should return TRUE when at least one variation has protein position', () => {
      const accession = 'accession';
      
      const variantionA = new Variation('A');

      const variantionB = new Variation('B');
      variantionB.proteinStart = 5;
      variantionB.proteinEnd = 15;

      const variations = [
        variantionA,
        variantionB,
      ];

      const output = new Protein(accession);
      variations.forEach(v => output.addVariation(v));

      expect(output.hasVariationWithProteinPosition()).to.be.true;
    });

    it('should return FALSE when no variation has protein position', () => {
      const accession = 'accession';
      
      const variantionA = new Variation('A');
      const variantionB = new Variation('B');

      const variations = [
        variantionA,
        variantionB,
      ];

      const output = new Protein(accession);
      variations.forEach(v => output.addVariation(v));

      expect(output.hasVariationWithProteinPosition()).to.be.false;
    });
  });
});
