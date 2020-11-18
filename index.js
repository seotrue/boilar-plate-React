// 익스 프레스 모듈 갖고움
const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const {User} = require('./models/User')

// application/x-www-form-urlencoded 를 분석해서 가져옴
app.use(bodyParser.urlencoded({extended:true}));
// application/json을 분석해서 가져옴
app.use(bodyParser.json())
const config = require('./config/key')
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false //에러 안뜨드록
}).then(()=>console.log('MongDB Connected...'))
    .catch(err=>console.log(err))

//간단한 라우터 :   류트디렉토리를 오면 저 문구가 실행 되도록
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// 회원가입을 위한 라우터 /register :엔드포인트
app.post('/register',(req,res)=>{
    // 회원가입 할때 필요한 저오들을 클라이언트에서 가져오면
    // 그것들을 데이터베이스에 넣는다

    //req.body에 제이슨 형식으로 클라이언트에서 보내준 데이터가 들어잇음 
    // 그건 bodyParser d이용해서 정보를 받아준다.
    const user = new User(req.body)

    // save은 mongDB 메소드 : 받아온 데이터를 유저 객체에 저장해준다
    user.save((err, userInfo) => {
        // 만약 에러가 잇다면 클라이언트에게 제이슨 형식으로 알려주자
        if (err) return res.json({ success: false, err })
        // 클라이언트에게 성공햇다는는(200) 과 제이슨 형식으로 보내자
        return res.status(200).json({
          success: true
        })
    })
})

// 포트 오천번으로 시작
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
