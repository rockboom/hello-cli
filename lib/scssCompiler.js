const sass = require('sass');
const fs = require('fs-extra');
const {getOutputPath} = require('./utils');
const render = (input, output) => {
    const outputPath = getOutputPath(output,'css');
    console.log('outputPath', outputPath);
    console.log('input', input);
    if (!fs.existsSync(outputPath)){
        fs.createFileSync(outputPath);
    }
    sass.render({
        file:input,
        outFile: outputPath
    },(error,result)=>{
        console.error(error);
        fs.writeFile(outputPath, result.css, function (err) {
            console.log("err",err);
            if (!err) {
                console.log("成功");
            }
        });
    });
}
module.exports = render;