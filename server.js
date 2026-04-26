const http = require('http');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');

const server = http.createServer((req, res) => {

    const readData = () => {
        return fs.readFileSync(dataPath, 'utf-8');
    };

    const writeData = (data) => {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    };

    if (req.url === '/api/movies' && req.method === 'GET') {
        const movies = readData();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(movies);
    }

    else if (req.url.startsWith('/api/movies/') && req.method === 'GET') {
        const id = parseInt(req.url.split('/')[3]);

        const movies = JSON.parse(readData());
        const movie = movies.find(m => m.id === id);

        if (!movie) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: "Movie not found" }));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(movie));
    }

    else if (req.url === '/api/movies' && req.method === 'POST') {
        let body = '';
        req.setEncoding('utf-8');

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const newMovie = JSON.parse(body);
                const movies = JSON.parse(readData());

                newMovie.id = movies.length ? movies[movies.length - 1].id + 1 : 1;

                movies.push(newMovie);
                writeData(movies);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newMovie));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Invalid JSON format" }));
            }
        });
    }

    else if (req.url.startsWith('/api/movies/') && req.method === 'PUT') {
        const id = parseInt(req.url.split('/')[3]);

        let body = '';
        req.setEncoding('utf-8');

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const updatedMovie = JSON.parse(body);
                const movies = JSON.parse(readData());

                const index = movies.findIndex(m => m.id === id);

                if (index === -1) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: "Movie not found" }));
                }

                movies[index] = { id, ...updatedMovie };
                writeData(movies);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(movies[index]));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Invalid JSON format" }));
            }
        });
    }

    else if (req.url.startsWith('/api/movies/') && req.method === 'DELETE') {
        const id = parseInt(req.url.split('/')[3]);

        const movies = JSON.parse(readData());
        const filtered = movies.filter(m => m.id !== id);

        if (movies.length === filtered.length) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: "Movie not found" }));
        }

        writeData(filtered);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Movie deleted successfully" }));
    }

    else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Movie API running" }));
    }
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});