import 'mocha';
import { expect } from 'chai';
import Gene from '../../src/data-structure/Gene';
import Protein from '../../src/data-structure/Protein';

describe('Gene', () => {
  describe('constructor()', () => {
    it('should create an instace and set all of the values correctly', () => {
      const ensg = 'ensg';
      const chromosome = 'chromosome';
      const output = new Gene(ensg, chromosome);

      expect(output.ensg).to.eql(ensg);
      expect(output.chromosome).to.eql(chromosome);
    });
  });

  describe('symbol', () => {
    it('should get/set values correctly', () => {
      const ensg = 'ensg';
      const chromosome = 'chromosome';
      const symbol = 'symbol';

      const output = new Gene(ensg, chromosome);
      output.symbol = symbol;

      expect(output.symbol).to.eql(symbol);
    });
  });

  describe('symbolSource', () => {
    it('should get/set values correctly', () => {
      const ensg = 'ensg';
      const chromosome = 'chromosome';
      const symbolSource = 'symbolSource';

      const output = new Gene(ensg, chromosome);
      output.symbolSource = symbolSource;

      expect(output.symbolSource).to.eql(symbolSource);
    });
  });

  describe('assemblyName', () => {
    it('should get/set values correctly', () => {
      const ensg = 'ensg';
      const chromosome = 'chromosome';
      const assemblyName = 'assemblyName';

      const output = new Gene(ensg, chromosome);
      output.assemblyName = assemblyName;

      expect(output.assemblyName).to.eql(assemblyName);
    });
  });

  describe('strand', () => {
    it('should get/set values correctly', () => {
      const ensg = 'ensg';
      const chromosome = 'chromosome';
      const strand = 1;

      const output = new Gene(ensg, chromosome);
      output.strand = strand;

      expect(output.strand).to.eql(strand);
    });
  });

  describe('hgncId', () => {
    it('should get/set values correctly', () => {
      const ensg = 'ensg';
      const chromosome = 'chromosome';
      const hgncId = 'hgncId';

      const output = new Gene(ensg, chromosome);
      output.hgncId = hgncId;

      expect(output.hgncId).to.eql(hgncId);
    });
  });

  describe('addProtein()/getProteins()', () => {
    it('should get/set values correctly', () => {
      const ensg = 'ensg';
      const chromosome = 'chromosome';
      const proteins = [
        new Protein('A'),
        new Protein('B'),
        new Protein('C'),
      ];

      const output = new Gene(ensg, chromosome);
      proteins.forEach(p => output.addProtein(p));

      expect(output.getProteins()).to.eql(proteins);
    });

    it('should ignore duplicated proteins', () => {
      const ensg = 'ensg';
      const chromosome = 'chromosome';
      const originals = [
        new Protein('A'),
        new Protein('B'),
      ];
      const duplicates = [
        new Protein('A'),
        new Protein('B'),
      ];

      const output = new Gene(ensg, chromosome);
      originals.forEach(p => output.addProtein(p));
      duplicates.forEach(p => output.addProtein(p));

      expect(output.getProteins()).to.eql(originals);
    });
  });

});
