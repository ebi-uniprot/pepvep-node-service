import response from './proteinsByPositionResponse';

import nock = require('nock');

const uniprotMock = () => {
    nock('https://www.ebi.ac.uk')
        .get(`/proteins/api/coordinates/9606/6:26104031-26104031?format=json&in_range=false`)
        .reply(200, response);

    nock('https://www.ebi.ac.uk')
        .get(`/proteins/api/coordinates/9606/6:11112-11112?format=json&in_range=false`)
        .reply(200, []);

    nock('https://www.ebi.ac.uk')
        .get(`/proteins/api/coordinates/9606/66:aaaa-aaaa?format=json&in_range=false`)
        .reply(400, []);

}

export default uniprotMock;