import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import axios from 'axios';

import Helpers from './data-fetch/Helpers'
import UniProtKB from './data-fetch/UniProtKB';
import VCF from './data-process/VCF';

const app = express();
const port = 3687;

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// Is Alive?
app.get('/is-alive', (req, res) => res.send('Node service is alive.'));

// Protein API
app.get('/protein/:accessions', (req, res) => {
  const accessions: string[] = req.params.accessions.split(',');

  UniProtKB.impactSearchByProteinAccessions(accessions)
    .then(results => res.send(results));
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
  const variants: string[] = req.body.input;

  // VEP.variantConsequencesBatch(species, variants)
  //   .then(results => res.send(results.data));
  VCF.processVCFInput(species, variants)
    .then(results => res.send(results));
});

app.post('/protein-variants', (req, res) => {
  const proteinVariants: string = req.body.input;
  const queryItems = Helpers.parseProteinChangeInput(proteinVariants);
  UniProtKB.proteinsDetailByAccession(queryItems.map(d => d['accession']))
    .then(results => res.send(results));
});

app.listen(port, () => console.log(`server listening on http://localhost:${port}/`));