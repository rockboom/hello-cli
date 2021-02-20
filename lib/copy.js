const fs = require('fs-extra');
const config = require('./config');
const {resolve} = require('path');
const copyLib = ()=>{
    console.log('copyLib');
    fs.readdir(resolve(config.cwd, 'lib'),(error,files)=>{
        // console.log(files);
        files.forEach((file)=>{
            let output = resolve(config.output, 'lib', file);
            let filepath = resolve(config.cwd, 'lib', file);
            fs.copy(filepath, output)
                .catch((error) => {
                    console.error(error);
                })
        })
        
    })
    
}
// const fs = require('fs');
const {generateFile,getOutputPath} = require('./utils');
const copy = (input,output)=>{
    output = getOutputPath(output);
    fs.copy(input,output).catch((error)=>{
        console.error(error);
    });
    // generateFile(output);
    // fs.copyFileSync(input, output);
}
module.exports = {
    copy,
    copyLib
}