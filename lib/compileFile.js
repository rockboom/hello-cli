let scssCompiler = require('./scssCompiler');
let compilers = {
    scss: (input, output) => {
        scssCompiler(output, output);
    },
    vue: () => {}
}
module.exports = function (input, output, extension) {
    if (compilers[extension]) compilers[extension](input, output);
}