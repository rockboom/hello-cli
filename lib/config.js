const path = require('path');
const deepcopy = require('deepcopy');
const defaultConfig = {
    entry:'index.html',
    output: 'dist',
    include: [
        'src'
    ]
}
const defaultConfigFile = 'config.js';
const cwd = process.cwd();
const configPath = path.resolve(cwd, defaultConfigFile);
const config = require(configPath);
for (let key in defaultConfig) {
    if (config[key]) {
        defaultConfig[key] = deepcopy(config[key]);
    }
}
const outputDir = path.resolve(config.cwd, config.output);
defaultConfig.cwd = cwd;
defaultConfig.outputDir = outputDir;
module.exports = defaultConfig;