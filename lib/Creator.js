const { fetchRepoList, fetchTagList } = require("./request");
const Inquirer = require('inquirer');
const {wrapLoading,isObject} = require('./utils');
const downloadGitRepo = require('download-git-repo'); // 不支持promise
const {promisify} = require('util');
const path = require('path');
const fs = require('fs-extra');
const {downloadDirectory} = require('./constant');
const Metalsmith = require('metalsmith');
let {render} = require('consolidate').ejs;
render = promisify(render);
class Creator{
    constructor(projectName,targetDir) { // new的时候调用
        this.name = projectName;
        this.target = targetDir;
        // 转成promise方法
        this.downloadGitRepo = promisify(downloadGitRepo);
    }
    async fetchRepo(){
        // 失败重新拉取 
        let repos = await wrapLoading(fetchRepoList,'waiting for fetching template');
        if(!repos)return;
        if(isObject(repos)){
            repos = [repos];
        }
        repos = repos.map(item => item.name);
        let {repo} = await Inquirer.prompt({
            name:'repo',
            type:'list',
            choices:repos,
            message:'please choose a template to create project'
        });
        return repo;
    }
    async fetchTag(repo){
        let tags = await wrapLoading(fetchTagList,'wating fetch tag',repo);
        if(!tags)return;
        tags = tags.map(item=>item.name);
        let {tag} = await Inquirer.prompt({
            name: 'tag',
            type: 'list',
            choices: tags,
            message: 'please choose a tag to create project'
        });
        return tag;
    }
    async download(repo,tag){
        // 1.先拼接下载路径
        // zhu-cli/vue-template#1.0
        // let requestUrl = `zhu-cli/${repo}${tag?'#'+tag:''}`;
        let project = `${repo}${tag?'#'+tag:''}`;
        let requestUrl = `rockboom/${project}`;
        this.templateDirectory = path.resolve(downloadDirectory, `${repo}@${tag}`);
        // 2.把资源下载到某个路径上  TODO 缓存功能
        // 原则上应该下载到系统目录中 稍后可以使用ejs handlerbar 去渲染模板 最后生成结果 在写入

        try{
            fs.statSync(this.templateDirectory);
        }catch(error){
            console.error(error);
            // 放到系统文件中 -> 模板 和 用户的其他选项 -> 生成结果 放到当前目录下
            // await wrapLoading(this.downloadGitRepo,'wating for download template',requestUrl,path.resolve(process.cwd(), `${repo}@${tag}`));
            await wrapLoading(this.downloadGitRepo, 'wating for download template', requestUrl, this.templateDirectory);
        }
        return this.target;
    }
    async renderTemplate(){
        console.log('render', this.templateDirectory,this.target);
        Metalsmith(__dirname) // 如果不传入source 默认寻找 __dirname下的 ./src 和 ./build
            .source(this.templateDirectory)
            .destination(this.target)
            .use(async (files, metal, done) => {
                // const questions = require(path.resolve(this.templateDirectory,'ask.js'));
                // const answers = await Inquirer.prompt(questions);
                const answers = {
                    projectName: this.name
                }
                metal.metadata(answers);
                delete files['ask.js'];
                done();
            })
            .use((files,metal,done)=>{
                const info = metal.metadata();
                Reflect.ownKeys(files).forEach(async(file)=>{
                    if(file.includes('.js') || file.includes('.json')){
                        let content = files[file].contents.toString();
                        if(content.includes('<%=')){
                            content = await render(content,info);
                            files[file].contents = Buffer.from(content);
                        }
                    }
                })
                done();
            })
            .build((error,files)=>{
                
            })
    }
    async create(){ // 开始创建

        // 不用git clone 是为了用户交互
        // 1. 先去拉取当前组织下的模板
        let repo = await this.fetchRepo();
        // 2. 在通过模板找到版本号
        let tag = await this.fetchTag(repo);
        console.log(tag);
        // 3. 下载
        let downloadUrl = await this.download(repo,tag);

        // 4. 编译模板
        this.renderTemplate();
    }
}

module.exports = Creator;