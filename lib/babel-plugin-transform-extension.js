module.exports = ({types:t})=>{
    return {
        visitor:{
            ImportDeclaration(path,state){
                // console.log(path,state);
            }
        }
    }
}