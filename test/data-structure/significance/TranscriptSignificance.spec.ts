import 'mocha';
import { expect } from 'chai';
import TranscriptSignificance from '../../../src/data-structure/significance/TranscriptSignificance';

describe('TranscriptSignificance', () => {
  describe('constructor()', () => {
    it('should create an instance without any aurguments', () => {
      const output = new TranscriptSignificance();
    });
  });

  describe('biotype', () => {
    it('should get/set values correctly', () => {
      const biotype = 'biotype';
      const output = new TranscriptSignificance();
      output.biotype = biotype;

      expect(output.biotype).to.eql(biotype);
    });
  });

  describe('impact', () => {
    it('should get/set values correctly', () => {
      const impact = 'impact';
      const output = new TranscriptSignificance();
      output.impact = impact;

      expect(output.impact).to.eql(impact);
    });
  });

  describe('polyphenPrediction', () => {
    it('should get/set values correctly', () => {
      const polyphenPrediction = 'polyphenPrediction';
      const output = new TranscriptSignificance();
      output.polyphenPrediction = polyphenPrediction;

      expect(output.polyphenPrediction).to.eql(polyphenPrediction);
    });
  });

  describe('polyphenScore', () => {
    it('should get/set values correctly', () => {
      const polyphenScore = 1;
      const output = new TranscriptSignificance();
      output.polyphenScore = polyphenScore;

      expect(output.polyphenScore).to.eql(polyphenScore);
    });
  });

  describe('siftPrediction', () => {
    it('should get/set values correctly', () => {
      const siftPrediction = 'siftPrediction';
      const output = new TranscriptSignificance();
      output.siftPrediction = siftPrediction;

      expect(output.siftPrediction).to.eql(siftPrediction);
    });
  });

  describe('siftScore', () => {
    it('should get/set values correctly', () => {
      const siftScore = 1;
      const output = new TranscriptSignificance();
      output.siftScore = siftScore;

      expect(output.siftScore).to.eql(siftScore);
    });
  });

  describe('mostSevereConsequence', () => {
    it('should get/set values correctly', () => {
      const mostSevereConsequence = 'mostSevereConsequence';
      const output = new TranscriptSignificance();
      output.mostSevereConsequence = mostSevereConsequence;

      expect(output.mostSevereConsequence).to.eql(mostSevereConsequence);
    });
  });

  describe('addConsequenceTerm()/consequenceTerms', () => {
    it('should get/set values correctly', () => {
      const consequenceTerms = ['A', 'B'];
      const output = new TranscriptSignificance();

      consequenceTerms.forEach(t => output.addConsequenceTerm(t));

      expect(output.consequenceTerms).to.eql(consequenceTerms);
    });
  });

  describe('mutationTasterPrediction', () => {
    it('should get/set values correctly', () => {
      const mutationTasterPrediction = 'mutationTasterPrediction';
      const output = new TranscriptSignificance();
      output.mutationTasterPrediction = mutationTasterPrediction;

      expect(output.mutationTasterPrediction).to.eql(mutationTasterPrediction);
    });
  });

  describe('mutationTasterScore', () => {
    it('should get/set values correctly', () => {
      const mutationTasterScore = 'mutationTasterScore';
      const output = new TranscriptSignificance();
      output.mutationTasterScore = mutationTasterScore;

      expect(output.mutationTasterScore).to.eql(mutationTasterScore);
    });
  });

  describe('lrtPrediction', () => {
    it('should get/set values correctly', () => {
      const lrtPrediction = 'lrtPrediction';
      const output = new TranscriptSignificance();
      output.lrtPrediction = lrtPrediction;

      expect(output.lrtPrediction).to.eql(lrtPrediction);
    });
  });

  describe('lrtScore', () => {
    it('should get/set values correctly', () => {
      const lrtScore = 1;
      const output = new TranscriptSignificance();
      output.lrtScore = lrtScore;

      expect(output.lrtScore).to.eql(lrtScore);
    });
  });

  describe('fathmmPrediction', () => {
    it('should get/set values correctly', () => {
      const fathmmPrediction = 'fathmmPrediction';
      const output = new TranscriptSignificance();
      output.fathmmPrediction = fathmmPrediction;

      expect(output.fathmmPrediction).to.eql(fathmmPrediction);
    });
  });

  describe('fathmmScore', () => {
    it('should get/set values correctly', () => {
      const fathmmScore = 'fathmmScore';
      const output = new TranscriptSignificance();
      output.fathmmScore = fathmmScore;

      expect(output.fathmmScore).to.eql(fathmmScore);
    });
  });

  describe('proveanPrediction', () => {
    it('should get/set values correctly', () => {
      const proveanPrediction = 'proveanPrediction';
      const output = new TranscriptSignificance();
      output.proveanPrediction = proveanPrediction;

      expect(output.proveanPrediction).to.eql(proveanPrediction);
    });
  });

  describe('proveanScore', () => {
    it('should get/set values correctly', () => {
      const proveanScore = 1;
      const output = new TranscriptSignificance();
      output.proveanScore = proveanScore;

      expect(output.proveanScore).to.eql(proveanScore);
    });
  });

  describe('caddPhred', () => {
    it('should get/set values correctly', () => {
      const caddPhred = 1;
      const output = new TranscriptSignificance();
      output.caddPhred = caddPhred;

      expect(output.caddPhred).to.eql(caddPhred);
    });
  });

  describe('caddRaw', () => {
    it('should get/set values correctly', () => {
      const caddRaw = 1;
      const output = new TranscriptSignificance();
      output.caddRaw = caddRaw;

      expect(output.caddRaw).to.eql(caddRaw);
    });
  });

  describe('appris', () => {
    it('should get/set values correctly', () => {
      const appris = 'appris';
      const output = new TranscriptSignificance();
      output.appris = appris;

      expect(output.appris).to.eql(appris);
    });
  });

  describe('mutPredScore', () => {
    it('should get/set values correctly', () => {
      const mutPredScore = 1;
      const output = new TranscriptSignificance();
      output.mutPredScore = mutPredScore;

      expect(output.mutPredScore).to.eql(mutPredScore);
    });
  });

  describe('blosum62', () => {
    it('should get/set values correctly', () => {
      const blosum62 = 1;
      const output = new TranscriptSignificance();
      output.blosum62 = blosum62;

      expect(output.blosum62).to.eql(blosum62);
    });
  });

  describe('tsl', () => {
    it('should get/set values correctly', () => {
      const tsl = 1;
      const output = new TranscriptSignificance();
      output.tsl = tsl;

      expect(output.tsl).to.eql(tsl);
    });
  });

  describe('toJSON()', () => {
    it('should output correct JSON', () => {
      const input = {
        biotype: 'biotype',
        impact: 'impact',
        polyphenPrediction: 'polyphenPrediction',
        polyphenScore: 1,
        siftPrediction: 'siftPrediction',
        siftScore: 1,
        mostSevereConsequence: 'mostSevereConsequence',
        consequenceTerms: ['A', 'B', 'C'],
        mutationTasterPrediction: 'mutationTasterPrediction',
        mutationTasterScore: 'mutationTasterScore',
        lrtPrediction: 'lrtPrediction',
        lrtScore: 1,
        fathmmPrediction: 'fathmmPrediction',
        fathmmScore: 'fathmmScore',
        proveanPrediction: 'proveanPrediction',
        proveanScore: 1,
        caddPhred: 1,
        caddRaw: 1,
        appris: 'appris',
        mutPredScore: 1,
        blosum62: 1,
        tsl: 1,
      }

      const output = new TranscriptSignificance();
      output.biotype = input.biotype;
      output.impact = input.impact;
      output.polyphenPrediction = input.polyphenPrediction;
      output.polyphenScore = input.polyphenScore;
      output.siftPrediction = input.siftPrediction;
      output.siftScore = input.siftScore;
      output.mostSevereConsequence = input.mostSevereConsequence;
      input.consequenceTerms.forEach(t => output.addConsequenceTerm(t));
      output.mutationTasterPrediction = input.mutationTasterPrediction;
      output.mutationTasterScore = input.mutationTasterScore;
      output.lrtPrediction = input.lrtPrediction;
      output.lrtScore = input.lrtScore;
      output.fathmmPrediction = input.fathmmPrediction;
      output.fathmmScore = input.fathmmScore;
      output.proveanPrediction = input.proveanPrediction;
      output.proveanScore = input.proveanScore;
      output.caddPhred = input.caddPhred;
      output.caddRaw = input.caddRaw;
      output.appris = input.appris;
      output.mutPredScore = input.mutPredScore;
      output.blosum62 = input.blosum62;
      output.tsl = input.tsl;

      expect(output.toJSON()).to.deep.equal(input);
    });
  });
});
