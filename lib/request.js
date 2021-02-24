// 通过axios来获取结果
const axios = require('axios');
axios.interceptors.response.use(res => res.data);
async function fetchRepoList(){
    // TODO 可以通过配置文件 拉取不同仓库对应用户下的文件
    return axios.get('https://api.github.com/repos/rockboom/vue3-template')
}
async function fetchTagList(repo){
    return axios.get(`https://api.github.com/repos/rockboom/${repo}/tags`);
}
module.exports = {
    fetchRepoList,
    fetchTagList
}