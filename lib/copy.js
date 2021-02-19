const fs = require('fs-extra');
// const fs = require('fs');
const {generateFile,getOutputPath} = require('./utils');
const copy = (input,output)=>{
    output = getOutputPath(output);
    fs.copy(input,output);
    // generateFile(output);
    // fs.copyFileSync(input, output);

}
module.exports = copy