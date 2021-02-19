const path = require('path');
const glob = require('glob');
const config = require('./config');
const compileFile = require('./compileFile');
const {generateFile} = require('./utils');
generateFile(config.output);
const copy = require('./copy');
module.exports = function (options) {
    for (let glogPattern of config.include) {
        glob(glogPattern, (error, files) => {
            if(error) {
                console.error(error);
                return;
            }
            files.forEach((file) => {
                let extname = path.extname(file);
                let extension = extname.slice(1);
                let input = path.resolve(config.cwd, file);
                compileFile(input, file, extension);
            })
        })
    }
    copy(config.entry,config.entry);
}