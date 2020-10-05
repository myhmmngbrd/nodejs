const { resolveNaptr } = require('dns');
const http = require('http');
const fs = require('fs').promises;
const path = require('path');


function parseURL(url) {
    url = url.split('/');
    while ((index = url.indexOf('')) != -1) {
        url.splice(index, 1)
    }
    source = url.join('/')
    filename = url.reverse()[0]
    return { source, filename }
}

const rootdir = __dirname;
const sourcedir = path.join(rootdir, 'public');

const server = http.createServer(async (req, res) => {
    const { method, url } = req;
    console.log("\x1b[36m%s\x1b[0m", method, url);
    const parsedURL = parseURL(url);
    //console.log(parsedURL);

    try {
        
        if (method ==='GET') {
            if (!parsedURL.source.length) { //홈페이지
                const data = await fs.readFile(path.join(sourcedir, 'index.html'));
                res.writeHead(200);
                res.end(data);
            } else { //public source
                const data = await fs.readFile(path.join(sourcedir, parsedURL.source))
                res.writeHead(200);
                res.end(data);
            }
        } else if (method == 'POST') {
            const sourcefiles = await fs.readdir(sourcedir);
            for (const index in sourcefiles) {
                const filename = sourcefiles[index];
                const stat = await fs.lstat(path.join(sourcedir, filename));
                console.log(`filename: ${filename}, isfile: ${stat.isFile()}`);
            }
        }

        

    } catch (error) {
        console.error(error)
    }

})

server.listen(3000, () => {
    console.log('server is running...');
})
