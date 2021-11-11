```
[node.js] wjdfl
mongoose: 몽고디비와 내 소스를 연결해주는그런너낌 간단하게 


ex)

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const { User } = require('./models/User')

//bodyParser 옵션주기
// extended 옵션의 경우, true일 경우, 객체 형태로 전달된 데이터내에서 또다른 중첩된 객체를 허용한다는 말이며, false인 경우에는 허용하지 않는 다는의비니다.
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 서버에서 정보를 받을때
// Body-parser로 데이터를 받을수 잇다

// 사용자 정보을  받기 위한 라우터 만들기
app.post('/api/user',(req, res)=>{
    // 정보를 클라이언트에서 가져오면 그것들을 데이터베이스에 넣는는다
    // 인스턴스 생성
    const user = new User(req.body); // req.body로 사용할수 잇는데 json 형식으로 잇음 -> bodyParser로 자동적으로 파싱 해주기 때문에

    // save: 몽고 디비 메세드, 데이터들이 유저 모델이 저장
    user.save((err, userInfo)=>{
        // 만약 저장을 할때 에러가 잇으면 클라이언트에 에러잇다구 전달해야함 -> Json형식으로 에러와 에러 메시지 함께 전달달
        if (err) return res.json({success: false, err})
        return res.status(200).json({success: true})
    })

})

s노드몬: 소스를 변경할때 그걸 감지해서 자동으로 서버를 재시작하는 툴
-save-dev: 로컬에서 할때만 사용하겟다


```
/// 로그인
app.post('login',(req, res)=>{
    // 요청된 이메일을 데이터 베이스에서 잇는지 찾는다: findOne 몽고디비 메소드
    User.findOne({email: req.body.email},(err,user) =>{
        if (!user) {
            return res.json({
                loginSucess: false,
            })
        }
        // 요청된 이메일이 db에 잇다면 비번이 맞는 비번인지 확인
        // user모델에 comparePassword의 메소드르 ㄹ만들어주자
        user.comparePassword(req.body.password,(err, isMatch) => {
            if(!isMatch) {
                return res.json({loginSucess: false,})
            }
        })

    })


    // 비번까지 맞다면 토큰 생성하기

})
```


```

- 유저 모델
```
const mongoose = require('mongoose');

const userSchema =  mongoose.Schema({
    name: {
        type: String,
        maxLength: 50
    },
    companyName: {
        type: String,
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    companyWebsite: {
        type: String,
    },
    purpose: {
        type: String
    },
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

const User = mongoose.model('User',userSchema)


userSchema.methods.comparePassword = function (planPw, callback){

}

module.exports = { User }

```






```

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');


const { User } = require('./models/User')
const { Email } = require('./models/Email')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 1. 사용자 정보 저장 api
app.post('/user',(req, res)=>{
    const user = new User(req.body);
    user.save((err, userInfo)=>{
        if (err) return res.json({success: false, err})
        return res.status(200).json({
            success: 'Success',
            code: 200
        })
    })

    // 사용자에게 메일 보내는 api 호출출
})

// 2. 사용자 정보 관리자 이메일로 전송  api
app.post('/sendMailToAdmin',(req, res)=>{
    let token =
    // 사용자 이메일 정보 v파라미터로 담구
    let messageBody = req.body + `
               사용자 정보 
             '비밀번호 초기화를 위해서는 아래의 URL을 클릭하여 주세요.'
           + \`http://localhost/reset/${token}\`,
    `
    Email.sendmail(messageBody)

    // 성공시
    return res.status(200).json({
        success: 'Success',
        code: 200
    })
})


/// 로그인
app.post('login',(req, res)=>{
    // 요청된 이메일을 데이터 베이스에서 잇는지 찾는다: findOne 몽고디비 메소드
    User.findOne({email: req.body.email},(err,user) =>{
        if (!user) {
            return res.json({
                loginSucess: false,
            })
        }
        // 요청된 이메일이 db에 잇다면 비번이 맞는 비번인지 확인
        // user모델에 comparePassword의 메소드르 ㄹ만들어주자
        user.comparePassword(req.body.password,(err, isMatch) => {
            if(!isMatch) {
                return res.json({loginSucess: false,})
            }

        })

        // 비번까지 맞다면 토큰 생성하기
        user.generateToken((err,user) => {
            let
        })

    })

})




```
