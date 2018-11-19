import 'mocha';
import {
  expect
} from 'chai';
import Helpers from '../../src/data-fetch/Helpers';

describe('Helpers', () => {
  describe('#stringOrArrayToCommaSeparated', () => {
    it('should return one element when string is passed', () => {
      const input: string = "one";
      const output: string = Helpers.stringOrArrayToCommaSeparated(input);
      const expectedValue: string = "one";

      expect(output)
        .to.equal(expectedValue); 
    });

    it('should return all elements when array is passed', () => {
      const input: string[] = ["one", "two", "three"];
      const output: string = Helpers.stringOrArrayToCommaSeparated(input);
      const expectedValue: string = "one,two,three";

      expect(output)
        .to.equal(expectedValue);
    });
  });

  describe('#parseProteinChangeInput', () => {
    it('should parse single line input correctly', () => {
      const input = "P05067 F234G";
      const parsedInput = Helpers.parseProteinChangeInput(input);
      expect(parsedInput).to.deep.equal([{
        accession: 'P05067',
        WT: 'F',
        position: '234',
        variant: 'G'
      }]);
    });

    it('should parse multiline input correctly', () => {
      const input = "P05067 F234G\nP1234 H23L";
      const parsedInput = Helpers.parseProteinChangeInput(input);
      expect(parsedInput).to.deep.equal([{
          accession: 'P05067',
          WT: 'F',
          position: '234',
          variant: 'G'
        },
        {
          accession: 'P1234',
          WT: 'H',
          position: '23',
          variant: 'L'
        }
      ]);
    });

    it('should throw an error', () => {
      const input = "P05067 F234";
      expect(() => Helpers.parseProteinChangeInput(input)).to.throw('No matches found');
    });
  });
});