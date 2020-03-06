// create 的所有逻辑
const axios = require('axios');
const ora = require('ora'); // 制造某些文字效果 如加载时的旋转效果
const Inquirer = require('inquirer'); // 提示用户进行选择
const path = require('path');
const {
    downloadDirectory
} = require('./contants.js');
const {promisify} = require('util');
const fs = require('fs');
let downloadGitRepo = require('download-git-repo'); // 用于下载git repo 不是基于promise 需要转换成promise
let ncp = require('ncp'); // 用于复制文件
const MetalSmith = require('metalsmith'); // 用于遍历文件夹 找是否需要渲染
let {render} = require('consolidate').ejs; // 集合了所有的模板引擎
render = promisify(render);
// 可以把异步的api转成promise
downloadGitRepo = promisify(downloadGitRepo);
ncp = promisify(ncp);

// create功能是创建项目
// 拉取所有的项目 列出来 让用户选安装哪一个项目 projectName
// 选完后 再显示所有的版本号 version 1.0.0

// 1）获取仓库列表
const fetchRepoList = async () => {
    // const {
    //     data
    // } = await axios.get('https: //api.github.com/orgs/hellofa/repos');
    // return data;
    return require('./data.json');

}

// 抓取tag列表
const fetchTagList = async (repo) => {
    // const {
    //     data
    // } = await axios.get('https://api.github.com/repos/zhu-cli/${repo}/tags');
    // return data;
    return require('./tags.json')
}

const download = async (repo,tag)=>{
    let api = `zhu-cli/${repo}`;
    if(tag){
        api += `#${tag}`;
    }
    // user/xxxx/.tamplate/repo
    const dest = `${downloadDirectory}/${repo}`;
    await downloadGitRepo(api,dest);
    return dest;// 下载的最终目录
}

// 封装loading效果
const awaitFnLoading = (fn, messsage) => async (...args) => {
    const spinner = ora(messsage);
    spinner.start();
    let result = await fn(...args)
    spinner.succeed();
    return result;
}

// https://api.github.com/orgs/zhu-cli/repos
// https://api.github.com/repos/zhu-cli/vue-tamplate/tags
// http://192.9.200.187/abc-modules 获取组织下的仓库

// https://api.github.com/orgs/hellofa/repos
// https://api.github.com/repos/hellofa/vue-tamplate/tags
// 可能还需要用户配置一些数据 来结合渲染我的项目
module.exports = async (projectName) => {
    // 1) 获取项目的模板 (所有的)
    let repos = await awaitFnLoading(fetchRepoList, 'fetching template......')();
    repos = repos.map(item => item.name);
    // 获取之前显示loading 关闭loading
    // 选择模板 inquirer
    const {
        repo
    } = await Inquirer.prompt({
        name: 'repo', // 用户选择后的结果
        type: 'list',
        messsage: 'please choose a template to create project',
        choices: repos
    })

    // 2）通过当前选择的项目 拉取对应的版本
    // 获取对应的版本号
    let tags = await awaitFnLoading(fetchTagList, 'fetching tags.......')(repo);
    tags = tags.map((item) => item.name);
    console.log('tags:', tags)
    const {
        tag
    } = await Inquirer.prompt({
        name: 'tag', // 用户选择后的结果
        type: 'list',
        messsage: 'please choose a tag to create project',
        choices: tags
    })
    console.log(repo, tag); // 下载模板
    // 3）把模板放到一个临时目录里 存好 以备后期使用
    // download-git-repo
    const result = await awaitFnLoading(download,'download template.....')(repo,tag);
    console.log(result);

    // 我拿到了下载的目录 直接拷贝当前的目录即可
    // 把template 下的文件 拷贝到执行命令的目录下
    // 4）拷贝操作
    // 这个目录 项目名字是否已经存在 如果存在提示当前已经存在

    // 如果有ask.js 文件 // .template/xxxx
    if(!fs.existsSync(path.join(result,'ask.js'))){
        await ncp(result, path.resoxlve(projectName));
    }else{
        // 复杂的需要模板渲染 渲染后在拷贝
        // 复杂的模板
        // 把git上的项目下载下来，如果有ask.js 文件就是一个复杂的模板 需要用户选择后建一个模板
        // 1）用户填写信息
        await new Promise((resolve,reject)=>{
            MetalSmith(__dirname) // 如果你传入路径 默认会遍历当前路径下的src文件夹
                .source(result)
                .destination(path.resolve(projectName))
                .use(async (files,metal,done)=>{
                    const args = require(path.join(result,'ask.js'))
                    let obj = await Inquirer.prompt(args);
                    const meta = metal.metadata();
                    Object.assign(meta,obj)
                    console.log('result:',obj);
                    delete files['ask.js'];
                    done();
                })
                .use((files, metal, done) => {
                    let obj = metal.metadata();
                    // 根据用户的输入下载模板
                    Reflect.ownKeys(files).forEach(async (file)=>{
                        // 这个是要处理的 <%
                        if(file.includes('js') || file.includes('json')){
                            let content = files[file].contents.toString(); // 文件的内容
                            if(content.includes('<%')){
                                content = await render(content,obj);
                                files[file].contents = Buffer.from(content);
                            }
                        }
                    })
                    console.log('metal:',metal.metadata());
                    done();
                })
                .build((err)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve();
                    }
                })
        })
        // 2）用用户填写的信息去渲染模板
        // metalsmith 只要是模板编译 都需要这个模块
        console.log('复制模板');
    }
    
    
    
    
}