'use strict';

const path = require('path');
const fs = require('fs').promises;

const sourcedir = path.join(__dirname, '../', 'public');

function Router() {
    const routers = [];

    const app = async function(req, res) {
        req.url = decodeURI(req.url);
        console.log("\x1b[36m%s\x1b[0m", req.method, req.url)

        try {
                
            const src = path.join(sourcedir, req.url.split('?')[0]);
            const data = await fs.readFile(src);
            res.writeHead(200);
            res.end(data);
            return;
            
        } catch(err) {
            if (err.syscall != 'open' && err.syscall != 'read') {
                res.writeHead(404);
                console.error(err);
                res.end();
            } else {
                try {
                    if (routers.length) {   
                        for (let i in routers) {
                            const { method, href, callback } = routers[i];
                            if (method == req.method && req.url.startsWith(href)) {
                                await callback(req, res);
                                return
                            }
                        }
                    }
                } catch(err) {
                    console.error(err);
                }
            }
        }
            
    }

    app.get = function(href, callback) {
        routers.push({
            method: 'GET',
            href,
            callback,
        });
    }
    app.post = function(href, callback) {
        routers.push({
            method: 'POST',
            href,
            callback,
        });
    }

    return app
}

module.exports = Router;