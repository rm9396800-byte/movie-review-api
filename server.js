const http = require('http');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');

const server = http.createServer((req, res) => {

    
    if (req.url === '/api/movies' && req.method === 'GET') {

        fs.readFile(dataPath, 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: "Error reading file" }));
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });

    }

   
    else if (req.url.startsWith('/api/movies/') && req.method === 'GET') {

        const id = parseInt(req.url.split('/')[3]);

        fs.readFile(dataPath, 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: "Error reading file" }));
            }

            const movies = JSON.parse(data);
            const movie = movies.find(m => m.id === id);

            if (!movie) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: "Movie not found" }));
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(movie));
        });

    }

    else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Server is online and ready for requests" }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});