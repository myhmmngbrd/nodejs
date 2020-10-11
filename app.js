const { read } = require('fs');
const http = require('http');
const fsnative = require('fs');
const fs = fsnative.promises;
const path = require('path');

const Router = require('./lib/router.js');

const sourcedir = path.join(__dirname, 'public');

const extmap = {
    text: ['txt', 'js', 'py', 'css', 'html', 'c', 'cpp'],
    image: ['jpeg','jpg','gif','webp','png','bmp'],
    video: ['avi','mp4','webm'],
};

router = Router();

router.get('/video', async(req, res) => {
    /*
    console.log(req.headers);
    console.log(req.url);
    const src = req.url.replace(/\/video/, '');
    const ext = path.extname(src);
    const stat = await fs.stat(path.join(__dirname, 'private', src));
    const size = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
        const chunk = (end - start) + 1;
        const file = fsnative.createReadStream(path.join(__dirname, 'private', src), {start, end});
        
        res.writeHead(200, {
            'content-range': `bytes ${start}-${end}/${size}`,
            'accept-ranges': 'bytes',
            'content-length': chunk,
            'content-type': 'video/' + ext,
        });
        file.pipe(res);
    } else {
        res.writeHead(200, {
            'content-length': size,
            'content-type': 'video/' + ext,
        })
        const file = fsnative.createReadStream(path.join(__dirname, 'private', src));
        file.pipe(res);
    }
    */
   const paths = path.join(__dirname, 'private', req.url.replace(/\/video/, ''));
   const stat = await fs.stat(paths);
    const fileSize = stat.size
    const range = req.headers.range
    console.log(range)
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");

        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
        
        const chunksize = (end-start)+1;
        const file = fsnative.createReadStream(paths, {start, end});
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
        fsnative.createReadStream(paths).pipe(res);
    }
})

router.get('/', async (req, res) => {
    const data = await fs.readFile(path.join(sourcedir, 'index.html'));
    res.writeHead(200);
    res.end(data);
});

router.post('/text', async (req, res) => {
    const ext = path.extname(req.url).slice(1);
    const src = req.url.replace(/\/file/, '');
    const data = await fs.readFile(path.join(__dirname, 'private', src));
    res.end(data);
});

router.post('/', async (req, res) => {
    const filelist = await readAllDir(path.join(__dirname, 'private'));
    res.writeHead(200);
    res.end(JSON.stringify(filelist));
});

async function readAllDir(dir) {
    const filelist = []
    const files = await fs.readdir(dir);
    for (i in files) {
        const name = files[i];
        const stats = await fs.lstat(path.join(dir, name));
        const isfile = await stats.isFile();
        const childlist = isfile ? null : await readAllDir(path.join(dir, name));
        const ext = isfile ? path.extname(name).slice(1) : null;
        const type = ext ? Object.keys(extmap).find(key => extmap[key].indexOf(ext) != -1) : null;
        const src = dir.slice(path.join(__dirname, 'private').length) + '\\';
        const depth = src.split('\\').length - 2;
        filelist.push({ name, isfile, childlist, ext, type, src, depth, });
    }
    filelist.sort((a, b) => a.isfile - b.isfile);
    return filelist;
}


const server = http.createServer(router)

server.listen(3000, () => {
    console.log('server is running...');
})




