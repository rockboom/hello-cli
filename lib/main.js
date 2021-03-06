// 脚手架的核心功能  1.创建项目  2.更改配置文件  3.UI界面

// 1. 配置可执行命令 hello --help 有提示 commander
const program = require('commander');
const chalk = require('chalk');
const package = require('../package.json');

const cleanArgs = (cmd) => {
    const args = {};
    cmd.options.forEach((option) => {
        const key = option.long.slice(2);
        if (cmd[key]) args[key] = cmd[key];
    })
    return args;
}
// 万一重名了呢？强制创建的模式
program
    .command('create <app-name>')
    .description('create a new projeect')
    .option('-f, --force', 'overwrite target directory if it exists')
    .action((name, cmd) => {
        // 调用create模块去创建
        require('../lib/create')(name, cleanArgs(cmd));
    })

// vue config --get a
// vue config --set a 1 =>配置文件中
// vue config --delete a
program
    .command('config [value]')
    .description('inspect and modify the config')
    .option('-g, --get <path>', 'get value from option')
    .option('-s, --set <path> <value>', 'set value from option')
    .option('-d, --delete <path>', 'delete option from config')
    .action((value, cmd) => {
        console.log('config', value, cleanArgs(cmd)); // 需要提取cmd中的属性
    })
program
    .command('build [value]')
    .description('package a folder or a file')
    .option('-f, --file <path>', 'build a file')
    .option('-d, --dir <path>', 'build a folder')
    .action((value, cmd) => {
        require('../lib/build')(cleanArgs(cmd));
    })
program
    .command('serve [value]')
    .description('start a server')
    .option('-w, --watch', 'watching file change')
    .action((value, cmd) => {
        require('../lib/build')();
        require('../lib/server');
    })
program
    .command('ui')
    .description(`start and open ${package.name} ui`)
    .option('-p,--port <port>', 'Port used for the UI Server')
    .action((cmd) => {
        console.log(cleanArgs(cmd));
    })
program.on('--help', function () {
    console.log(`\n Run ${chalk.cyan(`${package.name} <command> --help`)}  show details. \n`);
})
program
    .version(`${package.name}@${package.version}`)
    .usage(`<command> [option]`)
// 解析用户执行命令传入的参数
program.parse(process.argv);
// 2. 做一个命令行交互的功能 inquirer
// 3. 将模板下载下来 download-git-repo
// 4. 根据用户的选择动态生成内容 metalsmith