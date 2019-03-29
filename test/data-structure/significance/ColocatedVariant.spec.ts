import 'mocha';
import { expect } from 'chai';
import ColocatedVariant from '../../../src/data-structure/significance/ColocatedVariant';

describe('ColocatedVariant', () => {
  describe('constructor()', () => {
    it('should create an instance and set the "id" correctly', () => {
      const id = 'id';
      const output = new ColocatedVariant(id);

      expect(output.id).to.eql(id);
    });
  });

  describe('addPubMedID()/pubMedIDs', () => {
    it('should get/set PubMed IDs correctly', () => {
      const id = 'id';
      const pubMedIds = ['one', 'two', 'three'];
      const output = new ColocatedVariant(id);
      pubMedIds.forEach(i => output.addPubMedID(i));

      expect(output.pubMedIDs).to.eql(pubMedIds);
    });
  });
});
