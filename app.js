const http = require('http');
const router = require('./lib/server');
const fs = require('fs');
const fspromise = fs.promises;
const path = require('path');

const app = router();

app.get('/video', async (req, res) => {
    const url = decodeURI(req.url).replace(/\/video/, '');
    const src = path.join(__dirname, 'private', url);
/*
    console.log(`\x1b[36mvideo source:\x1b[0m %s`, src);
    const stat = await fspromise.stat(src);
    const filesize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : filesize-1;
        const chunksize = (end-start) + 1;
        const file = fs.createReadStream(src, { start, end });
        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${filesize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        });
        file.pipe(res);
    } else {
        res.writeHead(200, {
            'Content-Length': filesize,
            'Content-Type': 'video/mp4',
        });
        fs.createReadStream(src).pipe(res);
    }
*/

    const paths = path.join(__dirname, 'private', req.url.replace(/\/video/, ''));
    const stat = await fspromise.stat(paths);
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");

        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
        
        const chunksize = (end-start)+1;
        const file = fs.createReadStream(paths, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }
        
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }

        res.writeHead(200, head);
        fs.createReadStream(paths).pipe(res);
    }


});

app.get('/', async (req, res) => {
    const data = await fspromise.readFile(path.join(__dirname, 'index.html'));
    res.writeHead(200);
    res.end(data);
    
});


const server = http.createServer(app);



server.listen(3000);