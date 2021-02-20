const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const open = require('open');
const http = require('http');
const config = require('./config');
let contentTypes = {
    js:"text/javascript",
    json: "application/json",
    css:"text/css",
    html:"text/html",
    ico:'image/ico'
}
const server = http.createServer((request, response) => {
    console.log(chalk.blue('request starting ......'));
    let filepath = `.${request.url}`;
    if(filepath === './'){
        filepath = 'index.html';
    }

    let extname = path.extname(filepath).substring(1);
    
    if (extname === 'ico') {
        filepath = path.resolve(config.output, './public/images', filepath);
    }
    filepath = path.resolve(config.output,filepath);
    let contentType = contentTypes[extname];
    console.log(chalk.green('request file', filepath, 'Content-Type', contentType));
    fs.readFile(filepath, (error, content) => {
        if (error) {
            console.error(error);
            if (error.code === 'ENOENT') {
                response.writeHead(200, {
                    'Content-Type': contentType
                });
                response.end('Not Found');
            }
        } else {
            response.writeHead(200, {
                'Content-Type': contentType
            });
            response.end(content, 'utf-8');
        }
    })
    
    
});
server.listen(8080, '127.0.0.1');
// (async () => {
//     await open('http://127.0.0.1:8080/')
// })();
console.log(chalk.blue('serving running at 127.0.0.1:8080'));