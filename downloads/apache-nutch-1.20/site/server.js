const SolrNode = require('solr-node');
const express = require('express');
const path = require('path');
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
    if (!userQuery) {
        return res.status(400).send('Search query is required');
    }
    const formattedQuery = `"${userQuery}"`;
    const solrQuery = client.query()
                        .q({content:formattedQuery})
                        .rows(10000);
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