const babel = require('@babel/core');
const {resolve} = require('path');
const config = require('./config');
const fs = require('fs-extra');
const {getOutputPath}  = require('./utils');
const babelPluginTransformExtension = require('./babel-plugin-transform-extension');
const babelConfig = require(resolve(config.cwd, 'babel.config.json'));
if(babelConfig.plugins){
    babelConfig.plugins.push(babelPluginTransformExtension);
}
const jsCompiler = (input,output,code)=>{
    output = getOutputPath(output);
    if (!fs.existsSync(output)) {
        fs.createFileSync(output);
    }
    // console.log(babelConfig);
    let file;
    if(code){
        file = input;
    }else{
        file = fs.readFileSync(input);
    }
    
    let result = babel.transform(file, babelConfig);
    fs.writeFileSync(output, result.code);
}
module.exports = jsCompiler;