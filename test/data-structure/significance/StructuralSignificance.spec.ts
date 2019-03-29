import 'mocha';
import { expect } from 'chai';
import StructuralSignificance from '../../../src/data-structure/significance/StructuralSignificance';

describe('StructuralSignificance', () => {
  describe('constructor()', () => {
    it('should correctly create an instance', () => {
      const id = '1';
      const method = 'm';
      const range = [1,2];
      const output = new StructuralSignificance(id, method, range);

      expect(output.id).to.eql(id);
      expect(output.method).to.eql(method);
      expect(output.range).to.eql(range);
    });
  });

  describe('toJSON()', () => {
    it('should output correct JSON', () => {
      const id = '1';
      const method = 'm';
      const range = [1,2];
      const output = new StructuralSignificance(id, method, range);

      expect(output.toJSON()).to.deep.equal({
        id,
        method,
        range,
      });
    });
  });
});