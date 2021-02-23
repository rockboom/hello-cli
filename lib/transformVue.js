const hash = require('hash-sum');
const path = require('path');
const {
    compileScript,
    compileTemplate,
    compileStyle
} = require('@vue/compiler-sfc');
const optinos = {
    code: string,
    filename: string,
    options: Options,
    sourceRoot: string,
    isProduction: boolean,
    isServer: boolean,
}
const shortFilePath = path
    .relative(sourceRoot, filename)
    .replace(/^(\.\.[\/\\])+/, '')
    .replace(/\\/g, '/')
const scopeId = hash(
    isProduction ? shortFilePath + '\n' + code : shortFilePath
)
const renderReplace = isServer ?
    `script.ssrRender = ssrRender` :
    `script.render = render`;

compileScript(descriptor, {
    filename,
    source: code,
    id: '671062ce',
    inlineTemplate: true,
    isProd: false,
    templateOptions: {
        compiler: undefined,
        compilerOptions: {
            scopeId: undefined,
            bindingMetadata: undefined,
        },
        filename: '/Users/johnson/github/rollup-plugin-vue/examples/simple/src/HelloWorld.vue',
        id: '671062ce',
        isProd: false,
        scoped: false,
        preprocessCustomRequire: undefined,
        preprocessLang: undefined,
        preprocessOptions: undefined,
        scoped: false,
        ssr: false,
        ssrCssVars: [],
        transformAssetUrls: undefined
    }
});