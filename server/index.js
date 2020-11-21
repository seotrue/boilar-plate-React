// 익스 프레스 모듈 갖고움
const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cors = require("cors");
const { auth } = require('./middleware/auth');
const { User } = require("./models/User");

const config = require('./config/key')
const mongoose = require('mongoose')

// application/x-www-form-urlencoded 를 분석해서 가져옴
app.use(bodyParser.urlencoded({extended:true}));
// application/json을 분석해서 가져옴
app.use(bodyParser.json());

/*
let cors_origin = [`http://localhost:3000`];
app.use(

  cors({

      origin: 'http://localhost:3000', // 허락하고자 하는 요청 주소

      credentials: true, // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.

  })

);
*/ 

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false//에러 안뜨드록
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/api/hello',(req,res)=>  res.send('안녕하세요'))


//간단한 라우터 :   류트디렉토리를 오면 저 문구가 실행 되도록
app.get('/', (req, res) => {
  res.send('Hello World!')
})




app.post('/test',(req,res)=>{
    const a = new User(req.body);
    a.save((err, userInfo) => {
        // 만약 에러가 잇다면 클라이언트에게 제이슨 형식으로 알려주자
        if (err) return res.json({ success: false, err })
        
        // 클라이언트에게 성공햇다는는(200) 과 제이슨 형식으로 보내자
        return res.status(200).json({
          success: true
        })
    })
})


// 회원가입을 위한 라우터 /register :엔드포인트
app.post('/api/users/register', (req, res) => {
    
    /*
    req.body에 제이슨 형식으로 클라이언트에서 보내준 데이터가 들어잇음 
    그건 bodyParser d이용해서 정보를 받아준다. 
    회원가입 할때 필요한 저오들을 클라이언트에서 가져오면 그것들을 데이터베이스에 넣는다 
    */
    const user = new User(req.body);
    
    

    // save은 mongDB 메소드 : 받아온 데이터를 유저 객체에 저장해준다
    user.save((err, userInfo) => {
        // 만약 에러가 잇다면 클라이언트에게 제이슨 형식으로 알려주자
        if (err) return res.json({ success: false, err, user,userInfo })
        
        // 클라이언트에게 성공햇다는는(200) 과 제이슨 형식으로 보내자
        return res.status(200).json({
          success: true
        })
    })
})

app.post('/api/users/login', (req, res) => {
     // 1.클라이언트에서 넘겨준 이메일을 데이터베이스에서 찾는다
     User.findOne({email : req.body.email},(err,user)=>{
    
        //res 은 ㅜ클라이언트로 줄것, req 내가 서버에서 받은거 
        if (!user) {
            return res.json({
              loginSuccess: false,
              message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        
        // 2. 이메일이 db에 잇다면 비밀번호가 맞는지 확인 => 넘겨온 비번 : 디비에 잇는 비번 
        //(plainPassword, cb)
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
        
        })

        // 비번 까지 맞으면 토큰 생성 
        // User.js 의 메소드에서 토큰 생성 메소드 만들때 넘겨준 매개변수 user 안에 토큰이 들어잇다
        user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
    
            // 토큰 저장 1.쿠키 , 2.로컬스토리지, 3.세션스토리지  여기선 쿠키로 
            res.cookie("x_auth", user.token)
              .status(200)
              .json({ loginSuccess: true, userId: user._id })
        })
     
     })

   
   
   
})

 // role 0 -> 일반유저   role 0이 아니면  관리자 
// 콜백함수 실행 전에 미들웨어인 auth를 통과해야함
app.get('/api/users/auth', auth, (req, res) => {
  //여기 까지 미들웨어를 통과해 왔다는 얘기는  Authentication 이 True 라는 말.
  res.status(200).json({
      _id: req.user._id,
      isAdmin: req.user.role === 0 ? false : true,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      lastname: req.user.lastname,
      role: req.user.role,
      image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
    // console.log('req.user', req.user)
    User.findOneAndUpdate({ _id: req.user._id },
      { token: "" }
      , (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
          success: true
        })
      })
})

// 포트 오천번으로 시작
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
