
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import axios from 'axios';

import UniProtKB from './data-fetch/UniProtKB';
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
  const accessions = req.params.accessions.split(',');
  UniProtKB.impactSearchByProteinAccessions(accessions, results => res.send(results));
});


// Example of biolib usage
app.get('/biolib', (req, res) => {
  const ABPP: Protein = new Protein('P05067');
  res.send(ABPP.accession);
});

app.listen(port, () => console.log(`server listening on http://localhost:${port}/`));
