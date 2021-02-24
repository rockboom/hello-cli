const path = require('path');
const {resolve} = require('path');
const glob = require('glob');
const config = require('./config');
const compileFile = require('./compileFile');
const {generateFile} = require('./utils');
generateFile(config.output);
const {copy,copyDir} = require('./copy');
const {removeFolder} = require('./utils');
module.exports = function (options) {
    removeFolder(config.output);
    copyDir(resolve(config.cwd, 'lib'), resolve(config.output, 'lib'));
    // if (config.external && config.external.length){
    //     config.external.forEach((dep)=>{
    //         const depPath = resolve(config.cwd,'node_modules',dep);
    //         const output = resolve(config.output, 'node_modules', dep);
    //         console.log('node_modules',depPath,output);
    //         copyDir(depPath, output);
    //     })
    // }
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
                let output = path.resolve(config.output,file);
                compileFile(input, output, extension);
            })
        })
    }
    copy(
        path.resolve(config.cwd, config.entry), 
        path.resolve(config.output, config.entry)
    );
}