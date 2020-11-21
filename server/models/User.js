const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10 // 글자수 
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    
    },
    email: {
        type: String,
        trim: true,
        unique: 1,
      
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
}) 

// save 함수 실행전 실행하는 함수
userSchema.pre('save', function (next) {

    var user = this;
     // 패스워드 수정할때만 
    if (user.isModified('password')) {
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
              // 에러나면 리턴
            if (err) return next(err)
            // 유저비밀번호를 안보이게 하는 작업
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

// index에서 사용할 함수를 정의
userSchema.methods.comparePassword = function (plainPassword, cb) {
     /*
        mongoDB 암호회된 비밀번호 $2b$10$l492vQ0M4s9YUBfwYkkaZOgWHExahjWC
        가 같은지 비교하기 위해서는 plainPassword(요청받은)를 암호화시켜 암호화된 pwd와 비교해줘야한다.
     */

     //this.password 암호화된 비번
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        // 에러나면 콜백함수로 에러값 리턴해서 보냄
        if (err) return cb(err);
        // 비교해서 맞으면 isMatch에 블런값 넣어서 보냄
        cb(null, isMatch);
    })
}

// 토큰 생성 메소드
userSchema.methods.generateToken = function (cb) {
    var user = this; // userSchema
    // console.log('user._id', user._id) 는 데이터 베이스의 _id 의미
    // jsonwebtoken을 이용해서 token을 생성하기 secretToken는 개발자가 정해놓은 키워드?
    var token = jwt.sign(user._id.toHexString(), 'secretToken');

     // user._id + 'secretToken' = token 
     // -> (추후 토큰을 해석할때 secretToken' 로 user._id 찾는다)
    // 'secretToken' -> user._id 

    user.token = token
    user.save(function (err, user) {
        if (err) return cb(err) // 콜백으로 에러 전달
        cb(null, user)  // 세이브 잘 되면 유저정보만 전달
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    // user._id + 'secretToken 어떠한 스크링'  = token
    //토큰을 복호화 한다. 
    jwt.verify(token, 'secretToken', function (err, decoded) {
        //  decoded == user_id
        //유저 아이디를 이용해서 유저를 찾은 다음에 
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user)
        })
    })
}
const User = mongoose.model('User', userSchema)

module.exports = { User }