
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const axios = require('axios');

const app = express();
const port = 3687;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Is Alive?
app.get('/is-alive', (req, res) => res.send('yes!'));

// Example
app.get('/example', (req, res) => {
  const url = 'https://www.ebi.ac.uk/proteins/api/coordinates/9606/1:121593709-121594999?offset=0&size=100&format=json';
  
  axios.get(url)
    .then(response => res.send(response.data));
});

app.listen(port, () => console.log(`server listening on http://localhost:${port}/`));
