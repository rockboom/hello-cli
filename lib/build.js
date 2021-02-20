const path = require('path');
const glob = require('glob');
const config = require('./config');
const compileFile = require('./compileFile');
const {generateFile} = require('./utils');
generateFile(config.output);
const {copy,copyLib} = require('./copy');
const {removeFolder} = require('./utils');
module.exports = function (options) {
    removeFolder(config.output);
    copyLib();
    for (let glogPattern of config.include) {
        glob(glogPattern, (error, files) => {
            if(error) {
                console.error(error);
                return;
            }
            // 过滤掉文件夹，只保留文件
            files = files.filter((file)=>{
                return path.extname(file).length > 0;
            })
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