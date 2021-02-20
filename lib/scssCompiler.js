const sass = require('sass');
const fs = require('fs-extra');
const {getOutputPath} = require('./utils');
const render = (input, output) => {
    output = getOutputPath(output, 'css');
    if (!fs.existsSync(output)) {
        fs.createFileSync(output);
    }
    sass.render({
        file:input,
        outFile: output
    },(error,result)=>{
        if(error){
            console.error(error);
            return;
        }
        fs.writeFile(output, result.css, function (error) {
            if(error) {
                console.error(error);
                return;
            }
            if (!error) {
            }
        });
    });
}
module.exports = render;