const ora = require('ora');

async function sleep(n) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, n);
    })
}
async function wrapLoading(fn, message,...args) { // 制作了一个等待的loading
    const spinner = ora(message);
    spinner.start(); // 开启加载
    try {
        let repos = await fn(...args);
        spinner.succeed(); // 成功
        return repos;
    } catch (error) {
        spinner.fail('request failed, refetching......');
        await sleep(1000);
        return wrapLoading(fn, message,...args);
    }

}
module.exports = {
    wrapLoading
}