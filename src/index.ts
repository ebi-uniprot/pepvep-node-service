import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import axios from 'axios';
import * as path from 'path';
import to from 'await-to-js';

import Helpers from './data-fetch/Helpers';
import UniProtKB from './data-fetch/UniProtKB';
import VEP from './data-fetch/VEP';

import Search from './data-process/Search';

const app = express();
const port = 3687;

// This is to fix this TSLint issue:
// https://github.com/Microsoft/tslint-microsoft-contrib/issues/39
import { response } from 'express';

response.setContentType = function (type: string) {
  this.set('Content-Type', type);
};

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.static('public'));
// to server front-end files from server
app.use('/uniprot/pepvep', express.static(path.join(__dirname, '/../../www')));
// to server front-end files from server
app.use(express.static(path.join(__dirname, '/../../www')));
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());

// Is Alive?
app.get('/is-alive', (req, res) => res.send('Node service is alive.'));

// Data process
const process = async (input: string, download: boolean = false) => {
  const organism: string = 'homo_sapiens';

  const search = new Search();
  const results = await to(search.vepInputSearch(organism, input, download));

  return Promise.resolve(results);
};

// Default VEP Input
app.post('/parser', async (req, res) => {
  const input: string = req.body.input;
  const downloadResults: boolean = false;

  const [error, results] = await process(input, downloadResults);

  if (error && JSON.stringify(error) !== '{}') {
    res.status(500).send({ error });
  }

  res.send(results);
});

// Download
app.post('/download', async (req, res) => {
  const input: string = req.body.input;
  const downloadResults: boolean = true;

  res.setHeader('Content-disposition', 'attachment; filename=pepvep-data.csv');
  res.setContentType('text/csv');

  const [error, results] = await process(input, downloadResults);

  if (error) {
    res.status(500).send('Back-end failed.');
  }

  res.send(results);
});

// To serve front-end from 'www' folder
app.get('*', (req, res) => res.sendFile(path.join(`${__dirname}/../../www/index.html`)));

app.listen(port, () => console.log(`server listening on http://localhost:${port}/`));
