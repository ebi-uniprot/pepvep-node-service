import proteinsByPositionResponse from './proteinsByPositionResponse';
import proteinsDetailByAccessionResponse from './proteinsDetailByAccessionResponse';

import nock = require('nock');

const uniprotMock = () => {
    nock('https://www.ebi.ac.uk')
        .get(`/proteins/api/coordinates/9606/6:26104031-26104031?format=json&in_range=false`)
        .reply(200, proteinsByPositionResponse);

    nock('https://www.ebi.ac.uk')
        .get(`/proteins/api/coordinates/9606/6:11112-11112?format=json&in_range=false`)
        .reply(200, []);

    nock('https://www.ebi.ac.uk')
        .get(`/proteins/api/coordinates/9606/66:aaaa-aaaa?format=json&in_range=false`)
        .reply(400, []);

    nock('https://www.ebi.ac.uk')
        .get(`/proteins/api/proteins?format=json&accession=P05067`)
        .reply(200, proteinsDetailByAccessionResponse);
}

export default uniprotMock;
