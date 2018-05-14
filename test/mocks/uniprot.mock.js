var nock = require('nock');
var response = require('./proteinsByPositionResponse');

var uniprotMock = () => {
    nock('https://www.ebi.ac.uk')
    .get(`/proteins/api/coordinates/9606/1:27873210-27873210&format=json&in_range=false`)
    .reply(200, response);
}

module.exports = uniprotMock;