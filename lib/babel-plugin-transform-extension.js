const {extname} = require("path");
const isVue = (extension)=>{
    return extension === '.vue';
}
module.exports = ({types:t})=>{
    return {
        visitor:{
            ImportDeclaration(path,state){
                let ext = extname(path.node.source.value);
                if(isVue(ext)){
                    path.node.source.value = `${path.node.source.value}.js`;
                }
            }
        }
    }
}