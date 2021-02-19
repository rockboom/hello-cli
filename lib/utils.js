const ora = require('ora');
const config = require('./config');
const path = require('path');
const fs = require('fs-extra');
async function sleep(n) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, n);
    })
}
async function wrapLoading(fn, message, ...args) {
    const spinner = ora(message);
    spinner.start();
    try {
        let repos = await fn(...args);
        spinner.succeed();
        return repos;
    } catch (error) {
        spinner.fail('request failed, refetching......');
        await sleep(1000);
        return wrapLoading(fn, message, ...args);
    }
}

function getOutputPath(relativePath, extension) {
    if(extension){
        let index = relativePath.lastIndexOf(".");
        let ext = relativePath.substring(index + 1);
        relativePath = relativePath.replace(ext, extension);
    }
    return path.resolve(config.output, relativePath);
}
function generateFile(file){
    if (!fs.existsSync(file)) {
        let ext = path.extname(file);
        if(ext.length > 0){
            fs.createFileSync(file);
        }else{
            fs.mkdirSync(file);
        }
    }
}
module.exports = {
    wrapLoading,
    getOutputPath,
    generateFile
}