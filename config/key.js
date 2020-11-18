const { mongoURI } = require('./dev');

// 환경 변수가 배포일땐
if(process.env.NODE_ENV === 'production'){
    module.exports =  require('./prod');
}else{
    // 개발 모드일땐
    module.exports = require('./dev');
}