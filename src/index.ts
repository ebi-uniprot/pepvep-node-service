
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import axios from 'axios';

import UniProtKB from './data-fetch/UniProtKB';
import VEP from './data-fetch/VEP';
import Protein from './lib/biolib/src/protein/protein';

const app = express();
const port = 3687;

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Is Alive?
app.get('/is-alive', (req, res) => res.send('Node service is alive.'));

// Protein API
app.get('/protein/:accessions', (req, res) => {
  const accessions: string[] = req.params.accessions.split(',');
  UniProtKB.impactSearchByProteinAccessions(accessions, results => res.send(results));
});

app.post('/parser', (req, res) => {
  // const {chrom, position, strand, ref, allele} = req.body;
  // const species: string = 'human';
  // const region: string = `${chrom}:${position.start}-${position.end}:${strand}`;
  // const vcf: string = `${chrom}\t${position.start}\t.\t${ref || '.'}\t${allele}\t.\t.\t.`;
// console.log("VCF:", vcf);
  // VEP.variantConsequences(species, region, allele, results => res.send(results.data));
console.log("vcf:", req.body.input);
  const species: string = 'homo_sapiens';
  // const variants: string[] = [
  //    vcf
  // ];
  // const variants: string[] = [
  //   `1 182712 . A C . . .`,
  //   `3 319780 . GA G . . .`,
  //   `19 110747 . G GT . . .`,
  //   `1 160283 sv1 . <DUP> . . SVTYPE=DUP;END=471362 .`,
  //   `1 1385015 sv2 . <DEL> . . SVTYPE=DEL;END=1387562 .`
  // ];
  const variants: string[] = req.body.input;

  VEP.variantConsequencesBatch(species, variants, results => res.send(results.data));
});

// Example of biolib usage
app.get('/biolib', (req, res) => {
  const ABPP: Protein = new Protein('P05067');
  res.send(ABPP.accession);
});

app.listen(port, () => console.log(`server listening on http://localhost:${port}/`));
