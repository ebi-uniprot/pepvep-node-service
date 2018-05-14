var nock = require('nock');
var response = require('./proteinsByPositionResponse');

var uniprotMock = () => {
    nock('https://www.ebi.ac.uk')
    .get(`/proteins/api/coordinates/9606/6:26104031-26104031?format=json&in_range=false`)
    .reply(200, response);

    nock('https://www.ebi.ac.uk')
    .get(`/proteins/api/coordinates/9606/6:11112-11112?format=json&in_range=false`)
    .reply(200, []);
}

module.exports = uniprotMock;