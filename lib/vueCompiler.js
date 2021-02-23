const {
    parse,
    compileTemplate,
    compileScript,
    compileStyle,
    compileStyleAsync
} = require('@vue/compiler-sfc');
const rootContext = process.cwd();
const hash = require('hash-sum');
const path = require('path');

const {getOutputPath,addExtension} = require('./utils');
const fs = require('fs-extra');
const jsCompiler = require('./jsCompiler');
const compiler = (input,output)=>{
    output = getOutputPath(output);
    output = addExtension(output, 'js');
    if (!fs.existsSync(output)) {
        fs.createFileSync(output);
    }
    let options = {
        filename: input,
        source: '',
        id: '671062ce',
        inlineTemplate: true,
        isProd: false,
        templateOptions: {
            compiler: undefined,
            compilerOptions: {
                scopeId: '671062ce',
                bindingMetadata: undefined,
            },
            filename: input,
            id: '671062ce',
            isProd: false,
            scoped: true,
            preprocessCustomRequire: undefined,
            preprocessLang: undefined,
            preprocessOptions: undefined,
            ssr: false,
            ssrCssVars: [],
            transformAssetUrls: undefined
        }
    }
    // console.log(babelConfig);
    let file = fs.readFileSync(input).toString();
    const shortFilePath = path
        .relative(rootContext, input)
        .replace(/^(\.\.[\/\\])+/, '')
        .replace(/\\/g, '/');
    const scopeId = hash(shortFilePath + '\n' + file);
    let {descriptor, errors} = parse(file);
    // console.log('parse', descriptor);
    options.source = descriptor.template.content;
    let template = compileTemplate(options);
    let templateCode = template.code;
    templateCode = templateCode.replace('export','');
    // console.log('template', templateCode);

    options.source = descriptor.script.content;
    // console.log('descriptor.script', descriptor.script);
    let script = compileScript(descriptor,options);
    let scriptCode = script.content;
    scriptCode = scriptCode.replace(/export\s*default/, 'const script = ');
    scriptCode += '\nscript.render = render;';
    scriptCode += `\nscript._file = "${shortFilePath}"`;
    scriptCode += '\nexport default script;';
    // console.log('script', scriptCode);
    let code = templateCode + scriptCode;
    descriptor.styles.forEach(async (style)=>{
        options.source = style.content;
        let styles = await compileStyleAsync(options);
        // console.log('styles', styles.code);
    })
    
    

    // const ast = compilerCore.baseParse(file);
    // const [nodeTransforms] = compilerCore.getBaseTransformPreset(true);
    // compilerCore.transform(ast, {
    //     nodeTransforms: [
    //         ...nodeTransforms,
    //     ]
    // })
    // const render = compilerCore.generate(ast).code;
    // // jsCompiler(render, output,true);
    jsCompiler(code,output,true);
    // fs.writeFileSync(output, code);
}
module.exports = compiler