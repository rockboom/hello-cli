const sass = require('sass');
const fs = require('fs-extra');
const {getOutputPath} = require('./utils');
const render = (input, output) => {
    const outputPath = getOutputPath(output,'css');
    if (!fs.existsSync(outputPath)){
        fs.createFileSync(outputPath);
    }
    sass.render({
        file:input,
        outFile: outputPath
    },(error,result)=>{
        if(error){
            console.error(error);
            return;
        }
        fs.writeFile(outputPath, result.css, function (error) {
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