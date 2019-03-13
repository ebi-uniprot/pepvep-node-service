import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import axios from 'axios';
import * as path from 'path';

import Helpers from './data-fetch/Helpers';
import UniProtKB from './data-fetch/UniProtKB';
import VEP from './data-fetch/VEP';

import Search from './data-process/Search';

const app = express();
const port = 3687;

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Enforce a forward-slash at the end of URL
app.use((req, res, next) => {
// console.log("----> req:", JSON.stringify(req));
// console.log("path:", req.path);
// console.log("last char:", req.path.substr(-1));
//   if (req.path.substr(-1) !== '/') {
//     const query = req.url.slice(req.path.length);
//     const newUri = req.path + '/' + query;
// console.log('new path:', newUri);
//     // res.redirect(301, newUri);
//   } else {
//     next();
//   }

  console.log("req.baseUrl:", req.baseUrl);
  console.log("req.hostname:", req.hostname);
  console.log("req.originalUrl:", req.originalUrl);
  console.log("req.path:", req.path);
  console.log("req.query:", req.query);
  console.log("req.route:", req.route);
  console.log("------------");
  next();
});

app.use(express.static('public'));
app.use('/uniprot/pepvep', express.static(path.join(__dirname, '/../../www')));  // to server front-end files from server
app.use(express.static(path.join(__dirname, '/../../www')));  // to server front-end files from server
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());





// Is Alive?
app.get('/is-alive', (req, res) => res.send('Node service is alive.'));

// Protein API
app.get('/protein/:accessions', (req, res) => {
  const accessions: string[] = req.params.accessions.split(',');

  // UniProtKB.impactSearchByProteinAccessions(accessions)
  //   .then(results => res.send(results));
});

// Data process
const process = (input: string, download: boolean = false) => {
  const organism: string = 'homo_sapiens';

  const search = new Search();
  return search.vepInputSearch(organism, input, download);
}

// Default VEP Input
app.post('/parser', (req, res) => {
  // console.log("input:", req.body.input);
  const input: string = req.body.input;
  const downloadResults: boolean = false;

  process(input, downloadResults)
    .then(results => res.send(results));
});

// Download
app.post('/download', (req, res) => {
  const input: string = req.body.input;
  const downloadResults: boolean = true;

  res.setHeader('Content-disposition', 'attachment; filename=pepvep-data.csv');
  res.set('Content-Type', 'text/csv');

  process(input, downloadResults)
    .then(results => res.send(results));
});

// app.post('/protein-variants', (req, res) => {
//   const proteinVariants: string = req.body.input;
//   const queryItems = Helpers.parseProteinChangeInput(proteinVariants);
//   UniProtKB.proteinsDetailByAccession(queryItems.map(d => d['accession']))
//     .then(results => res.send(results));
// });

// To serve front-end from 'www' folder
app.get('*', (req, res) => res.sendFile(path.join(__dirname + '/../../www/index.html')));

app.listen(port, () => console.log(`server listening on http://localhost:${port}/`));
