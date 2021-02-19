const path = require('path');
const glob = require('glob');
const config = require('./config');
const compileFile = require('./compileFile');
const fs = require('fs-extra');
if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir);
}
module.exports = function (options) {
    for (let glogPattern of config.include) {
        glob(glogPattern, (error, files) => {
            files.forEach((file) => {
                let extname = path.extname(file);
                let extension = extname.slice(1);
                let absolutePath = path.resolve(config.cwd, file);
                compileFile(absolutePath, file, extension);
            })
        })
    }
}