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
const styleInjectFn = `\n${function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}}`
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
    // console.log('script', scriptCode);
    scriptCode += styleInjectFn;
    descriptor.styles.forEach((style,index)=>{
        options.source = style.content;
        let styles = compileStyle(options);
        let styleCode = styles.code.replace(/\n/g,'\\n');
        let cssVar = `css$${index}`;
        let cssStr = `\nlet ${cssVar}  = "${styleCode}"`;
        let cssExpression = `\nstyleInject(${cssVar})`;
        scriptCode += cssStr;
        scriptCode += cssExpression;
    })
    scriptCode += '\nscript.render = render;';
    scriptCode += `\nscript.__scopeId = "data-v-${scopeId}"`
    scriptCode += `\nscript._file = "${shortFilePath}"`;
    scriptCode += '\nexport default script;';
    
    let code = templateCode + scriptCode;
    jsCompiler(code,output,true);
    // fs.writeFileSync(output, code);
}
module.exports = compiler