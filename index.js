
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3687;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Is Alive?
app.get('/is-alive', (req, res) => res.send('yes!'));

app.listen(port, () => console.log(`server listening on http://localhost:${port}/`));
