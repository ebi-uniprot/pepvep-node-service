import 'mocha';
import { expect } from 'chai';
import Feature from '../../../src/data-structure/significance/Feature';
import Evidence from '../../../src/data-structure/significance/Evidence';

describe('Feature', () => {
  describe('constructor()', () => {
    it('should create an instace and set all of the values correctly', () => {
      const type = 'type';
      const typeDescription = 'typeDescription';
      const category = 'category';
      const description = 'description';
      const begin = 1;
      const end = 2;
      const evidences = [
        new Evidence('A', 'B', 'C', 'D', 'E'),
        new Evidence('a', 'b', 'c', 'd', 'e'),
      ];

      const output = new Feature(
        type,
        typeDescription,
        category,
        description,
        begin,
        end,
        evidences,
      );

      expect(output.type).to.eql(type);
      expect(output.typeDescription).to.eql(typeDescription);
      expect(output.category).to.eql(category);
      expect(output.begin).to.eql(begin);
      expect(output.end).to.eql(end);
      expect(output.evidences).to.eql(evidences);
    });
  });
});
