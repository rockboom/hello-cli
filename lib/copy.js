const fs = require('fs-extra');
const {resolve} = require('path');
const copyDir = (input,output)=>{
    fs.readdir(input,(error,files)=>{
        files.forEach(function(file){
            let filepath = resolve(input, file);
            let outputPath = resolve(output, file);
            fs.copy(filepath, outputPath)
                .catch((error) => {
                    console.error(error);
                })
        })
        
    })
    
}
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
    copyDir
}