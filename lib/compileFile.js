const scssCompiler = require('./scssCompiler');
const jsCompiler =  require('./jsCompiler');
const {copy} = require('./copy');
let compilers = {
    scss: (input, output) => {
        scssCompiler(input, output);
    },
    js:(input,output)=>{
        jsCompiler(input,output);
    },
    vue: () => {}
}
module.exports = function (input, output, extension) {
    if (compilers[extension]) {
        compilers[extension](input, output)
    }else{
        copy(input,output);
    }
}