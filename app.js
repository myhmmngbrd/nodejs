const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const server = http.createServer(async (req, res) => {
    try {    
        const rootdir = __dirname;
        const sourcedir = path.join(rootdir, 'public');
        const sourcefiles = await fs.readdir(sourcedir);

        for (const file in sourcefiles) {
            const stat = fs.stat(file)
        }

    } catch (error) {
        console.error(error)
    }
})

server.listen(3000, () => {
    console.log('server is running...')
})
