# hello-cli
关于cli的工程
## 全局包
- 在项目的根目录下新建 /bin/hello 文件，文件内容如下
```js
#! /usr/bin/env node
```
- 要作为全局包，首先需要在package.json文件中声明bin属性，bin属性的值是一个对象，对象包含要执行的命令和命令地址
```js
// package.json文件中申明bin属性 bin字段的值是一个对象 此时通过npm link链接生成的命令是`fz-cli`
{
    "bin":{
        "fz-cli": "./bin/hello"
    }
}
```
```js
// 配置命令别名
// package.json文件中申明bin属性 bin字段的是文件地址 此时通过npm link链接生成的命令是name字段的值，即命令是`hello-cli`
{
    "name": "hello-cli",
    "bin":"./bin/hello"
}
```
- npm link 链接到本地环境中，即把hello-cli文件夹链接到全局目录下 可以用npm unlink解除链接

> link 相当于将当前本地模块链接到npm 目录下，这个npm目录可以直接访问，所以当前包就可以直接访问了

## 流程
- 1.配置可执行命令 hello --help 有提示 commander
- 2.做一个命令行交互的功能 inquirer
- 3.将模板下载下来 download-git-repo
- 4.根据用户的选择动态生成内容 metalsmith

## TODO
- 1.编译
- 2.缓存
- 3.模板生成