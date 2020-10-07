const { read } = require('fs');
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
    const filelist = await readAllDir(path.join(__dirname, 'public'));
    res.writeHead(200);
    console.log(filelist);
    res.end(JSON.stringify(filelist));
})

async function readAllDir(dir) {
    const filelist = []
    const files = await fs.readdir(dir);
    for (i in files) {
        const name = files[i];
        const stats = await fs.lstat(path.join(dir, name));
        const isfile = await stats.isFile();
        const childlist = isfile ? null : await readAllDir(path.join(dir, name));
        filelist.push({ name, childlist });
    }
    return filelist;
}


const server = http.createServer(router)

server.listen(3000, () => {
    console.log('server is running...');
})




