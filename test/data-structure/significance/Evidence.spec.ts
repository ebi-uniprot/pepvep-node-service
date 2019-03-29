import 'mocha';
import { expect } from 'chai';
import Evidence from '../../../src/data-structure/significance/Evidence';

describe('Evidence', () => {
  describe('constructor()', () => {
    it('should create an instace and set all of the values correctly', () => {
      const code = 'code';
      const sourceName = 'sourceName';
      const sourceId = 'sourceId';
      const sourceUrl = 'sourceUrl';
      const sourceAlternativeUrl = 'sourceAlternativeUrl';

      const output = new Evidence(
        code,
        sourceName,
        sourceId,
        sourceUrl,
        sourceAlternativeUrl
      );

      expect(output.code).to.eql(code);
      expect(output.sourceName).to.eql(sourceName);
      expect(output.sourceId).to.eql(sourceId);
      expect(output.sourceUrl).to.eql(sourceUrl);
      expect(output.sourceAlternativeUrl).to.eql(sourceAlternativeUrl);
    });
  });
});
