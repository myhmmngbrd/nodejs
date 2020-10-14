'use strict';

const fs = require('fs');
const fspromise = fs.promises;
const path = require('path');

function Router() {
    const routers = [];

    
    const app = async function (req, res) {
        let param = '';
        const method = req.method;
        const url = req.url;
    
        param += `\x1b[36m${method}\x1b[0m ${url} : `;

        // public 폴더 내의 파일인지 확인
        try {
            const file = await fspromise.readFile(path.join(__dirname, '../', 'public', url));
            param += `\x1b[32mpublic\x1b[0m`;
            res.writeHead(200);
            res.end(file);
            return;
        } catch(error) {
            if (error.code !== 'ENOENT' && error.code !== 'EISDIR'){
                console.log(error);
            }
            
            // 아니라면 라우팅
            param += `\x1b[33mroute\x1b[0m`;
            try {
                for (let router of routers) {
                    if (req.method === router.method && req.url.startsWith(router.url)) {
                        await router.callback(req, res);
                        return;
                    }
                }
            } catch(error) {
                param += ` \x1b[31m${error.code}\x1b[0m ${error.message}`;
            }
            
        }
        console.log(param);
    }


    app.get = (url, callback) => {
        routers.push({
            method: "GET",
            url,
            callback,
        });
    }
    app.post = (url, callvack) => {
        routers.push({
            method: "POST",
            url,
            callback,
        });
    }

    return app;
};



module.exports = Router;