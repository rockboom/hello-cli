const chalk = require('chalk');
const open = require('open');
const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1 style="color: brown;">Hello world</h1>
</body>
</html>`);
});
server.listen(8080, '127.0.0.1');
// (async () => {
//     await open('http://127.0.0.1:8080/')
// })();
console.log(chalk.blue('serving running at 127.0.0.1:8080'));