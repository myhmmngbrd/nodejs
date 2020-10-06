const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const Router = require('./lib/router.js');

const sourcedir = path.join(__dirname, 'public');

router = Router()

router.get('/', async (req, res) => {
    const data = await fs.readFile(path.join(sourcedir, 'index.html'));
    res.writeHead(200);
    res.end(data);
})

router.post('/', async (req, res) => {
    req.on('data', async (data) => {
        try {
            data = JSON.parse(data);
            console.log(data);
            const readdir = path.join(sourcedir, data.dir ? data.dir : '/');
            const files = await fs.readdir(readdir);
            const responseData = {
                root: data.dir ? data.dir : '/',
                files: []
            }
            for (i in files) {
                const name = files[i];
                const stat = await fs.lstat(path.join(readdir, name));
                const isfile = await stat.isFile();
                console.log('\t', name, isfile);
                responseData.files.push({ name, isfile });
            }
            res.writeHead(200);
            res.end(JSON.stringify(responseData));
        } catch (err) {
            console.error(err);
        }
    });
})


const server = http.createServer(router)

server.listen(3000, () => {
    console.log('server is running...');
})




