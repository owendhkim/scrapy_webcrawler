const SolrNode = require('solr-node');
const express = require('express');
const path = require('path');
const { title } = require('process');
const app = express();
const port = 5000;

var client = new SolrNode({
    host: '127.0.0.1',
    port: '8983',
    core: 'nutch',
    protocol: 'http'
});

require('log4js').getLogger('solr-node').level = 'DEBUG';

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search-bar-page.html'));
});

app.get('/search', (req, res) => {
    const userQuery = req.query.q; // Get the user query from the URL parameter
    const page = req.query.page ? parseInt(req.query.page) : 1; // Get the page number from the URL parameter
    const resultsPerPage = 10;
    const start = (page - 1) * resultsPerPage;

    if (!userQuery) {
        return res.status(400).send('Search query is required');
    }
    const formattedQuery = `"${userQuery}"`;
    var params = [
        { field: 'defType', value: 'edismax' },
        { field: 'q.op', value: 'AND' },
        { field: 'q', value: userQuery },
        { field: 'qf', value: 'content title^2' }
      ];
    const solrQuery = client.query()
                        .start(start)
                        .rows(resultsPerPage)
                        .addParams(params);
    client.search(solrQuery, (err, result) => {
        if (err) {
            console.error('Solr error:', err);
            res.status(500).send(err);
        } else {
            res.json(result.response); // Send back the response from Solr
        }
    });
});

app.listen(process.env.port || 5000, () => console.log('Example app listening on port 5000!'));