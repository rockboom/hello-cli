// 找到要执行的核心文件
// 1) 解析用户参数
const program = require('commander');
const {version} = require('./contants.js');
const path = require('path');
// 解析用户传递过来的参数
// process.argv = ['/usr/local/bin/node', '/usr/local/bin/fz-cli', '--help']

// vue create projectname
// vue ui ...
// vue config

const mapActionis = {
    create:{
        alias:'c',
        description: 'create a peoject',
        examples:[
            'fz-cli create <project-name>'
        ]
    },
    config: {
        alias: 'conf',
        description: 'config project variable',
        examples: [
            'fz-cli config set <k> <v>',
            'fz-cli config get <k>'
        ]
    },
    '*': {
        alias: '',
        description: 'command not found',
        examples: []
    }
}

// Object.keys
Reflect.ownKeys(mapActionis).forEach((action)=>{
    program
        .command(action) // 配置命令的名字
        .alias(mapActionis[action].alias) // 命令的别名
        .description(mapActionis[action].description) // 命令的描述
        .action(() => {
            if(action === '*'){ // 访问不到对应的命令 就打印找不到命令
                console.log(mapActionis[action].description);
            }else{
                console.log(action);
                // fz-cli create xxx // [node,fz-cli,create,xxx]
                require(path.resolve(__dirname,action))(...process.argv.slice(3));
            }
        })

})

// 监听用户的help事件
program.on('--help',()=>{
    console.log('\nExamples:')
    Reflect.ownKeys(mapActionis).forEach((action)=>{
        mapActionis[action].examples.forEach((example)=>{
            console.log(`  ${example}`);
        })
    })
})

program.version(version).parse(process.argv);